import CarouselContainer from "@/components/carousel-container";
import Categories from "@/components/categories";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import { fetchRamenRestaurants, fetchRestaurants } from "@/lib/restaurants/api";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Suspense
        fallback={<p className="text-muted-foreground py-4">カテゴリを読み込み中…</p>}
      >
        <Categories />
      </Suspense>

      <Suspense fallback={<SectionFallback title="近くレストラン" />}>
        <NearbyRestaurantSection />
      </Suspense>

      <Suspense fallback={<SectionFallback title="近くのラーメン店" />}>
        <RamenRestaurantSection />
      </Suspense>
    </>
  );
}

function SectionFallback({ title }: { title: string }) {
  return (
    <Section title={title}>
      <p className="text-muted-foreground py-4">読み込み中…</p>
    </Section>
  );
}

async function NearbyRestaurantSection() {
  const { data: nerarbyRestaurants, error: nerarbyRestaurantsError } =
    await fetchRestaurants();

  if (!nerarbyRestaurants) {
    return <p>{nerarbyRestaurantsError}</p>;
  }

  if (nerarbyRestaurants.length === 0) {
    return <p>近くにレストランがありません</p>;
  }

  return (
    <Section
      title="近くレストラン"
      expandedContent={<RestaurantList restaurants={nerarbyRestaurants} />}
    >
      <CarouselContainer slideToShow={4}>
        {nerarbyRestaurants.map((restaurant, index) => (
          <RestaurantCard key={index} restaurant={restaurant} />
        ))}
      </CarouselContainer>
    </Section>
  );
}

async function RamenRestaurantSection() {
  const { data: nerarybyRamenRestaurants, error: nerarybyRamenRestaurantsError } =
    await fetchRamenRestaurants();

  if (!nerarybyRamenRestaurants) {
    return <p>{nerarybyRamenRestaurantsError}</p>;
  }

  if (nerarybyRamenRestaurants.length === 0) {
    return <p>近くにラーメン店がありません</p>;
  }

  return (
    <Section
      title="近くのラーメン店"
      expandedContent={<RestaurantList restaurants={nerarybyRamenRestaurants} />}
    >
      <CarouselContainer slideToShow={4}>
        {nerarybyRamenRestaurants.map((restaurant, index) => (
          <RestaurantCard key={index} restaurant={restaurant} />
        ))}
      </CarouselContainer>
    </Section>
  );
}
