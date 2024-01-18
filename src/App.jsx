import { useState } from "react";
import { app, db } from "./config/firebase";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hello world from react!</h1>
    </>
  );
}

export default App;
