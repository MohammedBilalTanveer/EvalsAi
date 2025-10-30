import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, FileText, X } from "lucide-react";

/* Keep logic intact, convert to JSX */
export function FileUploadCard({
  title,
  description,
  onFileUpload,
  uploadedFileName,
  onClear,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || "";
      });
      return obj;
    });
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      try {
        if (file.name.endsWith(".json")) {
          const data = JSON.parse(text);
          onFileUpload(Array.isArray(data) ? data : [data]);
        } else if (file.name.endsWith(".csv")) {
          const data = parseCSV(text);
          onFileUpload(data);
        } else {
          alert("Please upload a JSON or CSV file");
        }
      } catch (error) {
        console.error(error);
        alert("Error parsing file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Card className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <CardDescription className="text-[rgba(224,230,237,0.8)]">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {uploadedFileName ? (
          <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-sm text-white">{uploadedFileName}</p>
                <p className="text-xs text-[rgba(224,230,237,0.65)]">File uploaded successfully</p>
              </div>
            </div>

            {onClear && (
              <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-purple-500 bg-[rgba(123,47,247,0.04)]" : "border-[rgba(255,255,255,0.06)]"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-10 h-10 mx-auto mb-4 text-[rgba(224,230,237,0.6)]" />
            <p className="mb-2 text-white">Drag and drop your file here</p>
            <p className="text-xs text-[rgba(224,230,237,0.6)] mb-4">Supports JSON and CSV formats</p>

            <label>
              <input type="file" accept=".json,.csv" onChange={handleFileInput} className="hidden" />
              <Button variant="outline" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}