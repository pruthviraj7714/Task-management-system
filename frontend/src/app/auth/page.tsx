"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTodo } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Email should be valid." }),
  password: z
    .string()
    .min(6, { message: "password must be at least of 6 characters" }),
});

const signinSchema = z.object({
  email: z.string().email({ message: "Email should be valid." }),
  password: z
    .string()
    .min(6, { message: "password must be at least of 6 characters" }),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("signup");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const signinForm = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
        const res = await axios.post(`${BACKEND_URL}/user/signup`, values);
        toast.success(res.data.message, {description : "Now sign in with your credentials"});
        setActiveTab("signin");
        signupForm.reset();
    } catch (error : any) {
        toast.error(error?.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    try {
        const res = await axios.post(`${BACKEND_URL}/user/signin`, values);
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        router.push('/home')
    } catch (error : any) {
        toast.error(error.response.data.message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-black/15 shadow-xl">
        <Link className="flex items-center justify-center" href="/">
          <ListTodo className="h-6 w-6" />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <ListTodo className="h-8 w-8 text-primary mr-2" />
              <CardTitle className="text-2xl font-bold">Task Master</CardTitle>
            </div>
            <CardDescription>
              Manage your tasks efficiently with Task Master
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
              </TabsList>
              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form
                    onSubmit={signupForm.handleSubmit(handleSignUp)}
                    className="space-y-8"
                  >
                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="tony43" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="tony@gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} >{isLoading ? "Loading..." : "Submit"}</Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="signin">
                <Form {...signinForm}>
                  <form
                    onSubmit={signinForm.handleSubmit(handleSignIn)}
                    className="space-y-8"
                  >
                    <FormField
                      control={signinForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="tony@gmail.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signinForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Submit"}</Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-black/15 shadow-xl">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
