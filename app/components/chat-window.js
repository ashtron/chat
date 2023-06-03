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
   )
}