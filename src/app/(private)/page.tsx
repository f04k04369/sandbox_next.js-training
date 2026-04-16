import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import Section from "@/components/section";
import { fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";
import Image from "next/image";

export default async function Home() {
  const {data: nerarybyRamenRestaurants, error: nerarybyRamenRestaurantsError} = await fetchRamenRestaurants();
  const {data: nerarbyRestaurants, error: nerarbyRestaurantsError} = await fetchRestaurants();

  return (
    <>
    {!nerarybyRamenRestaurants ? (
      <p>{nerarybyRamenRestaurantsError}</p>
    ): nerarybyRamenRestaurants.length > 0 ? (
      <Section title="近くのラーメン店">
      <CarouselContainer slideToShow={4}>
        {nerarybyRamenRestaurants.map((restaurant, index) => (
          <RestaurantCard key={index} restaurant={restaurant}/>
        ))}
      </CarouselContainer>
    </Section>
    ): (
      <p>近くにラーメン店がありません</p>
    )}
        </>
  );
}
