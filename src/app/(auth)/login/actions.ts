'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";

export async function login() {
    // Googleログイン
    console.log("google login")
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: 'http://localhost:3000/auth/callback',
        },
    })

    if (error){
    console.error(error);
    
    }
   
    if (data.url) {
        redirect(data.url)
    }
}

export async function logout() {
  const supabase = await createClient();
  let { error } = await supabase.auth.signOut()

  if (error){
    console.error(error);
    
  }
  redirect("/login")
}
