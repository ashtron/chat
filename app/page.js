"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect, useRef } from "react";

import "./home.css";

export default function Home() {
  const supabase = createPagesBrowserClient();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const dummy = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await supabase.from("messages").select("*");

      setMessages(messages.data);
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const insertMessage = async (message) => {
    await supabase
      .from("messages")
      .insert([{ content: message }])
      .select();
  };

  const fetchRandomGif = async () => {
    const data = await fetch(
      "https://api.giphy.com/v1/gifs/random?api_key=dAIQnIxqaWw2IguBnI6o5t2WY2Xubp17&tag=burrito"
    );

    console.log("data:", await data);

    return data.images.original.url;
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

  const handleClick = (event) => {
    event.preventDefault();

    insertMessage(messageInput);
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
        setMessages([...messages, payload.new]);
        console.log("payload:", payload);
      }
    )
    .subscribe();

  return (
    <article>
      <header>Chat</header>
      <ul>
        {messages.map((message) => {
          console.log("message:", message);
          return message.image_url ? (
            <img src={message.image_url} alt="" />
          ) : (
            <li>{message.content}</li>
          );
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
