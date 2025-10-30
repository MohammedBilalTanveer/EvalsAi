import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";

/* Enhanced per-question analysis with refined cosmic glass styling */
export function QuestionDetailView({ results }) {
  const getScoreBadge = (score) => {
    if (score >= 80) {
      return (
        <Badge className="bg-green-500/20 text-green-300 border border-green-400/40">
          High
        </Badge>
      );
    } else if (score >= 50) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40">
          Medium
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500/20 text-red-300 border border-red-400/40">
          Low
        </Badge>
      );
    }
  };

  return (
    <Card className="bg-[rgba(15,10,25,0.8)] backdrop-blur-lg border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-lg shadow-purple-900/30">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Question-by-Question Analysis
        </CardTitle>
        <CardDescription className="text-[rgba(224,230,237,0.75)]">
          Detailed breakdown of each question and comparison of LLM outputs
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-5">
            {(results || []).map((result, index) => (
              <Card
                key={index}
                className="relative rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-br from-[#120a1c] via-[#1b0f2d] to-[#0b0612] shadow-lg shadow-purple-900/20 hover:shadow-purple-800/30 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-white/90">
                        Question {index + 1}
                      </CardTitle>
                      <CardDescription className="mt-1 text-[rgba(224,230,237,0.85)]">
                        {result.question}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      {result.exactMatch ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : result.bleuScore >= 70 ? (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      {getScoreBadge(result.bleuScore)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-green-900/20 to-green-700/10 border border-green-500/30 rounded-xl">
                      <p className="text-xs text-green-300 mb-1">
                        Expected Answer
                      </p>
                      <p className="text-sm text-[rgba(255,255,255,0.9)]">
                        {result.expectedAnswer}
                      </p>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-blue-900/20 to-blue-700/10 border border-blue-500/30 rounded-xl">
                      <p className="text-xs text-blue-300 mb-1">
                        Actual Answer
                      </p>
                      <p className="text-sm text-[rgba(255,255,255,0.9)]">
                        {result.actualAnswer || (
                          <em className="text-[rgba(224,230,237,0.65)]">
                            No answer provided
                          </em>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[rgba(224,230,237,0.75)]">
                        <span>BLEU Score</span>
                        <span>{Number(result.bleuScore || 0).toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={result.bleuScore || 0}
                        className="h-2 bg-[rgba(255,255,255,0.1)] [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-blue-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[rgba(224,230,237,0.75)]">
                        <span>Token Overlap</span>
                        <span>{Number(result.tokenOverlap || 0).toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={result.tokenOverlap || 0}
                        className="h-2 bg-[rgba(255,255,255,0.1)] [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-teal-300"
                      />
                    </div>
                  </div>

                  {result.exactMatch && (
                    <div className="flex items-center gap-2 text-xs text-green-300 bg-gradient-to-r from-green-800/20 to-green-700/10 border border-green-500/30 p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Exact match detected</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}