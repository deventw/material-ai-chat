import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useStore } from "../stores/useStore";
import { useState } from "react";

export default function ApiKeyModal() {
  const apiKeyModalOpen = useStore((state) => state.apiKeyModalOpen);
  const globalApiKey = useStore((state) => state.apiKey);
  const toggleApiKeyModal = useStore(
    (state) => state.actions.toggleApiKeyModal
  );
  const setApiKey = useStore((state) => state.actions.setApiKey);

  // Internal state for API Key
  const [apiKey, setApiKeyInternal] = useState(globalApiKey);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiKey(apiKey.trim()); // Update global state
    toggleApiKeyModal(); // Close modal
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKeyInternal(e.target.value);
  };

  return (
    <Modal open={apiKeyModalOpen} disableEscapeKeyDown>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          🔑 输入 OpenRouter API 密钥
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              required
              name="apiKey"
              label="API Key"
              // type="password"
              autoComplete="off"
              value={apiKey}
              onChange={handleChange}
              helperText={
                <>
                  前往{" "}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener"
                    style={{ color: "inherit" }}
                  >
                    OpenRouter.ai
                  </a>{" "}
                  获取 API 密钥
                </>
              }
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              保存密钥
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
