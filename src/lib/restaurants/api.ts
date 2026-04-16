import { GooglePlacesSearchApiResponse } from "@/types";
import { transformPlaceResults } from "./utils";

export async function fetchRestaurants() {
    "use cache";

    const url = "https://places.googleapis.com/v1/places:searchNearby";

    const apiKey = process.env.GOOGLE_API_KEY

    const header = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key":apiKey!,
        "X-Goog-FieldMask":"places.id,places.displayName,places.primaryType,places.photos",
    }
    
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
        "includedTypes": desiredTypes,
        "maxResultCount": 10,
        "locationRestriction": {
            "circle": {
            "center": {
                "latitude": 34.2895631,//香川
                "longitude": 134.0473344},
            "radius": 10000.0
            }
        },
        languageCode:"ja",
        rankPreference: "DISTANCE",
    }

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: header,
        next: {revalidate: 86400}
    });

    if(!response.ok){
        const errorData = response.json();
        console.error(errorData);
        return {error: `NearbySearchリクエスト失敗:${response.status}`}
    }

    const data:GooglePlacesSearchApiResponse = await response.json();
    if(!data.places){
        return {data: []};
    }
    const nearbyPlaces = data.places;

    const Restaurants = await transformPlaceResults(nearbyPlaces);
    console.log("Restaurants", Restaurants)
    return { data: Restaurants }
}

export async function fetchRamenRestaurants() {
    "use cache";

    const url = "https://places.googleapis.com/v1/places:searchNearby";

    const apiKey = process.env.GOOGLE_API_KEY

    const header = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key":apiKey!,
        "X-Goog-FieldMask":"places.id,places.displayName,places.primaryType,places.photos",
    }

    const requestBody = {
        "includedPrimaryTypes": ["ramen_restaurant"],
        "maxResultCount": 10,
        "locationRestriction": {
            "circle": {
            "center": {
                "latitude": 34.2895631,//香川
                "longitude": 134.0473344},
            "radius": 10000.0
            }
        },
        languageCode:"ja",
        rankPreference: "DISTANCE",
    }

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: header,
        next: {revalidate: 86400}
    });

    if(!response.ok){
        const errorData = response.json();
        console.error(errorData);
        return {error: `NearbySearchリクエスト失敗:${response.status}`}
    }

    const data:GooglePlacesSearchApiResponse = await response.json();
    if(!data.places){
        return {data: []};
    }
    const nearbyRamenPlaces = data.places;

    const RamenRestaurants = await transformPlaceResults(nearbyRamenPlaces);
    console.log(RamenRestaurants)
    return { data: RamenRestaurants }
}

export async function getPhotoUrl(name: string, maxWidth = 400){
    "use cache";
    console.log("getPhotoUrl実行");
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
    return url;
}