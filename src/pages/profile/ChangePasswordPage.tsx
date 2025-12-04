import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormErrors, addErrors } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { 
  changePassword,   
  changePasswordSchema,
  type ChangePasswordFormData 
} from "@/api/account";
import { useMutation } from "@tanstack/react-query";
import { ValidationError } from "@/api/errors";
import { useLogout } from "@/context/auth/use-logout";

export default function ChangePasswordPage() {
  const [formError, setFormError] = useState<string>("");
  const logout = useLogout(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { old_password: "", new_password: "", confirm_new_password: "" },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (values: ChangePasswordFormData) => {
      return changePassword(values);
    },
    onSuccess: async () => {
      toast.success("Password updated successfully!");
      form.reset();
      setFormError("");
      logout.mutate();
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

  async function onSubmit(values: ChangePasswordFormData) {
    setFormError("");
    await changePasswordMutation.mutateAsync(values);
  }

  return (
    <div className="flex-1 flex justify-center">
      <Card className="border-0 shadow-none bg-background pt-10 md:pt-20">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="w-80 md:w-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="old_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-md">Current password</FormLabel>
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
                    <FormLabel className=" text-md">New password</FormLabel>
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
                    <FormLabel className=" text-md">Confirm new password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormErrors error={form.formState.errors.confirm_new_password} />
                  </FormItem>
                )}
              />

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