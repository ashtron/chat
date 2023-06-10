// import Link from "next/link";
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LogIn() {
  const supabase = createClientComponentClient();

  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  async function handleSubmit(event) {
    event.preventDefault();
    
    await supabase.auth.signInWithPassword({
      email: credentials.username,
      password: credentials.password,
    });

    router.push("/");
  }
  
  function handleChange(event) {
    event.preventDefault();

    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value
    });
  }

  return (
    <main className="container">
      <article>
        <header>
          {/* Log In or {<Link href="/sign-up">Create an Account</Link>} */}
          Log In
        </header>
        <form action="submit" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" value={credentials.username} onChange={handleChange} />

          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={credentials.password} onChange={handleChange} />

          <button type="submit">
            Log In
          </button>
        </form>
      </article>
    </main>
  );
}
