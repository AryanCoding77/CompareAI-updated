import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Trophy } from "lucide-react";

export function Leaderboard() {
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });

  if (!users?.length) return null;

  return (
    <div className="space-y-2">
      {users.map((user, index) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-2 rounded bg-accent/10"
        >
          <div className="flex items-center gap-2">
            {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
            <span>{user.username}</span>
          </div>
          <span className="font-bold">{user.score}</span>
        </div>
      ))}
    </div>
  );
}
