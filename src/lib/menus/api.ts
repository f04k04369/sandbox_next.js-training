import { CategoryMenu, Menu } from "@/types";
import { createClient } from "../supabase/server";

export async function fetchCategoryMenus(primaryType: string) {
  console.log("fetching category menus for primary type", primaryType);

  const supabase = await createClient();
  const bucket = supabase.storage.from("menus")

  const { data: menus, error: menusError } = await supabase
    .from("menus")
    .select("*")
    .eq("genre", primaryType);

  if (menusError) {
    console.error("メニューの取得に失敗しました", menusError);
    return { error: "メニューの取得に失敗しました" };
  }
  console.log("メニューの取得に成功しました", menus);

  if (menus?.length === 0) {
    return { data: [] };
  }

  const categoryMenus: CategoryMenu[] = [];



  const featuredItems = menus
    ?.filter((menu) => menu.is_featured)
    .map(
      (menu): Menu => ({
        id: menu.id,
        photoUrl: bucket.getPublicUrl(menu.image_path)
          .data.publicUrl,
        name: menu.name,
        price: menu.price,
      }),
    );
  console.log("featuredItems", featuredItems);

  categoryMenus.push({
    id: "featured",
    categoryName: "注目商品",
    items: featuredItems,
  });

  const categories = Array.from(new Set(menus.map((menu) => menu.category)));
  console.log("categories", categories);

  for (const category of categories) {
    const items = menus
      .filter((menu) => menu.category === category)
      .map(
        (menu): Menu => ({
          id: menu.id,
          name: menu.name,
          price: menu.price,
          photoUrl: bucket.getPublicUrl(menu.image_path)
            .data.publicUrl,
        }),
      );

    categoryMenus.push({
      id: category,
      categoryName: category,
      items: items,
    });
  }
  console.log("categoryMenus", categoryMenus);

  return { data: categoryMenus };
}
