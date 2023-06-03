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
    const regex = /^\/gif\s(.+)$/;

    const gifSearchQuery = message.match(regex)
      ? message.match(regex)[1]
      : null;

    if (gifSearchQuery) {
      await supabase
        .from("messages")
        .insert([
          {
            content: message,
            image_url: await fetchRandomGifURL(gifSearchQuery),
          },
        ])
        .select();
    } else {
      await supabase
        .from("messages")
        .insert([{ content: message }])
        .select();
    }
  };

  const fetchRandomGifURL = async (query) => {
    const searchURL = `https://api.giphy.com/v1/gifs/random?api_key=${process.env.NEXT_PUBLIC_GIPHY_API_KEY}&tag=${query}`;
    const results = await fetch(searchURL);
    const parsedResults = await results.json();
    const data = parsedResults.data;

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
      }
    )
    .subscribe();

  return (
    <article>
      <header>Chat</header>
      <ul>
        {messages.map((message) => {
          return message.image_url ? (
            <li>
              <figure>
                <img
                  src={message.image_url}
                />
                <figcaption>{message.content}</figcaption>
              </figure>
            </li>
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
