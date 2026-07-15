import CarouselContainer from "@/components/carousel-container";
import Categories from "@/components/categories";
import MenuCard from "@/components/menu-card";
import MenuList from "@/components/menu-list";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import { fetchMenus } from "@/lib/menus/api";
import {
  fetchLocation,
  fetchRamenRestaurants,
  fetchRestaurants,
} from "@/lib/restaurants/api";
import Link from "next/link";

export default async function Home() {
  const { lat, lng } = await fetchLocation();
  console.log("lat", lat);
  console.log("lng", lng);
  const { data: nearbyRamenRestaurants, error: nearbyRamenRestaurantsError } =
    await fetchRamenRestaurants(lat, lng);
  const { data: nearbyRestaurants, error: nearbyRestaurantsError } =
    await fetchRestaurants(lat, lng);

  const restaurant = nearbyRamenRestaurants?.[0];

  const primaryType = restaurant?.primaryType;

  const { data: menus, error: menusError } = primaryType
    ? await fetchMenus(primaryType)
    : { data: [] };

  // console.log("menus", menus);

  return (
    <>
      <Categories />
      {/* レストラン情報表示 */}
      {!nearbyRestaurants ? (
        <p>{nearbyRestaurantsError}</p>
      ) : nearbyRestaurants.length > 0 ? (
        <Section
          title="近くのレストラン"
          expandedContent={<RestaurantList restaurants={nearbyRestaurants} />}
        >
          <CarouselContainer slideToShow={4}>
            {nearbyRestaurants.map((restaurant, index) => (
              <RestaurantCard restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにレストランがありません</p>
      )}

      {/* ラーメン店情報表示 */}
      {!nearbyRamenRestaurants ? (
        <p>{nearbyRamenRestaurantsError}</p>
      ) : nearbyRamenRestaurants.length > 0 ? (
        <Section
          title="近くのラーメン店"
          expandedContent={
            <RestaurantList restaurants={nearbyRamenRestaurants} />
          }
        >
          <CarouselContainer slideToShow={4}>
            {nearbyRamenRestaurants.map((restaurant) => (
              <RestaurantCard restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにラーメン店がありません</p>
      )}

      {/* メニュー情報表示 */}
      {!menus ? (
        <p>{menusError}</p>
      ) : menus.length > 0 && restaurant ? (
        <Section
          title={restaurant.restaurantName}
          expandedContent={
            <MenuList menus={menus}/>
          }
        >

          <CarouselContainer slideToShow={6}>
            {menus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </CarouselContainer>

        </Section>
      ) : (
        <p>メニューがありません</p>
      )}
    </>
  );
}