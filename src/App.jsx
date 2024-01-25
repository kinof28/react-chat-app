import { useEffect, useState } from "react";
import { db } from "./config/firebase";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { LocalNotifications } from "@capacitor/local-notifications";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      let temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      setMessages(temp);
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: temp.length,
              title: "new message received",
              body: temp[temp.length - 1].message,
            },
          ],
        });
      } catch (error) {
        console.log("some error went in local notification setting", error);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitting = async () => {
    try {
      await addDoc(collection(db, "messages"), {
        sender: "ME",
        message,
      });
      setMessage("");
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
