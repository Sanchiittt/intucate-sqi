import { Box, Typography, Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState } from "react";

export default function ResultView({ result }: { result: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary_customizer_input.json";
    a.click();
  };

  const tablePaperStyle = {
    background: "linear-gradient(120deg, #ffffff, #f0f0f0)",
    mb: 2,
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Overall SQI: {result.overall_sqi}
      </Typography>

      <Typography variant="h6" sx={{ mb: 1 }}>Topic Scores</Typography>
      <TableContainer component={Paper} sx={tablePaperStyle}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Topic</TableCell>
              <TableCell>SQI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.topic_scores.map((t: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{t.topic}</TableCell>
                <TableCell>{t.sqi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mb: 1 }}>Concept Scores</Typography>
      <TableContainer component={Paper} sx={tablePaperStyle}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Topic</TableCell>
              <TableCell>Concept</TableCell>
              <TableCell>SQI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.concept_scores.map((c: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{c.topic}</TableCell>
                <TableCell>{c.concept}</TableCell>
                <TableCell>{c.sqi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mb: 1 }}>Ranked Concepts</Typography>
      <TableContainer component={Paper} sx={tablePaperStyle}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Topic</TableCell>
              <TableCell>Concept</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Reasons</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.ranked_concepts_for_summary.map((r: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{r.topic}</TableCell>
                <TableCell>{r.concept}</TableCell>
                <TableCell>{r.weight}</TableCell>
                <TableCell>{r.reasons.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        sx={{
          mr: 1,
          background: "linear-gradient(90deg, #6a11cb, #2575fc)",
          "&:hover": { background: "linear-gradient(90deg, #2575fc, #6a11cb)" },
        }}
        onClick={handleCopy}
      >
        {copied ? "Copied!" : "Copy JSON"}
      </Button>

      <Button
        variant="contained"
        sx={{
          background: "linear-gradient(90deg, #43e97b, #38f9d7)",
          "&:hover": { background: "linear-gradient(90deg, #38f9d7, #43e97b)" },
        }}
        onClick={handleDownload}
      >
        Download JSON
      </Button>
    </Box>
  );
}
