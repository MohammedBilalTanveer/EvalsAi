import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

/* Visual card representing a single test run summary */
export function TestResultCard({ result, onViewDetails }) {
  const getStatusIcon = () => {
    switch (result.status) {
      case "passed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (result.status) {
      case "passed":
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-[rgba(255,255,255,0.03)] text-[rgba(224,230,237,0.8)]">Unknown</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-2xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <CardTitle className="text-lg">{result.productName}</CardTitle>
            </div>
            <CardDescription className="text-[rgba(224,230,237,0.75)]">
              Version {result.version} • Tested on {new Date(result.testDate).toLocaleDateString()}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgba(224,230,237,0.7)]">Overall Score</span>
            <span className="text-2xl font-semibold">{Number(result.overallScore).toFixed(1)}/100</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-[rgba(224,230,237,0.75)]">
            <div className="flex justify-between"><span>Accuracy:</span><span>{Number(result.categories.accuracy).toFixed(0)}</span></div>
            <div className="flex justify-between"><span>Performance:</span><span>{Number(result.categories.performance).toFixed(0)}</span></div>
            <div className="flex justify-between"><span>Reliability:</span><span>{Number(result.categories.reliability).toFixed(0)}</span></div>
            <div className="flex justify-between"><span>Cost:</span><span>{Number(result.categories.costEfficiency).toFixed(0)}</span></div>
            <div className="flex justify-between"><span>UX:</span><span>{Number(result.categories.userExperience).toFixed(0)}</span></div>
            <div className="flex justify-between"><span>Safety:</span><span>{Number(result.categories.safety).toFixed(0)}</span></div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => onViewDetails(result.id)}>
            View Details
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}