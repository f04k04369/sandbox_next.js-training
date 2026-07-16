"use server";
import { Menu } from "@/types";

export async function addToCartAction(
  selectedItem: Menu,
  quantity: number,
  restaurantId: string,
) {
    console.log("server_actions_seletedItem", selectedItem);
    console.log("server_actions_quantity", quantity);
    console.log("server_actions_restaurantId", restaurantId);
}
