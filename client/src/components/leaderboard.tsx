
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "./ui/button";

interface LeaderboardProps {
  limit?: number;
  showViewMore?: boolean;
}

export function Leaderboard({ limit = 5, showViewMore = true }: LeaderboardProps) {
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });
  const [, navigate] = useLocation();

  if (!users?.length) return null;

  // Limit the number of users to display
  const displayUsers = limit ? users.slice(0, limit) : users;

  return (
    <div className="space-y-2">
      {displayUsers.map((user, index) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-2 rounded bg-accent/10"
        >
          <div className="flex items-center gap-2">
            {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
            <span className="font-medium">#{index + 1}</span>
            <span>{user.username}</span>
          </div>
          <span className="font-bold ml-8">{user.score}</span>
        </div>
      ))}
      
      {showViewMore && users.length > limit && (
        <Button 
          variant="outline" 
          className="w-full mt-2"
          onClick={() => navigate("/leaderboard")}
        >
          View Full Leaderboard
        </Button>
      )}
    </div>
  );
}
