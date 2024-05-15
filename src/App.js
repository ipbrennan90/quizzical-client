import "./App.css";
import React from "react";
import Tutor from "./pages/Tutor";

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

function App() {
  return <Tutor />;
}

export default App;
