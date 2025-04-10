"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { loginFormSchema } from "@/components/pageComponents/schemas/formSchemas";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = loginFormSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="w-80 mt-3 h-11">Login</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md w-full shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">Login Form</AlertDialogTitle>
          <AlertDialogDescription className="mt-3 text-muted-foreground text-sm">
            Enter your credentials to log in to vatCoins.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block mb-1 font-medium">Email</label>
          <Input
            type="email"
            placeholder="Email"
            className="h-11 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}

          <label className="block mb-1 font-medium">Password</label>
          <Input
            type="password"
            placeholder="Password"
            className="h-11 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}

          {serverError && <p className="text-sm text-red-500 mt-1">{serverError}</p>}
        </form>
        <AlertDialogFooter className="mt-3 gap-3">
          <AlertDialogCancel className="h-10 px-6">Cancel</AlertDialogCancel>
          <Button
            type="submit"
            form="login-form"
            className="h-10 px-6"
            disabled={isLoading}
            onClick={() => document.querySelector("form").requestSubmit()}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoginForm;