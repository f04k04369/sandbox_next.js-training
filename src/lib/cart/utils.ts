import { Cart } from "@/types";

const sumItems = (cart: Cart) =>
  cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);

export function computeCartDisplayLogic(carts: Cart[] | undefined) {
  // カートなし
  if (!carts || carts.length === 0) {
    return { displayMode: "cartSheet", sheetCart: null, cartCount: 0 };

    // カート1件だけ
  }
  if (carts.length === 1) {
    const only = carts[0];
    return {
      displayMode: "cartSheet",
      sheetCart: only,
      cartCount: sumItems(only),
    };
  }
  return {
    displayMode: "cartDropDown",
    sheetCart: null,
    cartCount: 0,
  };
}
