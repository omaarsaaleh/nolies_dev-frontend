import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "@/api/auth";
import {
  forgetPasswordSchema,
  type ForgetPasswordFormData,
} from "@/types/api/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormErrors,
  addErrors,
} from "@/components/ui/form";
import { ValidationError } from "@/api/errors";
import { formatTime } from "@/utils/format";
import { FORGET_PASSWORD_CONSTANTS } from "@/constants/api/auth";

export default function ForgetPassword() {
  const [formError, setFormError] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const form = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      username_or_email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ForgetPasswordFormData) => {
      return requestPasswordReset(values);
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      setFormError("");
      if (error instanceof ValidationError) {
        addErrors(form, error.field_errors);
      } 
      else {
        setFormError("Something went wrong. Please try again later.");
      }
    },
  });

  async function onSubmit(values: ForgetPasswordFormData) {
    setFormError("");
    await mutation.mutateAsync(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full border-0 shadow-none max-w-sm bg-background">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Forget password</CardTitle>
          {!submitted ? (
              <CardDescription className="text-center">
                Enter your username or email. We'll send reset instructions.
              </CardDescription>
            ) : null
          }
          
        </CardHeader>
        <CardContent>
          {submitted ? (
            <>
              <div className="text-sm text-center text-muted-foreground">
                <p className="mb-3">If an account with that username or email exists, you'll receive an email with reset instructions shortly.</p>
                <div className="text-left rounded-md bg-muted/40 p-3">
                  <p className="font-medium text-foreground mb-2">Notes</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      You can request only {FORGET_PASSWORD_CONSTANTS.FORGET_PASSWORD_LIMIT_PER_WINDOW} password resets every {formatTime(FORGET_PASSWORD_CONSTANTS.FORGET_PASSWORD_LIMIT_WINDOW)}.
                    </li>
                    <li>
                      You can change your password {FORGET_PASSWORD_CONSTANTS.RESET_PASSWORD_LIMIT_PER_WINDOW} {FORGET_PASSWORD_CONSTANTS.RESET_PASSWORD_LIMIT_PER_WINDOW == 1? "time" : "times"} every {formatTime(FORGET_PASSWORD_CONSTANTS.RESET_PASSWORD_LIMIT_WINDOW)}.
                    </li>
                  </ul>
                </div>
              </div>
            </>
            
            
          ) : (
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
                          inputMode="email"
                          autoComplete="username email"
                          className="text-md"
                        />
                      </FormControl>
                      <FormErrors error={form.formState.errors.username_or_email} />
                    </FormItem>
                  )}
                />

                {formError && (
                  <p className="text-destructive text-sm">{formError}</p>
                )}

                <Button
                  type="submit"
                  className="w-full text-md py-5 cursor-pointer"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}
