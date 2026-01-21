import { useState } from "react";
import { computeSQI, computeSQICSV } from "../services/api";
import ResultView from "./ResultView";
import { Box, Paper, Typography, TextField, Button, Divider } from "@mui/material";
import { logout } from "../utils/auth";

export default function AdminConsole() {
  const [prompt, setPrompt] = useState(localStorage.getItem("diagnostic_prompt") || "");
  const [jsonInput, setJsonInput] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState("S001");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleComputeJSON = async () => {
    try {
      setError("");
      const data = JSON.parse(jsonInput);
      const res = await computeSQI(data);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleComputeCSV = async () => {
    if (!csvFile) return setError("Upload a CSV first");
    try {
      setError("");
      const res = await computeSQICSV(csvFile, studentId);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        py: 5,
        background: "linear-gradient(135deg, #6a11cb, #2575fc)", // full-screen gradient
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: { xs: "95%", md: 900 } }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #ffffffdd, #f5f5f5dd)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Admin Console
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                logout();
                window.location.reload();
              }}
            >
              Logout
            </Button>
          </Box>

          {/* Diagnostic Prompt */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Diagnostic Agent Prompt
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              mt: 1,
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              "&:hover": {
                background: "linear-gradient(90deg, #2575fc, #6a11cb)",
              },
            }}
            onClick={() => localStorage.setItem("diagnostic_prompt", prompt)}
          >
            Save Prompt
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* JSON Input */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Student Attempt Data (JSON)
          </Typography>
          <TextField
            multiline
            rows={8}
            fullWidth
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              mt: 1,
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              "&:hover": {
                background: "linear-gradient(90deg, #2575fc, #6a11cb)",
              },
            }}
            onClick={handleComputeJSON}
          >
            Compute SQI (JSON)
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* CSV Upload */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            OR Upload CSV
          </Typography>
          <TextField
            label="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            fullWidth
            sx={{ mb: 1, mt: 1 }}
          />
          <input
            type="file"
            accept=".csv"
            style={{ marginBottom: "10px" }}
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
          />
          <Button
            variant="contained"
            sx={{
              mt: 1,
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              "&:hover": {
                background: "linear-gradient(90deg, #2575fc, #6a11cb)",
              },
            }}
            onClick={handleComputeCSV}
          >
            Compute SQI (CSV)
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {result && <ResultView result={result} />}
        </Paper>
      </Box>
    </Box>
  );
}
