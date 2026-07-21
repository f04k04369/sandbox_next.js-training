import { Cart } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }

  const data = await response.json();

  return data;
};

export function useCart() {
  const {
    data: carts,
    error: cartError,
    isLoading,
    mutate: mutateCart,
  } = useSWR<Cart[]>(`/api/cart`, fetcher);
  
  return {carts, cartError, isLoading, mutateCart}
}
