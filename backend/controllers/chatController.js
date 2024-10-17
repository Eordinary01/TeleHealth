const Chat = require("../models/chat");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };
}

const INITIAL_CONTEXT = {
  role: "user",
  content: "You are a health expert.",
};

async function generateAITitle(messages) {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fullContent = messages.map((msg) => msg.content).join(" ");
  const result = await model.generateContent(
    `Generate a concise 5-word title for this conversation:\n"${fullContent}"`
  );

  return result.response.text().trim();
}

exports.chat = async (req, res) => {
  const { message, userId, chatId } = req.body;
  const imageFile = req.file;
  console.log("imageFile", imageFile);

  console.log("Received request:", {
    message,
    userId,
    chatId,
    imageFile: imageFile?.originalname,
  });

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let chatHistory;
    if (chatId) {
      chatHistory = await Chat.findById(chatId);
      if (!chatHistory) {
        return res.status(404).send("Chat not found");
      }
    } else {
      chatHistory = new Chat({
        userId,
        title: "Untitled Chat",
        messages: [INITIAL_CONTEXT],
      });
    }

    let imageResult = null;
    let imagePart = null;
    if (imageFile) {
      const prompt = "Describe how this product might be manufactured.";
      const imagePath = path.join(
        __dirname,
        "..",
        "images",
        imageFile.filename
      );
      imagePart = fileToGenerativePart(imagePath, imageFile.mimetype);
      const imageResponse = await model.generateContent([message, imagePart]);
      imageResult = imageResponse.response.text();

      // Save image to chat history
      chatHistory.messages.push({
        role: "user",
        content: "Image uploaded",
        image: {
          data: fs.readFileSync(imagePath),
          contentType: imageFile.mimetype,
        },
        imageName: imagePath,
      });

      // Clean up the uploaded file
      fs.unlinkSync(imagePath);
    }

    const chat = model.startChat({
      history: chatHistory.messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const modelReply = result.response.text();

    chatHistory.messages.push(
      { role: "user", content: message },
      { role: "model", content: modelReply }
    );

    // Generate AI title after the conversation
    if (!chatId || chatHistory.title === "Untitled Chat") {
      chatHistory.title = await generateAITitle(chatHistory.messages);
    }

    await chatHistory.save();

    const response = {
      chatId: chatHistory._id,
      title: chatHistory.title,
      chatReply: modelReply,
      chatHistory: chatHistory.messages,
    };

    if (imageResult) {
      // response.imageAnalysis = imageResult;
      response.chatReply = imageResult;
    }

    console.log("Sending response:", response);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
  }
};

exports.getChatHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(
      chats.map((chat) => ({
        id: chat._id,
        title: chat.title,
        createdAt: chat.createdAt,
      }))
    );
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).send("Error retrieving chat history");
  }
};

exports.getChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).send("Chat not found");
    }
    chat.messages.shift();
    console.log("chat", chat);

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error retrieving chat:", error);
    res.status(500).send("Error retrieving chat");
  }
};
