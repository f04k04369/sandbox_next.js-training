import { error } from "console";
import { unstable_cache } from "next/cache";

const fetchRamenRestaurantsInner = async () => {
    const url = "https://places.googleapis.com/v1/places:searchNearby";

    const apiKey = process.env.GOOGLE_API_KEY

    const header = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key":apiKey!,
        "X-Goog-FieldMask":"places.id,places.displayName,places.types,places.primaryType,places.photos",
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

    return response.json();
};

export const fetchRamenRestaurants = unstable_cache(
    fetchRamenRestaurantsInner,
    ["ramen-restaurants"],
    { revalidate: 86400 }
);