import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RiUserSmileLine } from "react-icons/ri";

export default function FeedbackPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    if (!formData.message.trim()) {
      toast({
        title: "Error",
        description: "Please enter your message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the feedback message to include all the information
      const feedbackMessage = `
Name/Username: ${formData.name}
Email: ${formData.email}
Message: ${formData.message}
      `.trim();

      // Send the feedback in the format expected by the server
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: feedbackMessage,
        }),
      });

      // Handle different response status codes
      if (response.status === 401) {
        // Handle unauthorized (not logged in)
        toast({
          title: "Error",
          description: "You need to be logged in to submit feedback",
          variant: "destructive",
        });
        return;
      }

      // For other non-OK responses, try to parse the JSON error
      if (!response.ok) {
        let errorMessage = "Failed to submit feedback";

        try {
          // Try to parse the error response as JSON
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If parsing fails, try to get the text response
          try {
            errorMessage = await response.text();
          } catch (textError) {
            // If that also fails, use the default error message
          }
        }

        throw new Error(errorMessage);
      }

      toast({
        title: "Success",
        description: "Your feedback has been submitted. Thank you!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-background py-4 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setLocation("/")}
          >
            <RiUserSmileLine className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Compare AI</h1>
          </div>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Feedback</CardTitle>
            <CardDescription>
              We value your feedback! Let us know how we can improve our
              service.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name / Username</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name or username"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Enter your feedback message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0084ff] hover:bg-[#0068cc]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Thank you for helping us improve!
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
