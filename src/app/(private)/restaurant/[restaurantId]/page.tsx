import { Button } from "@/components/ui/button";
import { getPlaceDetails } from "@/lib/restaurants/api";
import { Heart } from "lucide-react";
import Image from "next/image";

export default async function RestaurantPage({params, searchParams}: {
  params: Promise<{restaurantId: string}>;
  searchParams: Promise<{sessionToken: string}>;
}) {
  const { restaurantId } = await params
  const { sessionToken } = await searchParams

  console.log("restaurantId", restaurantId);
  console.log("sessionToken", sessionToken);

  // await getPlaceDetails()

  return (
    <div>
      <div className="h-64 rounded-xl shadow-md relative overflow-hidden">
        <Image
          src="/test-img.png"
          alt={"レストラン画像"}
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
          <Heart
            color="grey"
            strokeWidth={3}
            size={15}
          />
        </Button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">レストラン名</h1>
        </div>
        
        <div className="flex-1">
          <div className="ml-auto w-80 bg-yellow-300">検索バー</div>
        </div>
      </div>
    </div>
  );
}
