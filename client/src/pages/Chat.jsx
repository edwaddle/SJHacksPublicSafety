import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";
import { Send } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Welcome to EmbrAlrt Chat! How can we help you today?",
      sender: "system",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      setNewMessage("");
    }
  };

  const placeholderTips = [
    "Ask about current wildfire conditions",
    "Get information about evacuation routes",
    "Learn about fire prevention tips",
    "Check air quality in your area",
  ];

  return (
    <Box
      sx={{
        p: 3,
        pb: 8,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Wildfire Information Chatbot
      </Typography>

      <Card
        sx={{ flexGrow: 1, mb: 2, display: "flex", flexDirection: "column" }}
      >
        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          {/* Chat Messages Area */}
          <Box sx={{ flexGrow: 1, mb: 2, overflowY: "auto" }}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Welcome to the Wildfire Information Chatbot!"
                  secondary="How can I help you today?"
                />
              </ListItem>
            </List>
          </Box>

          {/* Placeholder Tips */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Try asking about:
            </Typography>
            <List dense>
              {placeholderTips.map((tip, index) => (
                <ListItem key={index}>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Input Area */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type your message here..."
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ minWidth: "auto" }}
            >
              <Send size={20} />
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Chat;
