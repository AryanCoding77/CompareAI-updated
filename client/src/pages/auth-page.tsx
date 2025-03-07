
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { RiUserSmileLine } from "react-icons/ri";
import { useEffect } from "react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/home");
    }
  }, [user, setLocation]);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex items-center flex-col">
            <RiUserSmileLine className="w-12 h-12 text-primary" />
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#e7f2ff] to-[#f0f7ff] items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Compare AI</h1>
          <p className="text-lg text-gray-600">
            Challenge your friends to photo comparisons using advanced AI technology.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error: any) {
      console.error("Login error:", error);
      form.setError("root", { 
        message: error?.message || error?.response?.data?.message || "Login failed. Please try again." 
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mt-4"
      >
        <div className="space-y-2">
          <Input
            placeholder="Username"
            {...form.register("username", { required: "Username is required" })}
          />
          {form.formState.errors.username && (
            <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            {...form.register("password", { required: "Password is required" })}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>
        {form.formState.errors.root && (
          <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      acceptPolicy: false
    },
    mode: "onSubmit"
  });

  const onSubmit = async (data) => {
    const { acceptPolicy, ...userData } = data;
    try {
      await registerMutation.mutateAsync(userData);
    } catch (error: any) {
      form.setError("root", {
        message: error?.response?.data?.message || "Registration failed. Please try again."
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Input
            placeholder="Username"
            {...form.register("username", { required: true })}
          />
          {form.formState.errors.username && (
            <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Password"
            {...form.register("password", { required: true })}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="acceptPolicy"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              {...form.register("acceptPolicy", { required: true })}
            />
            <label htmlFor="acceptPolicy" className="text-sm">
              I accept the{" "}
              <a
                href="/privacy-policy"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/privacy-policy");
                }}
                className="text-primary hover:underline"
              >
                privacy policy
              </a>
            </label>
          </div>
          {form.formState.errors.acceptPolicy && (
            <p className="text-sm text-red-500">{form.formState.errors.acceptPolicy.message}</p>
          )}
        </div>
        {form.formState.errors.root && (
          <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}
