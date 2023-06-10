import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function getSession() {
  const supabase = createClientComponentClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
