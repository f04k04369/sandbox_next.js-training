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
  displayName?: {
    languageCode?: string;
    text?: string;
  };
  primaryType?: string;
  photos?: PlacePhoto[]
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
  displayName?: string;
  primaryType?: string;
  photoUrl?: string;
}


export interface Address {
  id: number;
  name: string;
  address_text: string;
  latitude: number;
  longitude: number;
}

export interface CategoryMenu {
  categoryName: string;
  id: string;
  items: Menu[];
}

export interface Menu {
  id: string;
  name: string;
  photoUrl: string;
  price: number;
}

export interface Cart {
  restaurantName: string | undefined;
  photoUrl: string;
  id: number;
  restaurant_id: string;
  cart_items: CartItem[];
}

export interface CartItem {
  id: number;
  quantity: number;
  menus: {
    id: number;
    name: string;
    price: number;
    photoUrl: string;
  };
}

/** Supabase から返るメニューの生データ */
export type RawMenu = {
  id: number;
  name: string;
  price: number;
  image_path: string;
};

/** Supabase から返る cart_items の生データ */
export type RawCartItem = {
  id: number;
  quantity: number;
  menus: RawMenu | RawMenu[];
};

/** Supabase から返る carts の生データ */
export type RawCart = {
  id: number;
  restaurant_id: string;
  cart_items: RawCartItem[];
};
