
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Error",
        description: "Please enter some feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ feedback }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully.",
      });
      setFeedback("");
      setIsOpen(false);
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Give Feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Website Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Textarea
            placeholder="Tell us what we can improve..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmit} className="w-full">
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
