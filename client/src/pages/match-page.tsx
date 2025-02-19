import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Match } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Camera } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useWebSocket } from "@/hooks/use-websocket";

export default function MatchPage() {
  const [, params] = useRoute("/match/:id");
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize WebSocket connection
  useWebSocket();

  const { data: match, isLoading } = useQuery<Match>({
    queryKey: [`/api/matches/${params?.id}`],
  });

  const respondMutation = useMutation({
    mutationFn: async (accept: boolean) => {
      if (accept && !selectedFile) throw new Error("No file selected");

      const formData = new FormData();
      if (selectedFile) formData.append("photo", selectedFile);
      formData.append("accept", String(accept));

      const res = await fetch(`/api/matches/${params?.id}/respond`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/matches/${params?.id}`] });
      toast({
        title: "Response sent",
        description: "Your response has been recorded",
      });
    },
  });

  const compareMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/matches/${params?.id}/compare`);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/matches/${params?.id}`] });
      toast({
        title: "Comparison complete",
        description: `Your score: ${data.creatorScore.toFixed(1)}, Their score: ${data.invitedScore.toFixed(1)}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Comparison failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-6">
            <Progress value={33} className="w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!match) return null;

  const isCreator = user?.id === match.creatorId;
  const isPending = match.status === "pending";
  const isReady = match.status === "ready";
  const isCompleted = match.status === "completed";

  const formatScore = (score: number | undefined | null): string => {
    return score !== null && score !== undefined ? Number(score).toFixed(1) : '-';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Compare AI Match
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPending && !isCreator && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>New Compare AI Challenge</AlertTitle>
                <AlertDescription>
                  You've been invited to a Compare AI match. Upload your photo to accept or decline the challenge.
                </AlertDescription>
              </Alert>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />

              {selectedFile && (
                <Alert>
                  <Camera className="h-4 w-4" />
                  <AlertTitle>Photo selected</AlertTitle>
                  <AlertDescription>
                    {selectedFile.name}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => respondMutation.mutate(true)}
                  disabled={!selectedFile || respondMutation.isPending}
                >
                  Accept Challenge
                </Button>
                <Button
                  variant="outline"
                  onClick={() => respondMutation.mutate(false)}
                  disabled={respondMutation.isPending}
                >
                  Decline
                </Button>
              </div>
            </>
          )}

          {isPending && isCreator && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Waiting for Response</AlertTitle>
              <AlertDescription>
                Your Compare AI challenge has been sent. Waiting for your friend to respond.
              </AlertDescription>
            </Alert>
          )}

          {isReady && isCreator && (
            <>
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertTitle>Ready to Compare</AlertTitle>
                <AlertDescription>
                  Both photos have been uploaded. Start the AI comparison now!
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => compareMutation.mutate()}
                disabled={compareMutation.isPending}
                className="w-full"
              >
                Compare Photos
              </Button>
            </>
          )}

          {isReady && !isCreator && (
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertTitle>Processing</AlertTitle>
              <AlertDescription>
                Your photo has been uploaded. Waiting for the challenge creator to start the comparison.
              </AlertDescription>
            </Alert>
          )}

          {isCompleted && (
            <>
              <Alert className={match.creatorScore === match.invitedScore ? "bg-blue-500/10" :
                ((isCreator ? Number(match.creatorScore!) > Number(match.invitedScore!) : Number(match.invitedScore!) > Number(match.creatorScore!))
                  ? "bg-green-500/10" : "bg-red-500/10")}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Results</AlertTitle>
                <AlertDescription>
                  {match.creatorScore === match.invitedScore
                    ? "It's a tie!"
                    : (isCreator ? Number(match.creatorScore!) > Number(match.invitedScore!) : Number(match.invitedScore!) > Number(match.creatorScore!))
                      ? "You won!"
                      : "Your friend won!"}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <h3 className="font-bold">Your Score</h3>
                  <p className="text-2xl">
                    {formatScore(isCreator ? match.creatorScore : match.invitedScore)}
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="font-bold">Their Score</h3>
                  <p className="text-2xl">
                    {formatScore(isCreator ? match.invitedScore : match.creatorScore)}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}