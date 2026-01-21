import { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

type LoginProps = {
  onSuccess: () => void;
};

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email.endsWith("@intucate.com")) {
      setError("Email must end with @intucate.com");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    localStorage.setItem("auth", "true");
    onSuccess();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",              // full viewport height
        width: "100vw",                   // full viewport width
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)", // full screen gradient
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 5,
          width: { xs: "90%", sm: 400 }, // responsive width
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffffdd, #f0f0f0dd)", // soft card gradient
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, fontWeight: "bold", color: "#333" }}
        >
          Admin Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "linear-gradient(90deg, #6a11cb, #2575fc)",
            color: "#fff",
            fontWeight: "bold",
            py: 1.5,
            "&:hover": {
              background: "linear-gradient(90deg, #2575fc, #6a11cb)",
            },
          }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}
