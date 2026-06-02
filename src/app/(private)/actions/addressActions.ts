"use server";
import { AddressSuggestion } from "@/types";
import { getPlaceDetails } from "@/lib/restaurants/api";

export async function selectSuggestionAction(
  suggestion: AddressSuggestion,
  sessionToken: string,
) {

    throw new Error("getPlaceDetailsえらー");
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
    !locationData.location.latitude ||
    !locationData.location.longitude
  ) {
    throw new Error("住所の取得に失敗しました");
  }
}
