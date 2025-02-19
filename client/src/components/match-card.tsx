import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Match } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Camera } from "lucide-react";

export function MatchCard({ match }: { match: Match }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const isCreator = user?.id === match.creatorId;

  const getStatusColor = () => {
    switch (match.status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "ready":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "declined":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "";
    }
  };

  const getStatusMessage = () => {
    if (match.status === "pending") {
      return isCreator ? "Waiting for response" : "Invitation received";
    }
    return match.status.charAt(0).toUpperCase() + match.status.slice(1);
  };

  const formatScore = (score: string | null | undefined) => {
    if (!score) return '-';
    const numScore = parseFloat(score);
    return isNaN(numScore) ? '-' : numScore.toFixed(1);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {isCreator ? "Your Compare AI Challenge" : "Compare AI Challenge Received"}
        </CardTitle>
        <Badge className={getStatusColor()}>
          {getStatusMessage()}
        </Badge>
      </CardHeader>
      <CardContent>
        {match.status === "completed" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <h3 className="font-bold mb-1">Your Score</h3>
              <p className="text-2xl">
                {formatScore(isCreator ? match.creatorScore : match.invitedScore)}
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-bold mb-1">Their Score</h3>
              <p className="text-2xl">
                {formatScore(isCreator ? match.invitedScore : match.creatorScore)}
              </p>
            </div>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => setLocation(`/match/${match.id}`)}
            variant={match.status === "pending" && !isCreator ? "default" : "secondary"}
          >
            {match.status === "pending" && !isCreator ? (
              "Respond to Challenge"
            ) : (
              "View Challenge"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}