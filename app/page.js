"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

import "./home.css";

export default function Home() {
  const [messages, setMessages] = useState([
    "hello",
    "what's up",
    "nothing much hbu",
    "same",
    "bye then",
    "bye",
  ]);

  const supabase = createPagesBrowserClient();

  const handleClick = () => {};

  return (
    <article>
      <header>Chat</header>
      <ul>
        {messages.map((message) => {
          return <li>{message}</li>;
        })}
      </ul>
      <footer>
        <button onClick={handleClick}>Send</button>
      </footer>
    </article>
  );
}
