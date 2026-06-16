import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 住所情報をテーブルから取得
    // 選択中の住所情報をテーブルから取得

    let addressList: Address[] = [];
    let selectedAddress: Address | null = null;

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

    // 住所情報をテーブルから取得
    const { data: addressData, error: addressError } = await supabase
      .from("addresses")
      .select("id,name,address_text,latitude,longitude")
      .eq("user_id", user.id);

    if (addressError) {
      console.error("住所情報の取得に失敗しました", addressError);
      return NextResponse.json(
        { error: "住所情報の取得に失敗しました" },
        { status: 500 },
      );
    }

    addressList = addressData;

    // 選択中の住所情報をテーブルから取得
    const { data: selectedAddressData, error: selectedAddressDataError } =
      await supabase
        .from("profiles")
        .select("addresses(id,name,address_text,latitude,longitude)")
        .eq("id", user.id)
        .single();

    if (selectedAddressDataError) {
      console.error(
        "プロフィールの取得に失敗しました",
        selectedAddressDataError,
      );
      return NextResponse.json(
        { error: "プロフィールの取得に失敗しました" },
        { status: 500 },
      );
    }

    selectedAddress = selectedAddressData.addresses?.[0] ?? null;
    
    console.log("addressList", addressList);
    console.log("selectedAddress", selectedAddress);

    return NextResponse.json({ addressList, selectedAddress });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました" },
      { status: 500 },
    );
  }
}

interface Address {
  id: number;
  name: string;
  address_text: string;
  latitude: number;
  longitude: number;
}
