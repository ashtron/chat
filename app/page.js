"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

import "./home.css";

export default function Home() {
  const supabase = createPagesBrowserClient();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await supabase.from("messages").select("*");

      setMessages(messages.data.map((item) => item.content));
    };

    fetchMessages();
  }, []);

  const [messageInput, setMessageInput] = useState("");

  // const messagesSubscripchantion = supabase
  //   .from("messages")
  //   .select("*")
  //   .on("INSERT", (data) => {
  //     setMessages([...messages, data.content]);
  //   })
  //   .subscribe();

  const channel = supabase
    .channel("table_db_changes")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        setMessages([...messages, payload.new.content]);
      }
    )
    .subscribe();

  const insertMessage = async (message) => {
    await supabase
      .from("messages")
      .insert([{ content: message }])
      .select();
  };

  const handleClick = (event) => {
    event.preventDefault();

    insertMessage(messageInput);
  };

  const handleChange = (event) => {
    event.preventDefault();

    setMessageInput(event.target.value);
  };

  return (
    <article>
      <header>Chat</header>
      <ul>
        {messages.map((message) => {
          return <li>{message}</li>;
        })}
      </ul>
      <footer>
        <input value={messageInput} onChange={handleChange} />
        <button onClick={handleClick}>Send</button>
      </footer>
    </article>
  );
}
