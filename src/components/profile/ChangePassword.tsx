import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormErrors, addErrors } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { changePassword } from "@/api/profile";
import { useMutation } from "@tanstack/react-query";
import { ValidationError, AuthenticationError } from "@/api/errors";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/types/api/profile.ts';

export default function ChangePassword() {
  const [formError, setFormError] = useState<string>("");

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { old_password: "", new_password: "", confirm_new_password: "" },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (values: ChangePasswordFormData) => {
      return changePassword(values);
    },
    onSuccess: async () => {
      toast.success("Password updated");
      form.reset();
      setFormError("");
    },
    onError: (error) => {
      setFormError("");
      
      if (error instanceof ValidationError) {
        const fieldErrors = error.field_errors;
        addErrors(form, fieldErrors);
      } 
      else if (error instanceof AuthenticationError) {
        setFormError("Invalid current password.");
      } 
      else {
        setFormError("Something went wrong. Please try again later.");
      }
    },
  });

  async function onSubmit(values: ChangePasswordFormData) {
    setFormError("");
    await changePasswordMutation.mutateAsync(values);
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.old_password} />
                  </FormItem>
                )}
              />
              <FormField
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.new_password} />
                  </FormItem>
                )}
              />
              <FormField
                name="confirm_new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.confirm_new_password} />
                  </FormItem>
                )}
              />

              {/* General error message */}
              {formError && (
                <p className="text-destructive text-sm">
                  {formError}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? "Updating..." : "Change Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

    </div>
  );
}


