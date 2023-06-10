"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "./lib/auth-utilities";

import ChatWindow from "./components/chat-window";

import "./home.css";

export default function Home() {
  const supabase = createClientComponentClient();

  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    async function protectPage() {
      const session = await getSession();

      if (!session) {
        router.push("/login");
      }
    }

    protectPage();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await supabase.from("messages").select("*");

      setMessages(messages.data);
    };

    fetchMessages();
  }, []);

  const insertMessage = async (message) => {
    const regex = /^\/gif\s(.+)$/;

    const gifSearchQuery = message.match(regex)
      ? message.match(regex)[1]
      : null;

    if (gifSearchQuery) {
      const randomGifURL = await fetchRandomGifURL(gifSearchQuery);

      await supabase.from("messages").insert([
        {
          content: message,
          image_url: randomGifURL,
        },
      ]);
    } else {
      await supabase.from("messages").insert([{ content: message }]);
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

  const handleSend = (event) => {
    event.preventDefault();

    insertMessage(messageInput);
    setMessageInput("");
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSend(event);
    }
  };

  const handleClick = (event) => {
    handleSend(event);
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
    <main>
      <article>
        <header>Chat</header>
        <ChatWindow messages={messages} />
        <footer>
          <input
            value={messageInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleClick}>Send</button>
        </footer>
      </article>
    </main>
  );
}
