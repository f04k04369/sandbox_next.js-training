"use server";
import { AddressSuggestion } from "@/types";
import { getPlaceDetails } from "@/lib/restaurants/api";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function selectSuggestionAction(
  suggestion: AddressSuggestion,
  sessionToken: string,
) {
  const supabase = await createClient();
  // throw new Error("getPlaceDetailsえらー");
  console.log("selectSuggestionAction", suggestion);

  const { data: locationData, error } = await getPlaceDetails(
    suggestion.placeId,
    ["location"],
    sessionToken,
  );
  console.log("locationData", locationData);

  if (
    error ||
    !locationData?.location ||
    !locationData?.location?.latitude ||
    !locationData?.location?.longitude
  ) {
    throw new Error("住所の取得に失敗しました");
  }
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }
  // データベースに保存処理

  const { data: newAddress, error: insertError } = await supabase
    .from("addresses")
    .insert({
      name: suggestion.placeName,
      address_text: suggestion.address_text,
      latitude: locationData?.location?.latitude,
      longitude: locationData?.location?.longitude,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("住所の保存に失敗しました", insertError);
    throw new Error("住所の保存に失敗しました");
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      selected_address_id: newAddress.id,
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("プロフィールの更新に失敗しました。", updateError);
    throw new Error("プロフィールの更新に失敗しました。");
  }
}
