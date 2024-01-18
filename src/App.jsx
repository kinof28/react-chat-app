import { useEffect, useState } from "react";
import { db } from "./config/firebase";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      setMessages(temp);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitting = async () => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        sender: "ME",
        message,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSubmitting}>Send</button>
      <div>
        {messages.map((e, index) => (
          <div key={index}>{e.message}</div>
        ))}
      </div>
    </>
  );
}

export default App;
