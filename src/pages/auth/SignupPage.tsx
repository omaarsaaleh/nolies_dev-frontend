"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormErrors,
  addErrors
} from "@/components/ui/form"
import {registerSchema, type RegisterFormData} from '@/api/auth';

import {register} from "@/api/auth.ts";
import {ValidationError} from "@/api/errors";
import { useMutation } from "@tanstack/react-query"
import { useUser } from "@/context/auth/use-user";


export default function SignupPage() {
  const [formError, setFormError] = useState<string>("");
  const {refetchUser} = useUser();
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormData) => {
      return register(values);
    },
    onSuccess: async () => {
      await refetchUser();
    },
    onError: (error) => {
      setFormError("");
      
      if (error instanceof ValidationError) {
        const fieldErrors = error.field_errors;
        addErrors(form, fieldErrors);
      } 
      else {
        setFormError("Something went wrong. Please try again later.");
      }
    },
  });

  async function onSubmit(values: RegisterFormData) {
    setFormError("");
    await registerMutation.mutateAsync(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full border-0 shadow-none max-w-sm bg-background">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              {/* First + Last name */}
              <div className="flex gap-4">
                <FormField
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm">First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormErrors error={form.formState.errors.first_name}/>
                    </FormItem>
                  )}
                />
                <FormField
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-sm">Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormErrors error={form.formState.errors.last_name}/>
                    </FormItem>
                  )}
                />
              </div>

              {/* Username */}
              <FormField
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.username}/>
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.email}/>
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.password}/>
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.confirm_password}/>
                  </FormItem>
                )}
              />

              {/* Form error message */}
              {formError && (
                <p className="text-destructive text-sm">
                  {formError}
                </p>
              )}

              {/* Submit */}
              <Button 
                type="submit" 
                className="w-full text-md py-5 cursor-pointer mt-3"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating account..." : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <p>Already have an account?</p>
            <Link
              to="/login"
              className="font-medium hover:underline hover:text-primary/80 transition-colors text-primary"
            >
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
