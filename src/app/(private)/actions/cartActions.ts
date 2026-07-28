"use server";
import { toCart } from "@/lib/cart/utils";
import { getPlaceDetails } from "@/lib/restaurants/api";
import { createClient } from "@/lib/supabase/server";
import { Cart, Menu, RawCart } from "@/types";
import { redirect } from "next/navigation";

type addToCartActionResponse = { type: "new", cart: Cart } | {type: "update", id: number} 

export async function addToCartAction(
  selectedItem: Menu,
  quantity: number,
  restaurantId: string,
): Promise<addToCartActionResponse> {
  const supabase = await createClient();
  const bucket = supabase.storage.from("menus");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: existingCart, error: existingCartError } = await supabase
    .from("carts")
    .select("id")
    .match({ user_id: user.id, restaurant_id: restaurantId })
    .maybeSingle();

  if (existingCartError) {
    console.error("カートの取得に失敗しました", existingCartError);
    throw new Error("カートの取得に失敗しました");
  }

  // 既存のカートが存在しない場合、カートを新規作成＆アイテムを追加
  if (!existingCart) {
    const { data: newCart, error: newCartError } = await supabase
      .from("carts")
      .insert({
        restaurant_id: restaurantId,
        user_id: user.id,
      })
      .select("id")
      .single();

    if (newCartError) {
      console.error("カートの作成に失敗しました", newCartError);
      throw new Error("カートの作成に失敗しました");
    }

    const newCartId = newCart.id;

    // カートの中にアイテムを追加
    const { error: insertError } = await supabase.from("cart_items").insert({
      quantity: quantity,
      cart_id: newCartId,
      menu_id: selectedItem.id,
    });

    if (insertError) {
      console.error("アイテムの追加に失敗しました", insertError);
      throw new Error("アイテムの追加に失敗しました");
    }

    const { data: insertedCart, error: insertedCartsError } = await supabase
      .from("carts")
      .select(
        `
      id,
      restaurant_id,
      cart_items (
       id,
       quantity,
       menus (
        id,
        name,
        price,
        image_path
       )
      )
    `,
      )
      .match({ user_id: user.id, id: newCartId })
      .single();

    if (insertedCartsError) {
      console.error("カートの取得に失敗しました", insertedCartsError);
      throw new Error(
        `レストランデータの取得に失敗しました${insertedCartsError}`,
      );
    }
    const { data: restaurantData, error } = await getPlaceDetails(
      restaurantId,
      ["displayName", "photos"],
    );

    if (!restaurantData || error) {
      throw new Error(`レストランデータの取得に失敗しました${error}`);
    }

    const getPublicUrl = (imagePath: string) =>
      bucket.getPublicUrl(imagePath).data.publicUrl;

    const updatedCart = toCart(
      insertedCart as RawCart,
      restaurantData,
      getPublicUrl,
    );

    return { type: "new", cart: updatedCart };
  }

  // 既存のカートが存在する場合、アイテムを追加 or 数量を更新
  const { data, error: upsertError } = await supabase
    .from("cart_items")
    .upsert(
      {
        quantity: quantity,
        cart_id: existingCart.id,
        menu_id: selectedItem.id,
      },
      {
        onConflict: "menu_id,cart_id",
      },
    )
    .select("id")
    .single();

  if (upsertError) {
    console.error("アイテムの追加/更新に失敗しました", upsertError);
    throw new Error("アイテムの追加/更新に失敗しました");
  }

  return { type: "update", id: data.id };
}

export async function updateCartItemAction(
  quantity: number,
  cartItemId: number,
  cartId: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }
  if (quantity === 0) {
    // 削除処理

    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("cart_id", cartId);

    if (error) {
      console.error("カートの取得に失敗しました", error);
      throw new Error("カートの取得に失敗しました");
    }
    // カート自体を削除
    if (count === 1) {
      const { error: deleteCartError } = await supabase
        .from("carts")
        .delete()
        .match({ user_id: user.id, id: cartId });

      if (deleteCartError) {
        console.error("カートの削除に失敗しました", deleteCartError);
        throw new Error("カートの削除に失敗しました");
      }
      return;
    }

    const { error: deleteItemError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);
    if (deleteItemError) {
      console.error("カートアイテムの削除に失敗しました", deleteItemError);
      throw new Error("カートの削除に失敗しました。");
      return;
    }
  }
  // 数量更新処理
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({ quantity: quantity })
    .eq("id", cartItemId);

  if (updateError) {
    console.error("カートアイテムの更新に失敗しました", updateError);
    throw new Error("カートアイテムの更新に失敗しました");
  }
}


export function checkoutAction(cartId: number) {
  
}