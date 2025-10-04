import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {login} from "@/api/auth.ts" ;
import {
  loginSchema,
  type LoginFormData,
} from '@/types/api/auth.ts';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Link} from 'react-router-dom';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormErrors,
  addErrors
} from "@/components/ui/form";
import {ValidationError, AuthenticationError} from "@/api/errors";

export default function Login(){
  const [formError, setFormError] = useState<string>("");
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username_or_email: "",
      password: "",
    },
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormData) => {
      return login(values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate('/');
    },
    onError: (error) => {
      setFormError(""); 
      
      if (error instanceof ValidationError) {
        const fieldErrors = error.field_errors;
        addErrors(form, fieldErrors);
      } 
      else if (error instanceof AuthenticationError) {
        setFormError("Invalid username/email or password.");
      } 
      else {
        setFormError("Something went wrong. Please try again later.");
      }
    },
  });

  async function onSubmit(values: LoginFormData) {
    setFormError("");
    await loginMutation.mutateAsync(values);
  }


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full border-0 shadow-none max-w-sm  bg-background">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
          

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                name="username_or_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md">Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder=""
                        className="text-md"
                      />
                    </FormControl>
                    <FormErrors error={form.formState.errors.username_or_email}/>
                  </FormItem>
                )}
              />
              
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="text-md">Password</FormLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <Input 
                        {...field}
                        type="password" 
                        className="text-md"
                      />
                    </FormControl>
                    <FormErrors error={form.formState.errors.password}/>
                  </FormItem>
                )}
              />

              {/* General error message */}
              {formError && (
                <p className="text-destructive text-sm">
                  {formError}
                </p>
              )}

              <Button 
                type="submit" 
                className="w-full text-md py-5 cursor-pointer"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <p>Don't have an account?</p>
            <Link
              to="/signup"
              className="font-medium hover:underline hover:text-primary/80 transition-colors text-primary"
            >
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );

}