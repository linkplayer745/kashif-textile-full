import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Login Form */}
        <LoginForm />

        {/* New Customer Section */}
        <Card className="w-full">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-2xl font-bold">New Customer</h2>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Create an Account</h3>
              <p className="text-muted-foreground text-sm">
                Sign up for a free account at our store. Registration is quick
                and easy. It allows you to be able to order from our shop. To
                start shopping click register.
              </p>
            </div>

            <Link href="/register">
              <Button className="w-fit bg-red-600 text-white hover:bg-red-700">
                Create an Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
