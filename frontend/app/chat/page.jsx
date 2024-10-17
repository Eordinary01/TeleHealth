"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Image, Loader } from "lucide-react";
import styles from "./Chatbot.module.css";
import { useSearchParams } from "next/navigation";
import { marked } from "marked";

const ChatMessage = ({ message, isUser }) => {
  console.log(message.imageName);

  return (
    <div
      className={`${styles.message} ${
        isUser ? styles.userMessage : styles.botMessage
      }`}
    >
      {message.image && (
        <img
          src={`${message.image.data}`}
          alt="Uploaded content"
          className={styles.messageImage}
        />
      )}
      <div
        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
      />
    </div>
  );
};

const formatMessage = (message) => {
  let formattedMessage = marked(message);
  formattedMessage = formattedMessage.replace(/\n/g, "<br />");
  return formattedMessage;
};

const DummyQuery = ({ query, onClick }) => (
  <div className={styles.dummyQuery} onClick={onClick}>
    {query}
  </div>
);

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchParams = useSearchParams();

  const urlChatId = searchParams.get("chatId");

  const dummyQueries = [
    "What are common symptoms of the flu?",
    "How can I improve my sleep quality?",
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (urlChatId) {
      loadChatHistory(urlChatId);
    }
  }, []);

  const loadChatHistory = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:8080/chat/${chatId}`);
      if (!response.ok) throw new Error("Failed to load chat history");
      const data = await response.json();
      setChatId(data._id);
      setChatTitle(data.title);
      setMessages(data.messages);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleSendMessage = async (message = input) => {
    if (!message.trim() && !selectedImage) return;

    const newMessage = { role: "user", content: message };
    if (selectedImage) {
      newMessage.image = {
        data: await toBase64(selectedImage),
        contentType: selectedImage.type,
      };
    }
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", message);
      formData.append("userId", "6710e75793fc67cb5f2aa73f"); // Replace with actual user ID
      if (chatId) formData.append("chatId", chatId);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setChatId(data.chatId);
      setChatTitle(data.title);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", content: data.chatReply },
      ]);

      if (data.imageAnalysis) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "model", content: `Image Analysis: ${data.imageAnalysis}` },
        ]);
      }

      window.history.pushState({}, "", `?chatId=${data.chatId}`);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className={styles.chatbot}>
      <div className={styles.chatHeader}>{chatTitle}</div>
      <div className={styles.chatBody} ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className={styles.dummyQueriesContainer}>
            <h3>Suggested Queries:</h3>
            {dummyQueries.map((query, index) => (
              <DummyQuery
                key={index}
                query={query}
                onClick={() => handleSendMessage(query)}
              />
            ))}
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg}
              isUser={msg.role === "user"}
            />
          ))
        )}
        {isLoading && (
          <div className={styles.loaderContainer}>
            <Loader className={styles.loader} />
          </div>
        )}
      </div>

      <div className={styles.chatInput}>
        {selectedImage && (
          <div className={styles.selectedImageContainer}>
            <p>Selected image:</p>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className={styles.selectedImagePreview}
            />
            <button onClick={() => setSelectedImage(null)}>Remove</button>
          </div>
        )}
        <div className={styles.chatInputs}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className={styles.inputField}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading}
            className={styles.sendButton}
          >
            <Send className={styles.sendIcon} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
          <button onClick={triggerFileInput} className={styles.imageButton}>
            <Image className={styles.imageIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
