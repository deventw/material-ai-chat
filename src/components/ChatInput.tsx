import { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatInput({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (input: string) => void;
}) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSubmit(input);
    setInput("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="输入消息...(Mistral 7B Instruct)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        slotProps={{
          input: {
            sx: { borderRadius: 4 },
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <IconButton
                    type="submit"
                    disabled={!input.trim()}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
