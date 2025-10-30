import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScoreCard } from "./ScoreCard";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

/* Modal to show detailed test result */
export function TestDetailModal({ result, open, onOpenChange }) {
  if (!result) return null;

  const chartData = [
    { category: "Accuracy", score: result.categories.accuracy },
    { category: "Performance", score: result.categories.performance },
    { category: "Reliability", score: result.categories.reliability },
    { category: "Cost", score: result.categories.costEfficiency },
    { category: "UX", score: result.categories.userExperience },
    { category: "Safety", score: result.categories.safety },
  ];

  const testDetails = [
    { label: "Total Tests Run", value: "1,247" },
    { label: "Success Rate", value: "94.3%" },
    { label: "Average Response Time", value: "342ms" },
    { label: "Error Rate", value: "0.8%" },
    { label: "Tokens Processed", value: "2.4M" },
    { label: "Test Duration", value: "4h 23m" },
  ];

  const findings = [
    { type: "success", message: "Excellent accuracy on factual queries" },
    { type: "success", message: "Consistent performance across all test cases" },
    { type: "warning", message: "Higher latency on complex reasoning tasks" },
    { type: "info", message: "Cost per request within expected range" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[rgba(255,255,255,0.02)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{result.productName} - Detailed Results</DialogTitle>
          <DialogDescription className="text-[rgba(224,230,237,0.75)]">
            Version {result.version} • Tested on {new Date(result.testDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scores">Score Breakdown</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.02)] rounded-lg">
              <div>
                <p className="text-sm text-[rgba(224,230,237,0.7)]">Overall Score</p>
                <p className="text-3xl font-semibold">{Number(result.overallScore).toFixed(1)}/100</p>
              </div>

              <Badge
                className={
                  result.status === "passed"
                    ? "bg-green-100 text-green-800"
                    : result.status === "warning"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {String(result.status).toUpperCase()}
              </Badge>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name={result.productName}
                    dataKey="score"
                    stroke="hsl(262 47% 61%)"
                    fill="hsl(262 47% 61%)"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {testDetails.map((detail) => (
                <div key={detail.label} className="p-3 bg-[rgba(255,255,255,0.01)] rounded-lg">
                  <p className="text-xs text-[rgba(224,230,237,0.65)]">{detail.label}</p>
                  <p className="mt-1 text-white">{detail.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scores" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <ScoreCard title="Accuracy" score={result.categories.accuracy} description="Correctness of responses and outputs" />
              <ScoreCard title="Performance" score={result.categories.performance} description="Speed and efficiency metrics" />
              <ScoreCard title="Reliability" score={result.categories.reliability} description="Consistency and uptime" />
              <ScoreCard title="Cost Efficiency" score={result.categories.costEfficiency} description="Value for money and resource usage" />
              <ScoreCard title="User Experience" score={result.categories.userExperience} description="Ease of use and interface quality" />
              <ScoreCard title="Safety" score={result.categories.safety} description="Security and ethical considerations" />
            </div>
          </TabsContent>

          <TabsContent value="findings" className="space-y-3">
            {findings.map((finding, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)]">
                {finding.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />}
                {finding.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />}
                {finding.type === "info" && <Info className="w-5 h-5 text-blue-600 mt-0.5" />}
                <p className="text-sm flex-1 text-[rgba(224,230,237,0.85)]">{finding.message}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}