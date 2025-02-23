import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { Message } from "../models/types";

export default function ChatMessage({ role, content }: Message) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
      bgcolor={role === "user" ? "#ffffff" : "#F6F6F6FF"}
      display={"flex"}
      p={2}
      gap={2}
      borderRadius={2}
    >
      <Avatar
        src={role === "assistant" ? "/src/assets/cute-ai-chat.png" : undefined}
        sx={{
          bgcolor: role === "user" ? "#FCBC06" : "#29C987",
          width: 40,
          height: 40,
        }}
      >
        {role === "user" ? "You" : "AI"}
      </Avatar>
      <Box display={"flex"} flexDirection={"column"}>
        <Typography variant="body1" fontWeight="bold">
          {role === "user" ? "You" : "AI"}
        </Typography>

        <Typography
          variant="body1"
          maxWidth={"min(100%, 800px)"}
          lineHeight={1.5}
          color={"#1a1a1a"}
        >
          {content}
        </Typography>
      </Box>
    </Box>
  );
}
