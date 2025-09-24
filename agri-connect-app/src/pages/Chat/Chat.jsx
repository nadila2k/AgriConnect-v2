import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "./../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { selectUser } from "../../features/slices/authSlice";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  InputAdornment,
  AppBar,
  Toolbar,
  Grid,
} from "@mui/material";
import {
  Send as SendIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

export default function Chat() {
  const { userId: receiverId, email: receiverEmail } = useParams();
  const { id: senderId, email: senderEmail } = useSelector(selectUser);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Create consistent chat ID
  const createChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join("_");
  };

  const chatId = receiverId ? createChatId(senderId, receiverId) : null;

  // Decode receiverEmail properly
  const decodedReceiverEmail = receiverEmail
    ? decodeURIComponent(receiverEmail)
    : null;

  // Debug logging
  useEffect(() => {
    console.log("Current user from Redux:", {
      id: senderId,
      email: senderEmail,
    });
    console.log("URL params:", {
      receiverId,
      receiverEmail: decodedReceiverEmail,
    });
  }, [senderId, senderEmail, receiverId, decodedReceiverEmail]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user's chats
  useEffect(() => {
    if (!senderId) {
      console.log("No senderId available");
      return;
    }

    console.log(
      "Fetching chats for senderId:",
      senderId,
      "type:",
      typeof senderId
    );

    // Try both string and number versions of senderId since participants might have mixed types
    const senderIdString = String(senderId);
    const senderIdNumber = Number(senderId);

    // Create two queries - one for string ID and one for number ID
    const queryString = query(
      collection(db, "chats"),
      where("participants", "array-contains", senderIdString)
    );

    const queryNumber = query(
      collection(db, "chats"),
      where("participants", "array-contains", senderIdNumber)
    );

    const chatsMap = new Map(); // Use Map to avoid duplicates

    const processSnapshot = (snapshot, queryType) => {
      console.log(`${queryType} query snapshot received, size:`, snapshot.size);

      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Chat document:", doc.id, data);

        // Find the other user (could be string or number)
        const otherUserId = data.participants.find(
          (p) => p !== senderIdString && p !== senderIdNumber
        );

        // Find the other user's email
        let otherUserEmail = "Unknown User";
        if (data.participantEmails && Array.isArray(data.participantEmails)) {
          // Find which index is the current user
          const currentUserIndex = data.participants.findIndex(
            (p) => p === senderIdString || p === senderIdNumber
          );
          const otherIndex = currentUserIndex === 0 ? 1 : 0;
          otherUserEmail = data.participantEmails[otherIndex] || "Unknown User";
        } else if (data.participants && data.participants.length === 2) {
          otherUserEmail = `User ${otherUserId}`;
        }

        // Store in map to avoid duplicates
        chatsMap.set(doc.id, {
          id: doc.id,
          ...data,
          otherUserId,
          otherUserEmail,
        });
      });
    };

    // Listen to both queries
    const unsubscribeString = onSnapshot(
      queryString,
      (snapshot) => {
        processSnapshot(snapshot, "String");
        updateChatsState();
      },
      (error) => {
        console.error("Error fetching chats (string query):", error);
      }
    );

    const unsubscribeNumber = onSnapshot(
      queryNumber,
      (snapshot) => {
        processSnapshot(snapshot, "Number");
        updateChatsState();
      },
      (error) => {
        console.error("Error fetching chats (number query):", error);
      }
    );

    const updateChatsState = () => {
      const chatsData = Array.from(chatsMap.values());
      console.log("Combined chats data:", chatsData);

      // Sort by lastMessageTime or updatedAt or createdAt
      chatsData.sort((a, b) => {
        const timeA = a.lastMessageTime || a.updatedAt || a.createdAt;
        const timeB = b.lastMessageTime || b.updatedAt || b.createdAt;

        if (!timeA && !timeB) return 0;
        if (!timeA) return 1;
        if (!timeB) return -1;

        return timeB.toMillis() - timeA.toMillis();
      });

      setUserChats(chatsData);
    };

    return () => {
      unsubscribeString();
      unsubscribeNumber();
    };
  }, [senderId]);

  // Fetch messages for current chat
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    });

    return unsubscribe;
  }, [chatId]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !receiverId || !decodedReceiverEmail) return;

    try {
      // Ensure consistent data types - convert both to numbers or both to strings
      const senderIdConsistent = Number(senderId);
      const receiverIdConsistent = Number(receiverId);

      // Create or update chat document
      const chatRef = doc(db, "chats", chatId);
      await setDoc(
        chatRef,
        {
          participants: [senderIdConsistent, receiverIdConsistent], // Both as numbers
          participantEmails: [senderEmail, decodedReceiverEmail],
          lastMessage: message.trim(),
          lastMessageTime: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Add message to subcollection
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        senderId: senderIdConsistent, // As number
        receiverId: receiverIdConsistent, // As number
        senderEmail,
        receiverEmail: decodedReceiverEmail,
        message: message.trim(),
        timestamp: serverTimestamp(),
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Filter chats based on search
  const filteredChats = userChats.filter(
    (chat) =>
      chat.otherUserEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString();
  };

  return (
    <Box 
      sx={{ 
        height: "calc(100vh - 120px)", // Subtract navbar and footer heights (adjust as needed)
        display: "flex",
        minHeight: "400px" // Minimum height to prevent crushing
      }}
    >
      {/* Left Sidebar - Chat List */}
      <Paper
        elevation={3}
        sx={{
          width: { xs: receiverId ? 0 : "100%", md: 400 },
          display: { xs: receiverId ? "none" : "block", md: "block" },
          borderRadius: 0,
          height: "100%", // Changed from 100vh to 100%
        }}
      >
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              AgriChat
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />
        </Box>

        <List sx={{ height: "calc(100% - 140px)", overflow: "auto" }}>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem
                  button
                  onClick={() =>
                    navigate(
                      `/chat/${chat.otherUserId}/${encodeURIComponent(
                        chat.otherUserEmail
                      )}`
                    )
                  }
                  selected={chat.otherUserId === receiverId}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "rgba(25, 118, 210, 0.12)",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {chat.otherUserEmail.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        noWrap
                      >
                        {chat.otherUserEmail}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {chat.lastMessage || "No messages yet"}
                        </Typography>
                        {chat.lastMessageTime && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatTime(chat.lastMessageTime)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">
                {searchTerm ? "No chats found" : "No conversations yet"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {searchTerm
                  ? "Try a different search term"
                  : "Start a new conversation to see it here"}
              </Typography>
            </Box>
          )}
        </List>
      </Paper>

      {/* Right Chat Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%", // Changed from 100vh to 100%
        }}
      >
        {receiverId ? (
          <>
            {/* Chat Header */}
            <AppBar position="static" color="primary" elevation={1}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => navigate("/chat")}
                  sx={{ display: { md: "none" }, mr: 1 }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Avatar sx={{ mr: 2, bgcolor: "rgba(255,255,255,0.2)" }}>
                  {decodedReceiverEmail?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6">{decodedReceiverEmail}</Typography>
                </Box>
              </Toolbar>
            </AppBar>

            {/* Messages Area */}
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                p: 1,
                backgroundColor: "#f5f5f5",
                backgroundImage:
                  "linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }}
            >
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.senderId === senderId ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      maxWidth: "70%",
                      backgroundColor:
                        msg.senderId === senderId ? "#dcf8c6" : "#ffffff",
                      borderRadius:
                        msg.senderId === senderId
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                    }}
                  >
                    <Typography variant="body1">{msg.message}</Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", textAlign: "right", mt: 0.5 }}
                    >
                      {msg.timestamp && formatTime(msg.timestamp)}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
            <Paper
              elevation={3}
              sx={{ p: 2 }}
              component="form"
              onSubmit={sendMessage}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        color="primary"
                        disabled={!message.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "25px",
                  },
                }}
              />
            </Paper>
          </>
        ) : (
          // Welcome Screen
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f2f5",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="text.secondary" gutterBottom>
                Welcome to AgriChat
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select a conversation to start chatting with fellow farmers
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}