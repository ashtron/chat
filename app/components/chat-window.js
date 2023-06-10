import { useEffect, useRef } from "react";

export default function ChatWindow(props) {
  const { messages } = props;

  const dummy = useRef(null);

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ul>
      {messages.map((message) => {
        return message.image_url ? (
          <li key={message.id}>
            <figure>
              <img src={message.image_url} />
              <figcaption>{message.content}</figcaption>
            </figure>
          </li>
        ) : (
          <li key={message.id}>{message.content}</li>
        );
      })}
      <div ref={dummy} />
    </ul>
  );
}
