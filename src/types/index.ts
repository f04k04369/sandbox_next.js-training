export interface Restaurant {
  id: string;
  restaurantName?: string;
  primaryType?: string;
  photoUrl?: string;
}

export interface GooglePlacesSearchApiResponse {
  places?: PlaceSearchResult[];
}

export interface PlaceSearchResult {
  id: string;
  displayName?: {
    languageCode?: string;
    text?: string;
  };
  primaryType?: string;
  photos?: PlacePhoto[];
}

export interface PlacePhoto {
  name?: string;
}

export interface GooglePlacesAutoCompleteApiResponse {
  suggestions?: PlaceAutocompleteResult[];
}

export interface PlaceAutocompleteResult {
  placePrediction?: {
    place?: string;
    placeId?: string;
    structuredFormat?: {
      mainText?: {
        text?: string;
      };
      secondaryText?: {
        text?: string;
      };
    };
  };
  queryPrediction?: {
    text?: {
      text?: string;
    };
  };
}

export interface GooglePlacesDetailsApiResponse {
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

export type RestaurantSuggestion =
  | {
      type: "placePrediction";
      placeId?: string;
      placeName: string;
    }
  | {
      type: "queryPrediction";
      query: string;
    };

export interface AddressSuggestion {
  placeId: string;
  placeName: string;
  address_text: string;
}

export interface PlaceDetailsAll {
  location?: {
    latitude?: number;
    longitude?: number;
  };
}


export interface Address {
  id: number;
  name: string;
  address_text: string;
  latitude: number;
  longitude: number;
}
