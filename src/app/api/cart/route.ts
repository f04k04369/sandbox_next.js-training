import { toCart } from "@/lib/cart/utils";
import { getPlaceDetails } from "@/lib/restaurants/api";
import { createClient } from "@/lib/supabase/server";
import { Cart, RawCart } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const bucket = supabase.storage.from("menus");
    const getPublicUrl = (imagePath: string) =>
      bucket.getPublicUrl(imagePath).data.publicUrl;

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

    const promises = (carts as RawCart[]).map(async (rawCart): Promise<Cart> => {
      const { data: restaurantData, error } = await getPlaceDetails(
        rawCart.restaurant_id,
        ["displayName", "photos"],
      );

      if (!restaurantData || error) {
        throw new Error(`レストランデータの取得に失敗しました${error}`);
      }

      return toCart(rawCart, restaurantData, getPublicUrl);
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
