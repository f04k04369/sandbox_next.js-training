import { Cart, CartItem, RawCart, RawCartItem, RawMenu } from "@/types";

const sumItems = (cart: Cart) =>
  cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);

export function computeCartDisplayLogic(carts: Cart[] | undefined, selectedCart: Cart | null) {
  // カートなし
  if (!carts || carts.length === 0) {
    return { displayMode: "cartSheet", sheetCart: null, cartCount: 0 };

  }
  // カート1件だけ
  if (carts.length === 1) {
    const only = carts[0];
    return {
      displayMode: "cartSheet",
      sheetCart: only,
      cartCount: sumItems(only),
    };
  }
    // 選択されたカートがある場合
    if (selectedCart) {
      return {
        displayMode: "cartSheet",
        sheetCart: selectedCart,
        cartCount: sumItems(selectedCart),
      };
    }  

  return {
    displayMode: "cartDropDown",
    sheetCart: null,
    cartCount: 0,
  };
}

function normalizeMenu(menu: RawMenu | RawMenu[]): RawMenu {
  return Array.isArray(menu) ? menu[0] : menu;
}

export function toCartItem(
  item: RawCartItem,
  getPublicUrl: (imagePath: string) => string,
): CartItem {
  const { image_path, ...restMenu } = normalizeMenu(item.menus);

  return {
    id: item.id,
    quantity: item.quantity,
    menus: {
      ...restMenu,
      photoUrl: getPublicUrl(image_path),
    },
  };
}

export function toCart(
  rawCart: RawCart,
  restaurant: { displayName?: string; photoUrl?: string },
  getPublicUrl: (imagePath: string) => string,
): Cart {
  const { id, restaurant_id } = rawCart;

  return {
    ...{ id, restaurant_id },
    restaurantName: restaurant.displayName,
    photoUrl: restaurant.photoUrl!,
    cart_items: rawCart.cart_items.map((item) =>
      toCartItem(item, getPublicUrl),
    ),
  };
}
