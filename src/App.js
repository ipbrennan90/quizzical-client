import "./App.css";
import React, { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!inputText.trim()) return;
    const userMessage = { text: inputText, isBot: false };
    const body = {
      question: inputText,
      namespace: "prod-science",
      character: "steve_brule",
      chat_session_id: "SB2",
    };

    const botMessage = { text: "", isBot: true };

    setMessages([...messages, userMessage, botMessage]);
    setInputText("");
    const response = await fetch("https://quizzical-nlbh.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.body) return;

    let decoder = new TextDecoderStream();

    const reader = response.body.pipeThrough(decoder).getReader();

    let accumulatedAnswer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      accumulatedAnswer += value;
      setMessages((currentMessages) => {
        const updatedMessages = [...currentMessages];
        const lastMessageIndex = updatedMessages.length - 1;

        updatedMessages[lastMessageIndex] = {
          ...updatedMessages[lastMessageIndex],
          text: accumulatedAnswer,
        };

        return updatedMessages;
      });
    }
  };

  return (
    <div className="App">
      <div>
        <h1>Quizzical</h1>
        <div>
          {messages.map((message, index) => (
            <div
              key={`message-${index}`}
              className={`text-white ${
                message.isBot ? "bg-green-900" : "bg-blue-500"
              }`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage}>
          <input
            placeholder="Ask me about your subject!..."
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}

export default App;
