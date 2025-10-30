import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

/* Small visual card for a single metric */
export function ScoreCard({ title, score, description, maxScore = 100 }) {
  const percentage = (Number(score) / Number(maxScore)) * 100;

  const getScoreColor = (p) => {
    if (p >= 80) return "text-green-600";
    if (p >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-[rgba(224,230,237,0.75)]">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className={`${getScoreColor(percentage)} text-2xl font-semibold`}>
            {Number(score).toFixed(1)}/{maxScore}
          </div>
          <Progress value={percentage} className="h-2" />
          {description && <p className="text-xs text-[rgba(224,230,237,0.7)]">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}