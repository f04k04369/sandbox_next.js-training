import { getPlaceDetails } from "@/lib/restaurants/api";
import { createClient } from "@/lib/supabase/server";
import { Cart } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "ユーザーが存在しません" },
        { status: 401 },
      );
    }

    const { data: carts, error: cartsError } = await supabase
      .from("carts")
      .select(
        `
        id,
        restaurant_id,
        some_column,
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
      .eq("user_id", user.id);

    if (cartsError) {
      console.error("カートの取得に失敗しました", cartsError);
      return NextResponse.json(
        { error: "カートの取得に失敗しません" },
        { status: 500 },
      );
    }

    console.log("carts", carts);

    const promises = carts.map(async (cart): Promise<Cart> => {
      const { data: restaurantData, error } = await getPlaceDetails(
        cart.restaurant_id,
        ["displayName", "photos"],
      );

      if (!restaurantData || error) {
        throw new Error(`レストランデータの取得に失敗しました${error}`);
      }

      return {
        id: cart.id,
        restaurant_id: cart.restaurant_id,
        restaurantName: restaurantData.displayName,
        photoUrl: restaurantData.photoUrl!,
        cart_items: cart.cart_items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          menus: Array.isArray(item.menus) ? item.menus[0] : item.menus,
        })),
      };
    });

    const results = await Promise.all(promises);

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 },
    );
  }
}

