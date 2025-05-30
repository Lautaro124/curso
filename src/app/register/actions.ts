"use server";

import { createSSRClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createSSRClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("fullName") as string,
        occupation: formData.get("occupation") as string,
        birth_date: formData.get("birthDate") as string,
        phone: formData.get("phone") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  console.log("🚀 ~ signup ~ error:", error)
  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
