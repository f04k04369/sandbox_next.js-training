import { createClient } from "../supabase/server";

export async function fetchCategoryMenus(primaryType: string) {
  console.log("fetching category menus for primary type", primaryType);

  const supabase = createClient();

  let { data: menus, error: menusError } = await (await supabase).from("menus").select("*").eq("genre", primaryType);
  
  if(menusError) {
    console.error("メニューの取得に失敗しました", menusError);
    return { error: "メニューの取得に失敗しました"}
  }
  console.log("メニューの取得に成功しました", menus);
  
  if(menus?.length === 0) {
    return {data: []}
  }
  
}
