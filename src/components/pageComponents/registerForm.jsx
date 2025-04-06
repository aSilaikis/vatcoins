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
import { registerFormSchema } from "@/components/pageComponents/schemas/formSchemas";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = registerFormSchema.safeParse({
      email,
      password,
      confirmPassword,
    });

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="w-80 mt-3 h-11">Register</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md w-full shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">Register Form</AlertDialogTitle>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="h-11 w-full"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {serverError && <p className="text-sm text-red-500 mt-1">{serverError}</p>}

              <AlertDialogFooter className="mt-3 gap-3">
                <AlertDialogCancel className="h-10 px-6">Cancel</AlertDialogCancel>
                <Button type="submit" className="h-10 px-6" as={AlertDialogAction}>
                  {isLoading ? "Loading..." : "Register"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RegisterForm;
