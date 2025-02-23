import {
  Avatar,
  Box,
  CircularProgress,
  CssBaseline,
  Fab,
  Typography,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import { useEffect, useRef } from "react";
import { useStore } from "./stores/useStore";
import { sendCompletion } from "./api/openrouter";
import ApiKeyModal from "./components/ApiKeyModal";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";

function App() {
  const { apiKey, messages, loading } = useStore();
  const { addMessage, updateMessage, setLoading, setError, toggleApiKeyModal } =
    useStore((state) => state.actions);

  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (input: string) => {
    if (!apiKey) {
      setError("API key is missing!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add the user's message
      addMessage({ role: "user", content: input });

      const currentMessages = useStore.getState().messages;
      const apiMessages = currentMessages.map(({ role, content }) => ({
        role,
        content,
      }));

      // Add a placeholder for the assistant response
      addMessage({ role: "assistant", content: "" });
      const aiMessage = useStore.getState().messages.slice(-1)[0];

      // Call the API with streaming support
      await sendCompletion(apiMessages, apiKey, (chunk) => {
        // Update the AI's message progressively
        updateMessage(aiMessage.id, (prev) => prev + chunk);
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <CssBaseline />

      {messages.length === 0 && (
        <Box
          justifyContent={"center"}
          alignItems={"center"}
          flex={1}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
        >
          <Avatar
            src="/src/assets/cute-ai-chat.png"
            sx={{
              height: 80,
              width: 80,
              bgcolor: "#FCBC06",
              animation: "bounce 2.4s infinite ease-in-out",
              "@keyframes bounce": {
                "0%, 100%": {
                  transform: "translateY(0)",
                },
                "50%": {
                  transform: "translateY(-10px)",
                },
              },
            }}
          >
            AI
          </Avatar>
          <Typography variant="h6" component="h2">
            Hello can I help you today?
          </Typography>
        </Box>
      )}

      {/* 消息列表 */}
      <Box
        flex={1}
        maxWidth={"1280px"}
        margin={"0 auto"}
        p={2}
        width={"100%"}
        overflow={"auto"}
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            id={message.id}
            role={message.role}
            content={message.content}
          />
        ))}

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 2,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Scroll Anchor */}
        <Box ref={scrollAnchorRef} />
      </Box>
      <Box m={2}>
        <Fab
          color="primary"
          aria-label="add"
          size={"medium"}
          onClick={() => toggleApiKeyModal()}
        >
          <KeyIcon />
        </Fab>
      </Box>
      {/* 输入区域 */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          bgcolor: "background.paper",
          boxShadow: 3,
          p: 2,
        }}
      >
        <ChatInput loading={loading} onSubmit={handleSubmit} />
      </Box>

      <ApiKeyModal />
    </Box>
  );
}

export default App;
