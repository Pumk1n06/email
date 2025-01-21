import React from "react";
import EmailEditor from "./components/EmailEditor";

const App = () => {
  return (
    <div style={{ padding: "20px", background: "#f4f4f4", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>Email Template Editor</h1>
      <EmailEditor/>
    </div>
  );
};

export default App;
