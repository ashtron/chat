"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect, useRef } from "react";

import "./home.css";

export default function Home() {
  const supabase = createPagesBrowserClient();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await supabase.from("messages").select("*");

      setMessages(messages.data.map((item) => item.content));
    };

    fetchMessages();

    supabase
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
  }, []);

  const dummy = useRef(null);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      insertMessage(messageInput);
    }
  };

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

  return (
    <article>
      <header>Chat</header>
      <ul>
        {messages.map((message) => {
          return <li>{message}</li>;
        })}
        <div ref={dummy} />
      </ul>
      <footer>
        <input
          value={messageInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleClick}>Send</button>
      </footer>
    </article>
  );
}
