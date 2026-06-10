import { GooglePlacesDetailsApiResponse, GooglePlacesSearchApiResponse, PlaceDetailsAll } from "@/types";
import { transformPlaceResults } from "./utils";

export async function fetchRestaurants() {
  "use cache";
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const desiredTypes = [
    "japanese_restaurant",
    "cafe",
    "cafeteria",
    "coffee_shop",
    "chinese_restaurant",
    "fast_food_restaurant",
    "hamburger_restaurant",
    "french_restaurant",
    "italian_restaurant",
    "pizza_restaurant",
    "ramen_restaurant",
    "sushi_restaurant",
    "korean_restaurant",
    "indian_restaurant",
  ];

  const requestBody = {
    includedTypes: desiredTypes,
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 34.2895631, //香川
          longitude: 134.0473344,
        },
        radius: 10000.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    const errorData = response.json();
    console.error(errorData);
    return { error: `NearbySearchリクエスト失敗:${response.status}` };
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  if (!data.places) {
    return { data: [] };
  }
  const nearbyPlaces = data.places;

  const matchingPlaces = nearbyPlaces.filter(
    (place) => place.primaryType && desiredTypes.includes(place.primaryType),
  );

  const Restaurants = await transformPlaceResults(matchingPlaces);
  console.log("Restaurants", Restaurants);
  return { data: Restaurants };
}

// キーワード検索
export async function fetchRestaurantsByKeyword(query: string) {
  "use cache";

  const url = "https://places.googleapis.com/v1/places:searchText";

  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    textQuery: query,
    maxResultCount: 10,
    locationBias: {
      circle: {
        center: {
          latitude: 34.2895631, //香川
          longitude: 134.0473344,
        },
        radius: 10000.0,
      },
    },
    languageCode: "ja",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `TextSearchリクエスト失敗:${response.status}` };
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  if (!data.places) {
    return { data: [] };
  }
  const textSearchPlaces = data.places;

  const restaurants = await transformPlaceResults(textSearchPlaces);
  return { data: restaurants };
}

// カテゴリ検索機能
export async function fetchCategoryRestaurants(category: string) {
  "use cache";

  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    includedPrimaryTypes: [category],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 34.2895631, //香川
          longitude: 134.0473344,
        },
        radius: 10000.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    const errorData = response.json();
    console.error(errorData);
    return { error: `NearbySearchリクエスト失敗:${response.status}` };
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  if (!data.places) {
    return { data: [] };
  }
  const categoryPlaces = data.places;

  const categoryRestaurants = await transformPlaceResults(categoryPlaces);
  console.log(categoryRestaurants);
  return { data: categoryRestaurants };
}

// 近くのラーメン屋を検索
export async function fetchRamenRestaurants() {
  "use cache";

  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 34.2895631, //香川
          longitude: 134.0473344,
        },
        radius: 10000.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    const errorData = response.json();
    console.error(errorData);
    return { error: `NearbySearchリクエスト失敗:${response.status}` };
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  if (!data.places) {
    return { data: [] };
  }
  const nearbyRamenPlaces = data.places;

  const RamenRestaurants = await transformPlaceResults(nearbyRamenPlaces);
  console.log(RamenRestaurants);
  return { data: RamenRestaurants };
}

export async function getPhotoUrl(name: string, maxWidth = 400) {
  "use cache";
  console.log("getPhotoUrl実行");
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
  return url;
}

export async function getPlaceDetails(
  placeId: string,
  fields: string[],
  sessionToken?: string,
) {
    console.log("getPlaceDetails", placeId, fields, sessionToken);

    const fieldsParam = fields.join(",");
    

    let url:string;

    if (sessionToken){
      url = `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${sessionToken}&languageCode=ja`
    } else {
      url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=ja`
    }
      

  const apiKey = process.env.GOOGLE_API_KEY;

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey!,
    "X-Goog-FieldMask": fieldsParam, 
  };


  const response = await fetch(url, {
    method: "GET",
    headers: header,
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `PlaceDetailsリクエスト失敗:${response.status}` };
  }

  const data: GooglePlacesDetailsApiResponse = await response.json();
  const results: PlaceDetailsAll = {}
  if (fields.includes("location") && data.location) {
    results.location = data.location
  }
  return {data: results}
}
