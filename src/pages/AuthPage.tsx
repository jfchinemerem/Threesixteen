import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Logo from "@/components/layout/Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, signUp, getSession } from "@/services/supabase";
import { useToast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const defaultTab =
    searchParams.get("tab") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { session, error } = await getSession();
        if (session) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Session check error:", err);
        // Don't redirect on error, allow user to try logging in
      }
    };

    checkSession();
  }, [navigate]);

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [id]: id === "remember" ? checked : value,
    }));
  };

  // Handle register form changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [id]: id === "terms" ? checked : value,
    }));
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting to sign in with:", { email: loginForm.email });
      const { data, error } = await signIn(loginForm.email, loginForm.password);
      console.log("Sign in response:", { data, error });

      if (error) {
        throw error;
      }

      if (data) {
        // If user data has firstName, store it
        if (data.user?.user_metadata?.firstName) {
          localStorage.setItem("firstName", data.user.user_metadata.firstName);
        }

        toast({
          title: "Success",
          description: "You have been logged in successfully.",
        });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.message || "Failed to sign in. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate password match
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate terms acceptance
    if (!registerForm.terms) {
      setError("You must accept the terms and conditions");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting to sign up with:", {
        email: registerForm.email,
        password: "[REDACTED]",
        metadata: {
          firstName: registerForm.firstName,
          lastName: registerForm.lastName,
        },
      });

      const { data, error } = await signUp(
        registerForm.email,
        registerForm.password,
        {
          firstName: registerForm.firstName,
          lastName: registerForm.lastName,
        },
      );

      console.log("Sign up response:", { data, error });

      if (error) {
        throw error;
      }

      if (data) {
        // Store first name in localStorage for greeting
        localStorage.setItem("firstName", registerForm.firstName);

        toast({
          title: "Account created",
          description:
            "Your account has been created successfully. Please check your email for verification.",
        });
        setActiveTab("login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary/5 to-primary-logo/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="flex justify-center mb-8">
          <Logo size="medium" />
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login"
                ? "Sign in to your account"
                : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={defaultTab}
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form className="space-y-4" onSubmit={handleLogin}>
                  {error && (
                    <div className="p-3 text-sm text-white bg-destructive rounded">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={loginForm.remember}
                      onCheckedChange={(checked) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          remember: !!checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form className="space-y-4" onSubmit={handleRegister}>
                  {error && (
                    <div className="p-3 text-sm text-white bg-destructive rounded">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        value={registerForm.firstName}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        value={registerForm.lastName}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={registerForm.terms}
                      onCheckedChange={(checked) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          terms: !!checked,
                        }))
                      }
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        terms and conditions
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" disabled>
                Google
              </Button>
              <Button variant="outline" className="w-full" disabled>
                GitHub
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
