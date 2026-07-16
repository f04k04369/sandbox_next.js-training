import MenuContent from "@/components/menu-content";
import MenuSearchBar from "@/components/menu-search-bar";
import { Button } from "@/components/ui/button";
import { fetchCategoryMenus } from "@/lib/menus/api";
import { getPlaceDetails } from "@/lib/restaurants/api";
import { Heart } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function RestaurantPage({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ sessionToken: string, searchMenu: string }>;
}) {
  const { restaurantId } = await params;
  const { sessionToken, searchMenu } = await searchParams;

  console.log("restaurantId", restaurantId);
  console.log("sessionToken", sessionToken);
  console.log("searchMenu", searchMenu);

  const { data: restaurant, error } = await getPlaceDetails(
    restaurantId,
    ["displayName", "photos", "primaryType"],
    sessionToken,
  );

  console.log("restaurant", restaurant);

  const primaryType = restaurant?.primaryType;

  const { data: categoryMenus, error: menusError } = primaryType
    ? await fetchCategoryMenus(primaryType, searchMenu)
    : { data: [] };

  console.log("categoryMenusです。", categoryMenus, searchMenu);

  if (!restaurant) notFound();

  return (
    <>
      <div>
        <div className="h-64 rounded-xl shadow-md relative overflow-hidden">
          <Image
            src={restaurant.photoUrl!}
            alt={restaurant?.displayName ?? "レストラン画像"}
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            fill
          />
          <Button
            size="icon"
            variant="outline"
            className="absolute top-4 right-4 shadow rounded-full"
          >
            <Heart color="grey" strokeWidth={3} size={15} />
          </Button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{restaurant.displayName}</h1>
          </div>

          <div className="flex-1">
            <div className="ml-auto w-80">
              <MenuSearchBar />
            </div>
          </div>
        </div>
      </div>

      {!categoryMenus ? (
        <p>{menusError}</p>
      ) : categoryMenus.length > 0 ? (
        <MenuContent categoryMenus={categoryMenus} restaurantId={restaurantId}/>
      ) : (
        <p>メニューがありません</p>
      )}
    </>
  );
}
