import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Match, User } from "@shared/schema";
import { MatchCard } from "@/components/match-card";
import { Leaderboard } from "@/components/leaderboard";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Camera, User as UserIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWebSocket } from "@/hooks/use-websocket";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [invitedUsername, setInvitedUsername] = useState("");

  // Initialize WebSocket connection
  useWebSocket();

  const { data: matches } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  const createMatchMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");

      const formData = new FormData();
      formData.append("photo", selectedFile);
      formData.append("invitedUsername", invitedUsername);

      const res = await fetch("/api/matches", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      return await res.json();
    },
    onSuccess: (match) => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setSelectedFile(null);
      setInvitedUsername("");
      toast({
        title: "Invitation sent",
        description: `Waiting for ${invitedUsername} to respond`,
      });
      setLocation(`/match/${match.id}`);
    },
  });

  const pendingMatches = matches?.filter((m) => m.status === "pending") || [];
  const activeMatches = matches?.filter((m) => m.status === "ready") || [];
  const completedMatches =
    matches?.filter((m) => m.status === "completed") || [];

  const handleFeedbackClick = () => {
    setLocation("/feedback");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-background py-4 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Camera className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Compare AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleFeedbackClick}
              className="hidden md:flex"
            >
              Feedback
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation("/leaderboard")}
              className="hidden md:flex"
            >
              Leaderboard
            </Button>
            <Button variant="ghost" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Start New Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createMatchMutation.mutate();
                }}
                className="space-y-4"
              >
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] ?? null)
                    }
                    className="mb-2"
                  />
                  {selectedFile && (
                    <div className="space-y-2">
                      <Alert>
                        <Camera className="h-4 w-4" />
                        <AlertTitle>Photo selected</AlertTitle>
                        <AlertDescription>{selectedFile.name}</AlertDescription>
                      </Alert>
                      <div className="rounded-md overflow-hidden w-32 h-32">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="h-4 w-4" />
                    <span>Friend's username</span>
                  </div>
                  <Input
                    placeholder="Enter username to invite"
                    value={invitedUsername}
                    onChange={(e) => setInvitedUsername(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    !selectedFile ||
                    !invitedUsername ||
                    createMatchMutation.isPending
                  }
                >
                  Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Leaderboard />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Matches</CardTitle>
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  if (
                    confirm(
                      "Are you sure you want to delete all your matches? This cannot be undone."
                    )
                  ) {
                    try {
                      const response = await fetch("/api/matches", {
                        method: "DELETE",
                        credentials: "include",
                      });
                      if (!response.ok)
                        throw new Error("Failed to delete matches");
                      queryClient.invalidateQueries({
                        queryKey: ["/api/matches"],
                      });
                      toast({
                        title: "Success",
                        description: "All matches have been deleted",
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to delete matches",
                        variant: "destructive",
                      });
                    }
                  }
                }}
              >
                Delete All Matches
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending
                  {pendingMatches.length > 0 && (
                    <span className="ml-2 bg-primary/20 px-2 py-0.5 rounded-full text-sm">
                      {pendingMatches.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <div className="grid gap-4 mt-4">
                  {pendingMatches.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No pending matches</AlertTitle>
                      <AlertDescription>
                        Start a new comparison or wait for friends to invite
                        you.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    pendingMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="active">
                <div className="grid gap-4 mt-4">
                  {activeMatches.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No active matches</AlertTitle>
                      <AlertDescription>
                        You don't have any ongoing comparisons.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    activeMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="grid gap-4 mt-4">
                  {completedMatches.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No completed matches</AlertTitle>
                      <AlertDescription>
                        Complete some comparisons to see your results here.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    completedMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Add a feedback button in the mobile view */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <Button
          onClick={handleFeedbackClick}
          className="rounded-full w-12 h-12 p-0 bg-primary hover:bg-primary/90"
        >
          <span className="sr-only">Feedback</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-square"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </Button>
      </div>
    </div>
  );
}
