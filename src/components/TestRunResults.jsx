import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Progress } from "./ui/progress";

/* Summarizes overall run metrics */
export function TestRunResults({ metrics, totalQuestions, testName }) {
  const getStatusBadge = () => {
    if (!metrics) return <Badge className="bg-[rgba(255,255,255,0.03)]">No data</Badge>;
    if (metrics.f1Score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (metrics.f1Score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const getStatusIcon = () => {
    if (!metrics) return null;
    if (metrics.f1Score >= 80) return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    if (metrics.f1Score >= 60) return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  const metricsList = [
    { label: "BLEU Score", value: metrics?.bleuScore || 0 },
    { label: "F1 Score", value: metrics?.f1Score || 0 },
    { label: "Precision", value: metrics?.precision || 0 },
    { label: "Recall", value: metrics?.recall || 0 },
    { label: "Exact Match", value: metrics?.exactMatch || 0 },
    { label: "Token Overlap", value: metrics?.averageTokenOverlap || 0 },
  ];

  return (
    <Card className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Test Run Results {testName ? `- ${testName}` : ""}</CardTitle>
            <CardDescription className="text-[rgba(224,230,237,0.75)]">
              Evaluated {totalQuestions} questions with various NLP metrics
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-[rgba(255,255,255,0.01)] rounded-lg">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="text-sm text-[rgba(224,230,237,0.7)]">Overall F1 Score</p>
            <p className="text-2xl font-semibold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">{metrics ? Number(metrics.f1Score).toFixed(2) : "0.00"}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[rgba(224,230,237,0.7)]">Exact Matches</p>
            <p className="text-2xl font-semibold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              {metrics ? `${Math.round((metrics.exactMatch / 100) * totalQuestions)}/${totalQuestions}` : `0/${totalQuestions}`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {metricsList.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-[rgba(224,230,237,0.75)]">
                <span>{metric.label}</span>
                <span>{Number(metric.value).toFixed(2)}%</span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(255,255,255,0.04)]">
          <div className="text-center">
            <p className="text-xs text-[rgba(224,230,237,0.7)] mb-1">Avg BLEU</p>
            <p className="text-xl font-semibold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">{metrics ? Number(metrics.bleuScore).toFixed(1) : "0.0"}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[rgba(224,230,237,0.7)] mb-1">Accuracy</p>
            <p className="text-xl font-semibold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">{metrics ? `${Number(metrics.accuracy).toFixed(1)}%` : "0.0%"}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[rgba(224,230,237,0.7)] mb-1">Questions</p>
            <p className="text-xl font-semibold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">{totalQuestions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}