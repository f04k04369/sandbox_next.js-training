import Categories from "@/components/categories";
import RestaurantList from "@/components/restaurant-list";
import {
  fetchCategoryRestaurants,
  fetchLocation,
  fetchRestaurantsByKeyword,
} from "@/lib/restaurants/api";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams: Promise<{ category?: string; restaurant?: string }>;
};

export default async function SaerchPage({ searchParams }: SearchPageProps) {
  const {lat, lng} = await fetchLocation()
  return (
    <Suspense
      fallback={<p className="text-muted-foreground py-8">読み込み中…</p>}
    >
      <SaerchPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SaerchPageContent({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const category = params.category?.trim();
  const restaurant = params.restaurant?.trim();
  
  const {lat, lng} = await fetchLocation();

  if (category) {
    const { data: categoryRestaurants, error: fetchError } =
      await fetchCategoryRestaurants(category, lat, lng);

    return (
      <>
        <div className="mb-4">
          <Categories />
        </div>
        {!categoryRestaurants ? (
          <p>{fetchError}</p>
        ) : categoryRestaurants.length > 0 ? (
          <RestaurantList restaurants={categoryRestaurants} />
        ) : (
          <p className="text-destructive">
            カテゴリ<strong>{category}</strong>
            に一致するレストランが見つかりません
          </p>
        )}
      </>
    );
  } else if (restaurant) {
    const { data: restaurants, error: fetchError } =
      await fetchRestaurantsByKeyword(restaurant, lat, lng);

    return (
      <>
        {!restaurants ? (
          <p>{fetchError}</p>
        ) : restaurants.length > 0 ? (
          <>
            <div className="text-lg font-bold mb-4">
              {restaurant}の検索結果{restaurants.length}件
            </div>
            <RestaurantList restaurants={restaurants} />
          </>
        ) : (
          <p className="text-destructive">
            <strong>{restaurant}</strong>
            に一致するレストランが見つかりません
          </p>
        )}
      </>
    );
  } else {
    redirect("/");
  }
}
