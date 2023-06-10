"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { getSession } from "../lib/auth-utilities";

export default async function Navbar() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  console.log({session: await getSession()})

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav>
      <ul>
        <li>
            <strong>CHAT</strong>
        </li>
      </ul>
      <ul>
        <li><button onClick={logOut}>Log Out</button></li>
      </ul>
    </nav>
  );
}
