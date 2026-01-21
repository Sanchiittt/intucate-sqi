# Intucate Mini-Build — Diagnostic Agent to Summary Customizer Agent Flow

## Project Overview
This project implements a mini-flow for Intucate:

1. **Login Page** (mocked)
2. **Admin Console** to paste **Diagnostic Agent Prompt**, upload **Student Attempts JSON or CSV**
3. **SQI Engine** calculates **Student Quality Index (SQI)** per student, topic, and concept
4. **Result Output**: JSON ready for **Summary Customizer Agent**, with **copy and download options**

**Tech Stack:**
- Frontend: React + TypeScript + Vite + Material-UI
- Backend: Node.js + Express (for SQI computation)
- Optional: CSV upload support

---

## Features

### 1. Login (Mocked)
- Email must end with `@intucate.com`
- Password minimum 8 characters
- Session persisted via `localStorage`

### 2. Admin Console
- Paste **Diagnostic Agent Prompt** → Save
- Upload **JSON/CSV** → Compute SQI
- Displays:
  - Overall SQI (0–100)
  - Topic-wise SQI
  - Concept-wise SQI
  - Ranked Concepts with weights & reasons
- Copy JSON → Clipboard
- Download JSON → `summary_customizer_input.json`

### 3. SQI Engine
- Computes **per-question weighted score**:
  - Base: `+marks if correct, -neg_marks if wrong`
  - Weighted by:
    - Importance: A=1, B=0.7, C=0.5
    - Difficulty: E=0.6, M=1, H=1.4
    - Type: Practical=1.1, Theory=1
  - Adjustments:
    - Slow (>1.5× expected time): ×0.9
    - Very slow (>2× expected time): ×0.8
    - Marked review & wrong: ×0.9
    - Revisited & corrected: +0.2×marks
- Normalized to 0–100
- Outputs **topic_scores**, **concept_scores**, and **ranked_concepts_for_summary**

---

## Setup Instructions

### Frontend

1. Navigate to frontend folder:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Run development server:
```bash
npm run dev
```
4. Open browser → `http://localhost:5173` → **Login Page**

### Backend (Node.js + Express)

1. Navigate to backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Run backend server:
```bash
npm run dev
```
4. Backend runs on `http://localhost:5000/api`

---

## Endpoints

### Compute SQI (JSON)
```
POST http://localhost:5000/api/compute-sqi
Content-Type: application/json
Body: Student attempts JSON (per schema)
```

### Compute SQI (CSV)
```
POST http://localhost:5000/api/compute-sqi-csv
FormData:
  - file: CSV file
  - student_id: student ID
```

---

## Sample Inputs

### JSON Example
```json
{
  "student_id": "S001",
  "attempts": [
    {
      "topic": "Borrowing Costs",
      "concept": "Definitions",
      "importance": "A",
      "difficulty": "M",
      "type": "Theory",
      "case_based": false,
      "correct": false,
      "marks": 2,
      "neg_marks": 0.5,
      "expected_time_sec": 90,
      "time_spent_sec": 130,
      "marked_review": true,
      "revisits": 1
    }
  ]
}
```

### CSV Example
```csv
topic,concept,importance,difficulty,type,case_based,correct,marks,neg_marks,expected_time_sec,time_spent_sec,marked_review,revisits
Borrowing Costs,Definitions,A,M,Theory,false,false,2,0.5,90,130,true,1
```

---

## Demo Video Instructions

1. Open browser → Login Page
2. Email: `admin@intucate.com`, Password: `password123` → Click Login
3. Paste **Diagnostic Prompt** → Save
4. Upload JSON/CSV → Compute SQI
5. Show results (Overall SQI, Topic Scores, Concept Scores, Ranked Concepts)
6. Copy JSON → Clipboard
7. Download JSON → `summary_customizer_input.json`
8. Logout → Back to Login Page

---



## Demo Video (GIF)

![Demo Video](demo.gif)


