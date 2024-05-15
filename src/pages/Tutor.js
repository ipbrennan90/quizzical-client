import "../App.css";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

async function getSessionId(chatSessionId) {
  const body = {
    chat_session_id: chatSessionId,
  };

  const response = await fetch(`${process.env.REACT_APP_API_URL}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const response_body = await response.json();
  return response_body.data.chat_session_id;
}

export default function Tutor() {
  const [messages, setMessages] = useState([]);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!inputText.trim()) return;
    const currentChatSessionId = await getSessionId(chatSessionId);
    setChatSessionId(currentChatSessionId);
    const userMessage = { text: inputText, isBot: false };
    const body = {
      question: inputText,
      namespace: "prod-science",
      character: "steve_brule",
      chat_session_id: currentChatSessionId,
    };

    const botMessage = { text: "", isBot: true };

    setMessages([...messages, userMessage, botMessage]);
    setInputText("");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
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
        <div className="text-4xl text-slate-700">Quizzical</div>
        <div className="flex w-full">
          <div className="flex flex-col gap-3 w-full p-3 rounded-md">
            {messages.map((message, index) => (
              <div key={`message-${index}`} className="flex">
                {!message.isBot && <div className="w-1/4" />}
                <div
                  key={`message-${index}`}
                  className={`flex w-3/4 text-slate-700 ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`${
                      message.isBot ? "bg-blue-100" : "bg-blue-500"
                    } w-fit rounded-lg py-3 px-4 text-left shadow-lg shadow-slate-300`}
                  >
                    <ReactMarkdown children={message.text} />
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            <div className="mt-3">
              <form onSubmit={sendMessage}>
                <div className="w-full flex justify-center">
                  <input
                    placeholder="Ask me about your subject!..."
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-3/4 m-auto border-2 border-blue-500 p-2 rounded-lg shadow-lg shadow-slate-300"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
