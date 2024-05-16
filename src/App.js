import "./App.css";
import React from "react";
import Tutor from "./pages/Tutor";
import Configurator from "./pages/Configurator";

function App() {
  const [teacherMode, setTeacherMode] = React.useState(true);
  const [namespace, setNamespace] = React.useState("prod-science");

  const closeTeacherMode = () => {
    setTeacherMode(false);
  };

  if (teacherMode) {
    return (
      <Configurator
        closeTeacherMode={closeTeacherMode}
        setNamespace={setNamespace}
      />
    );
  } else {
    return <Tutor namespace={namespace} />;
  }
}

export default App;
