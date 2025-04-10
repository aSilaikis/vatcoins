import RegisterForm from "@/components/pageComponents/registerForm";
import LoginForm from "@/components/pageComponents/loginForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center sm:p-4 md:p-8">
      <Card className="w-[27%] min-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Welcome to vatCoins!</CardTitle>
          <CardDescription>
            Your go-to source for cryptocurrency information.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col mt-3">
          <LoginForm />
          <RegisterForm />
        </CardContent>
      </Card>
    </main>
  );
}
