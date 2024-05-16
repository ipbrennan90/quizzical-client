import React, { useState } from "react";

export default function Configurator({ setNamespace, closeTeacherMode }) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const configurator = new FormData(event.target);
    const body = {};
    for (const [key, value] of configurator.entries()) {
      body[key] = value;
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/configure`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseBody = await response.json();

    setNamespace(responseBody.data.namespace);

    setLoading(false);
    closeTeacherMode();
  };
  return (
    <div className="App">
      <div>
        <div className="text-4xl text-slate-700">Quizzical</div>
        <div className="flex flex-col w-full items-center justify-center">
          <form onSubmit={handleSubmit}>
            <label className="text-xl" htmlFor="study-content">
              Textbook or Article URL:
            </label>
            <input
              className="w-full mb-3 p-2 text-xl rounded-lg border-2 border-blue-500"
              type="text"
              id="study-content"
              name="studyContent"
            ></input>
            <label className="text-xl" htmlFor="study-material-title">
              Title of Study Material:
            </label>
            <input
              className="w-full mb-3 p-2 text-xl rounded-lg border-2 border-blue-500"
              type="text"
              id="study-material-title"
              name="studyContentName"
            ></input>
            {loading ? (
              <button
                className="h-fit mt-2 p-2 text-xl rounded-lg bg-slate-500"
                type="submit"
                disabled
              >
                Loading...
              </button>
            ) : (
              <button
                className="h-fit mt-2 p-2 text-xl rounded-lg bg-blue-500"
                type="submit"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
