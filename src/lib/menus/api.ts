import { createClient } from "../supabase/server";

export async function fetchCategoryMenus(primaryType: string) {
  console.log("fetching category menus for primary type", primaryType);

  const supabase = await createClient();

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

  const categoryMenus = [];

  const featuredItems = menus
    ?.filter((menu) => menu.is_featured)
    .map((menu) => ({
      id: menu.id,
      photoUtl: supabase.storage.from("menus").getPublicUrl(menu.image_path)
        .data.publicUrl,
      name: menu.name,
      price: menu.price,
    }));
  console.log("featuredItems", featuredItems);

  categoryMenus.push({
    id: "featured",
    categoryName: "注目商品",
    items: featuredItems,
  });

  console.log("categoryMenus", categoryMenus);
}
