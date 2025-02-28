
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Trophy, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeaderboardPage() {
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Full Leaderboard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Ranked Users</CardTitle>
        </CardHeader>
        <CardContent>
          {!users?.length ? (
            <p className="text-center text-muted-foreground py-4">No users found</p>
          ) : (
            <div className="space-y-2">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded bg-accent/10"
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                    {index === 2 && <Trophy className="h-5 w-5 text-amber-700" />}
                    <span className="font-medium text-lg">#{index + 1}</span>
                    <span className="text-lg">{user.username}</span>
                  </div>
                  <span className="font-bold text-lg">{user.score}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
