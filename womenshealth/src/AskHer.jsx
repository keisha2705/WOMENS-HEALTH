import { useState } from "react";
import "./Ask-her.css";
import Navbar from "./Navbar";

export default function ChatPage() {

const savedToken = localStorage.getItem("authToken");
const savedRole = localStorage.getItem("userRole");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const SUGGESTIONS = [
    "I am feeling dizzy is that normal",
    "What not to eat for hormonal balance",
    "i have not seen my period in 3days should I be worried",
    "How to minimize cramps"
  ];

  const sendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg = { sender: "user", text: messageText };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply || data.error }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="chatpage">
      <Navbar/>
      <div className="chatpage-container">
        
        <header className="chatpage-header">
            <div className="feature-icon">
               <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 32 32">
	<path d="M0 0h32v32H0z" fill="none" />
	<path fill="currentColor" d="M14.123 26.933a1.112 1.112 0 1 1-1.112-1.112a1.11 1.11 0 0 1 1.112 1.112m6.903 0a1.112 1.112 0 1 1-1.112-1.112a1.11 1.11 0 0 1 1.112 1.112M9.97 6.74l.06-.972l.972.06l-.06.972z" />
	<path fill="currentColor" d="M26.428 16.383h-.002a13.1 13.1 0 0 0-5.143-4.182a14 14 0 0 0-1.135-.445l.04-.094a4.83 4.83 0 0 0-2.986-6.319a6 6 0 0 0-1.997-.355c-.036-.126-.116-.675.58-2.158L14.375 2l-.338.466c-.384.531-.755 1.044-1.103 1.55a2.17 2.17 0 0 0-1.448-.677l-1.632-.101H9.85l-.13-.004a2.19 2.19 0 0 0-2.18 2.048l-.101 1.635v.006A2.19 2.19 0 0 0 9.485 9.23l1.168.072a5.17 5.17 0 0 0 .47 2.688a13.2 13.2 0 0 0-4.264 2.9C3 18.788 3 23.06 3 26.492v2.07l1.524-1.616A12.3 12.3 0 0 0 5.854 30h1.983a10.7 10.7 0 0 1-1.959-4.49l2.235-2.37l-1.15 3.605l2.03-1.477c3.586-2.61 7.868-3.21 12.726-1.783a4.63 4.63 0 0 0 5.22-1.468q.063-.095.122-.193a9.6 9.6 0 0 1 .164 1.746a12.4 12.4 0 0 1-1.61 6.43h1.877a14.4 14.4 0 0 0 1.378-6.43a12.27 12.27 0 0 0-2.443-7.187M13.844 5.926a1.59 1.59 0 0 0 1.399.706a4.2 4.2 0 0 1 1.44.272a3.17 3.17 0 0 1 1.028 5.464l-.475-.585l-.004-.004a1.705 1.705 0 0 0-3.023.987a3.214 3.214 0 0 1-1.9-3.541a8.5 8.5 0 0 1 1.438-3.466a2 2 0 0 0 .098.167m3.49 9.259l-.607.496a.27.27 0 0 1-.376-.038l-.126-.155a.28.28 0 0 1 .04-.393l.6-.49l-1.236-1.516a.362.362 0 1 1 .561-.457l3.455 4.252a.362.362 0 0 1-.199.581a.4.4 0 0 1-.081.01a.36.36 0 0 1-.281-.134l-.344-.424l-1.222.997a.28.28 0 0 1-.396-.04l-.553-.677a.28.28 0 0 1 .04-.392l1.227-1.002ZM9.08 7.018l.101-1.634a.54.54 0 0 1 .539-.506l.033.001l1.633.101a.54.54 0 0 1 .505.572l-.008.118a10.7 10.7 0 0 0-.902 2.005l-1.395-.086a.54.54 0 0 1-.506-.57M25.594 21.07a2.99 2.99 0 0 1-3.41.837c-4.532-1.33-8.63-1.053-12.213.82l1.907-5.978l-7.203 7.64a11.67 11.67 0 0 1 3.353-8.342a11.5 11.5 0 0 1 4.107-2.691a5.4 5.4 0 0 0 2.241 1.221a5 5 0 0 0 .563.12a1.63 1.63 0 0 0 .245 1.642l.085.104a1.63 1.63 0 0 0 .259 1.605l.553.677a1.63 1.63 0 0 0 2.29.232l.332-.27a1.708 1.708 0 0 0 1.986-2.654l-1.942-2.391a5 5 0 0 0 .486-.456a13 13 0 0 1 1.383.518a11.4 11.4 0 0 1 4.508 3.684c.975 1.34 1.15 2.716.47 3.682" />
</svg>

              </div>
          <h1 className="chatpage-title">Her Assistant</h1>
        </header>

        <div className="chat-window">
          {messages.length === 0 ? (
            <div className="suggestions-grid">
              {SUGGESTIONS.map((prompt) => (
                <button 
                  key={prompt} 
                  type="button" 
                  className="suggestion-chip"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : (
            <div className="message-stream">
              {messages.map((msg, index) => (
                <div key={index} className={`message-bubble ${msg.sender}`}>
                  <p style={{ margin: 0 }}>{msg.text}</p>
                </div>
              ))}
              {loading && <div className="message-bubble ai">Thinking...</div>}
            </div>
          )}
        </div>

        <form 
          className="chat-input-form" 
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        >
          <div className="input-wrapper">
            <span className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48">
	<path d="M0 0h48v48H0z" fill="none" />
	<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19.607 5.5c7.772 0 14.045 6.304 14.045 14.107a14.026 14.026 0 0 1-14.045 14.045C11.804 33.652 5.5 27.38 5.5 19.607A14.09 14.09 0 0 1 19.607 5.5m9.923 24.03L42.5 42.5" />
</svg>

            </span>
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
          </div>
        </form>

      </div>
    </main>
  );
}
