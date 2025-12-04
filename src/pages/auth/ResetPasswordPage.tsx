import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { resetPassword } from "@/api/auth";
import { VerificationError, ValidationError } from "@/api/errors";
import { resetPasswordSchema, type ResetPasswordFormData } from '@/api/auth';

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string>("");

  const urlToken = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token") ?? "";
  }, [location.search]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: urlToken,
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (!urlToken) return;
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("token");
    window.history.replaceState({}, "", currentUrl.toString());
  }, [urlToken]);

  const mutation = useMutation({
    mutationFn: async (values: ResetPasswordFormData) => {
      return resetPassword(values);
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      setFormError("");
      if (error instanceof ValidationError) {
        addErrors(form, error.field_errors);
      } 
      else if (error instanceof VerificationError) {
        setFormError(error.message || "Invalid or expired reset link.");
      } 
      else {
        setFormError("Something went wrong. Please try again later.");
      }
    },
  });

  async function onSubmit(values: ResetPasswordFormData) {
    setFormError("");
    await mutation.mutateAsync(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full border-0 shadow-none max-w-sm bg-background">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Reset password</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              {/* hidden token field */}
              <FormField
                name="token"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel className="text-sm">Token</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} readOnly hidden />
                    </FormControl>
                    <FormErrors error={form.formState.errors.token} />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.password} />
                  </FormItem>
                )}
              />

              <FormField
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.confirm_password} />
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
                {mutation.isPending ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}

