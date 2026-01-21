export async function computeSQI(jsonData: any) {
  const res = await fetch("http://localhost:5000/api/compute-sqi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonData)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to compute SQI");
  }

  return res.json();
}



export async function computeSQICSV(file: File, studentId: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("student_id", studentId);

  const res = await fetch("http://localhost:5000/api/compute-sqi-csv", {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "CSV upload failed");
  }

  return res.json();
}
