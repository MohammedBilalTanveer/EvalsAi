/* File: src/App.jsx */
import React, { useState } from "react";
import { FileUploadCard } from "./components/FileUploadCard";
import { TestRunResults } from "./components/TestRunResults";
import { QuestionDetailView } from "./components/QuestionDetailView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { StarfieldBackground } from "./components/StarfieldBackground";
import { FloatingElements } from "./components/FloatingElements";
import {
  processTestResults,
  calculateOverallMetrics,
} from "./components/MetricsCalculator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { FileText, PlayCircle, RotateCcw, Info } from "lucide-react";
import { Alert, AlertDescription } from "./components/ui/alert";

/* Main app UI (converted to JSX) */
export default function App() {
  const [goldenData, setGoldenData] = useState(null);
  const [actualData, setActualData] = useState(null);
  const [goldenFileName, setGoldenFileName] = useState("");
  const [actualFileName, setActualFileName] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const handleRunTest = () => {
    if (goldenData && actualData) {
      const results = processTestResults(goldenData, actualData);
      const calculatedMetrics = calculateOverallMetrics(results);
      setTestResults(results);
      setMetrics(calculatedMetrics);
    }
  };

  const handleReset = () => {
    setGoldenData(null);
    setActualData(null);
    setGoldenFileName("");
    setActualFileName("");
    setTestResults(null);
    setMetrics(null);
  };

const metricsChartData = [
  { metric: "Exact Match", score: metrics?.exactMatch ? metrics.exactMatch * (metrics.exactMatch <= 1 ? 100 : 1) : 0 },
  { metric: "BLEU Score", score: metrics?.bleuScore || 0 },
  { metric: "Precision", score: metrics?.precision || 0 },
  { metric: "Recall", score: metrics?.recall || 0 },
  { metric: "F1 Score", score: metrics?.f1Score || 0 },
];

  const radarChartData = metrics
    ? [
      { metric: "BLEU", score: metrics.bleuScore },
      { metric: "F1", score: metrics.f1Score },
      { metric: "Precision", score: metrics.precision },
      { metric: "Recall", score: metrics.recall },
      { metric: "Accuracy", score: metrics.accuracy },
    ]
    : [];

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">
      <StarfieldBackground />
      <FloatingElements />
      <div className="absolute inset-0 bg-black/70 -z-10" />
      <div className="border-b border-[rgba(255,255,255,0.04)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                LLM Testing Platform
              </h1>
              <p className="text-[rgba(224,230,237,0.75)] mt-1">
                Evaluate AI model performance with BLEU, F1, Precision, and Accuracy metrics
              </p>
            </div>

            <div className="flex gap-2">
              {testResults && (
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2 w-4 h-4" />
                  New Test
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!testResults ? (
          <div className="space-y-6">
            <Alert className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
              <Info className="w-5 h-5 mr-2" />
              <AlertDescription className="text-[rgba(224,230,237,0.75)]">
                Upload your golden dataset (questions and expected answers) and actual responses from your LLM. Supported formats: JSON and CSV. Files should contain 'question' and 'answer' or 'expected_answer'/'actual_answer' fields.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadCard
                title="Golden Dataset"
                description="Upload questions with expected answers (JSON or CSV)"
                onFileUpload={(data) => {
                  setGoldenData(data);
                  setGoldenFileName(`golden-dataset-${data.length}-items.json`);
                }}
                uploadedFileName={goldenFileName}
                onClear={() => {
                  setGoldenData(null);
                  setGoldenFileName("");
                }}
              />

              <FileUploadCard
                title="Actual Responses"
                description="Upload actual LLM responses (JSON or CSV)"
                onFileUpload={(data) => {
                  setActualData(data);
                  setActualFileName(`actual-responses-${data.length}-items.json`);
                }}
                uploadedFileName={actualFileName}
                onClear={() => {
                  setActualData(null);
                  setActualFileName("");
                }}
              />
            </div>

            {goldenData && actualData && (
              <Card className="bg-[rgba(123,47,247,0.04)] border border-[rgba(123,47,247,0.12)] rounded-2xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-purple-400" />
                      <div>
                        <p className="text-sm text-white">Ready to run test</p>
                        <p className="text-xs text-[rgba(224,230,237,0.7)]">
                          {goldenData.length} golden questions • {actualData.length} actual responses
                        </p>
                      </div>
                    </div>

                    <Button size="lg" onClick={handleRunTest} className="bg-linear-to-r from-purple-500 to-purple-700 text-white">
                      <PlayCircle className="mr-2 w-5 h-5" />
                      Run Evaluation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">File Format Examples</CardTitle>
                <CardDescription className="text-[rgba(224,230,237,0.75)]">Use these formats for your dataset files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm mb-2 text-[rgba(224,230,237,0.85)]">JSON Format:</p>
                  <pre className="p-4 bg-[rgba(255,255,255,0.01)] rounded-lg text-xs overflow-x-auto text-[rgba(224,230,237,0.7)]">
                    {`[
  {
    "question": "What is the capital of France?",
    "expected_answer": "Paris",
    "actual_answer": "The capital of France is Paris"
  },
  {
    "question": "Who wrote Romeo and Juliet?",
    "expected_answer": "William Shakespeare",
    "actual_answer": "Shakespeare"
  }
]`}
                  </pre>
                </div>

                <div>
                  <p className="text-sm mb-2 text-[rgba(224,230,237,0.85)]">CSV Format:</p>
                  <pre className="p-4 bg-[rgba(255,255,255,0.01)] rounded-lg text-xs overflow-x-auto text-[rgba(224,230,237,0.7)]">
                    {`question,expected_answer,actual_answer
What is the capital of France?,Paris,The capital of France is Paris
Who wrote Romeo and Juliet?,William Shakespeare,Shakespeare`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-8 w-full">
            <TabsList className="flex justify-center gap-4 p-2 rounded-xl bg-[rgba(255,255,255,0.04)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] shadow-inner">
              <TabsTrigger
                value="overview"
                className="px-5 py-3 text-sm font-medium text-purple-500 data-[state=active]:bg-purple-600/30 data-[state=active]:text-white rounded-lg transition-all"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="px-5 py-3 text-sm font-medium text-purple-500 data-[state=active]:bg-purple-600/30 data-[state=active]:text-white rounded-lg transition-all"
              >
                Question Details
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="px-5 py-3 text-sm font-medium text-purple-500 data-[state=active]:bg-purple-600/30 data-[state=active]:text-white rounded-lg transition-all"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* === OVERVIEW TAB === */}
            <TabsContent value="overview" className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TestRunResults metrics={metrics} totalQuestions={testResults.length} />

                <Card className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-lg shadow-purple-800/10 transition-transform">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      Score Distribution
                    </CardTitle>
                    <CardDescription className="text-[rgba(224,230,237,0.7)]">
                      Performance across different metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metricsChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="metric" stroke="#ccc" />
                          <YAxis domain={[0, 100]} stroke="#ccc" />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(30,30,40,0.9)",
                              border: "1px solid rgba(255,255,255,0.05)",
                              borderRadius: "10px",
                            }}
                          />
                          <Bar
                            dataKey="score"
                            fill="url(#colorGradient)"
                            radius={[6, 6, 0, 0]}
                          />
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                              <stop offset="95%" stopColor="#3b0764" stopOpacity={0.7} />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* === SUMMARY CARD === */}
              <Card className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-lg shadow-purple-800/10">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    Test Summary
                  </CardTitle>
                  <CardDescription className="text-[rgba(224,230,237,0.7)]">
                    Key statistics from this test run
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-4 bg-linear-to-br from-[rgba(255,255,255,0.04)] to-[rgba(255,255,255,0.01)] rounded-xl text-center">
                      <p className="text-xs text-[rgba(224,230,237,0.7)] mb-1">
                        Total Questions
                      </p>
                      <p className="text-3xl font-semibold text-white">
                        {testResults.length}
                      </p>
                    </div>

                    <div className="p-4 bg-green-500/10 border border-green-600/40 rounded-xl text-center">
                      <p className="text-xs text-green-300 mb-1">Exact Matches</p>
                      <p className="text-3xl font-semibold text-green-300">
                        {testResults.filter((r) => r.exactMatch).length}
                      </p>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-600/40 rounded-xl text-center">
                      <p className="text-xs text-blue-300 mb-1">High BLEU (≥80)</p>
                      <p className="text-3xl font-semibold text-blue-300">
                        {testResults.filter((r) => r.bleuScore >= 80).length}
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-600/40 rounded-xl text-center">
                      <p className="text-xs text-yellow-300 mb-1">Needs Review (&lt;50)</p>
                      <p className="text-3xl font-semibold text-yellow-300">
                        {testResults.filter((r) => r.bleuScore < 50).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* === DETAILS TAB === */}
            <TabsContent value="details" className="space-y-6 animate-fadeIn">
              <QuestionDetailView results={testResults} />
            </TabsContent>

            {/* === ANALYTICS TAB === */}
            <TabsContent value="analytics" className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-lg shadow-purple-800/10 transition-transform hover:scale-[1.01]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[rgba(255,255,255,0.95)]">
                      Metrics Radar Chart
                    </CardTitle>
                    <CardDescription className="text-[rgba(224,230,237,0.7)]">
                      Multi-dimensional performance view
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarChartData}>
                          <PolarGrid stroke="rgba(255,255,255,0.05)" />
                          <PolarAngleAxis dataKey="metric" stroke="#ccc" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#aaa" />
                          <Radar
                            name="Score"
                            dataKey="score"
                            stroke="#a855f7"
                            fill="#a855f7"
                            fillOpacity={0.45}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-lg shadow-purple-800/10 transition-transform hover:scale-[1.01]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[rgba(255,255,255,0.95)]">
                      Performance Insights
                    </CardTitle>
                    <CardDescription className="text-[rgba(224,230,237,0.7)]">
                      Analysis based on test results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {metrics && metrics.f1Score >= 80 && (
                      <div className="p-4 bg-green-500/10 border border-green-600/40 rounded-xl">
                        <p className="text-sm text-green-300">
                          ✓ Excellent overall performance with F1 score above 80%
                        </p>
                      </div>
                    )}

                    {metrics && metrics.exactMatch > 30 && (
                      <div className="p-4 bg-green-500/10 border border-green-600/40 rounded-xl">
                        <p className="text-sm text-green-300">
                          ✓ High exact match rate ({metrics.exactMatch.toFixed(1)}%)
                        </p>
                      </div>
                    )}

                    {metrics && metrics.precision > metrics.recall + 10 && (
                      <div className="p-4 bg-blue-500/10 border border-blue-600/40 rounded-xl">
                        <p className="text-sm text-blue-300">
                          ℹ Precision significantly higher than recall — model is conservative
                        </p>
                      </div>
                    )}

                    {metrics && metrics.recall > metrics.precision + 10 && (
                      <div className="p-4 bg-blue-500/10 border border-blue-600/40 rounded-xl">
                        <p className="text-sm text-blue-300">
                          ℹ Recall higher than precision — model generates verbose responses
                        </p>
                      </div>
                    )}

                    {metrics && metrics.bleuScore < 60 && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-600/40 rounded-xl">
                        <p className="text-sm text-yellow-300">
                          ⚠ BLEU score below 60% — significant wording differences detected
                        </p>
                      </div>
                    )}

                    {metrics && metrics.f1Score < 60 && (
                      <div className="p-4 bg-red-500/10 border border-red-600/40 rounded-xl">
                        <p className="text-sm text-red-300">
                          ✗ F1 score below 60% — model performance needs improvement
                        </p>
                      </div>
                    )}

                    <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl">
                      <p className="text-sm text-[rgba(224,230,237,0.75)]">
                        <span className="text-[rgba(224,230,237,0.65)]">
                          Average token overlap:
                        </span>{" "}
                        {metrics ? `${Number(metrics.averageTokenOverlap).toFixed(1)}%` : "0.0%"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}