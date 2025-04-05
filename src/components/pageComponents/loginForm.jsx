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
import { loginFormSchema } from "./schemas/formSchemas";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful:", data);
    } catch (error) {
      setServerError(error.message);
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
          <AlertDialogDescription className="mt-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Email"
                  className="h-11 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Password"
                  className="h-11 w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              {serverError && <p className="text-sm text-red-500 mt-1">{serverError}</p>}

              <AlertDialogFooter className="mt-3 gap-3">
                <AlertDialogCancel className="h-10 px-6">Cancel</AlertDialogCancel>
                <Button type="submit" className="h-10 px-6" as={AlertDialogAction}>
                  Continue
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoginForm;