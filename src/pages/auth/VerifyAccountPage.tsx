"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { Form, FormControl, FormErrors, FormField, FormItem, addErrors } from "@/components/ui/form"
import { resendVerification, verifyAccount } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"
import { useLogout } from "@/context/auth/use-logout"
import { RateLimitError, ValidationError, VerificationError } from "@/api/errors"
import { ACCOUNT_OTP_LENGTH, ACCOUNT_OTP_RESEND_COOLDOWN } from "@/constants/api/auth"
import { useUser } from "@/context/auth/use-user"

const otpSchema = z.object({
  otp: z
    .string()
    .min(ACCOUNT_OTP_LENGTH, `Enter the ${ACCOUNT_OTP_LENGTH}-digit code`)
    .max(ACCOUNT_OTP_LENGTH, `Enter the ${ACCOUNT_OTP_LENGTH}-digit code`)
    .regex(new RegExp(`^\\d{${ACCOUNT_OTP_LENGTH}}$`), `OTP must be ${ACCOUNT_OTP_LENGTH} digits`),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerifyAccountPage() {
  const [formError, setFormError] = useState<string>("");
  const {refetchUser} = useUser();
  const [searchParams] = useSearchParams();
  const isJustSent = searchParams.get("justSent")?.toLowerCase() === "true";
  const [resendCooldown, setResendCooldown] = useState<number>(isJustSent ? ACCOUNT_OTP_RESEND_COOLDOWN : 0);

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    let timer: number | undefined;
    if (resendCooldown > 0) {
      timer = window.setInterval(() => {
        setResendCooldown((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [resendCooldown]);

  function formatCooldown(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = String(minutes);
    const ss = String(seconds).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  const verifyMutation = useMutation({
    mutationFn: async (values: OtpFormData) => verifyAccount(values.otp),
    onSuccess: async () => {
      await refetchUser();
    },
    onError: (error) => {
      setFormError("");
      if (error instanceof ValidationError) {
        const fieldErrors = error.field_errors;
        addErrors(form, fieldErrors);
      } 
      else if (error instanceof VerificationError) {
        setFormError(error.message);
      } 
      else {
        setFormError("Something went wrong. Please try again later.");
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => resendVerification(),
    onSuccess: () => {
      setResendCooldown(ACCOUNT_OTP_RESEND_COOLDOWN);
    },
    onError: (error) => {
      setFormError("");
      if (error instanceof RateLimitError || error instanceof VerificationError) {
        setFormError(error.message);
      } 
      else {
        setFormError("Unable to resend code. Please try again later.");
      }
    },
  });

  const logoutMutation = useLogout();

  async function onSubmit(values: OtpFormData) {
    setFormError("");
    await verifyMutation.mutateAsync(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full border-0 shadow-none max-w-sm bg-background">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-2xl">Verify your account</CardTitle>
          <p className="text-center text-sm text-muted-foreground">Enter the {ACCOUNT_OTP_LENGTH}-digit code sent to your email</p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <FormField
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel className="text-sm">Enter the 6-digit code</FormLabel> */}
                    <FormControl>
                      <InputOTP
                        maxLength={ACCOUNT_OTP_LENGTH}
                        value={field.value}
                        onChange={(val) => field.onChange(val.replace(/\D/g, ""))}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        containerClassName="justify-center"
                        className="mt-1"
                      >
                        {(() => {
                          const half = Math.floor(ACCOUNT_OTP_LENGTH / 2);
                          return (
                            <>
                              <InputOTPGroup className="">
                                {Array.from({ length: half }).map((_, i) => (
                                  <InputOTPSlot className="h-12 w-10 text-lg" index={i} key={`slot-a-${i}`} />
                                ))}
                              </InputOTPGroup>
                              <InputOTPSeparator className="mx-2 text-muted-foreground" />
                              <InputOTPGroup className="">
                                {Array.from({ length: ACCOUNT_OTP_LENGTH - half }).map((_, i) => {
                                  const index = half + i;
                                  return (
                                    <InputOTPSlot className="h-12 w-10 text-lg" index={index} key={`slot-b-${index}`} />
                                  );
                                })}
                              </InputOTPGroup>
                            </>
                          );
                        })()}
                      </InputOTP>
                    </FormControl>
                    <FormErrors error={form.formState.errors.otp} className="text-center" />
                  </FormItem>
                )}
              />

              {formError && (
                <p className="text-destructive text-sm mt-1 text-center">{formError}</p>
              )}

              <Button
                type="submit"
                className="w-full text-md py-5 cursor-pointer mt-4"
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-md py-5 cursor-pointer mt-1"
                onClick={() => resendMutation.mutate()}
                disabled={resendMutation.isPending || resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `Resend in ${formatCooldown(resendCooldown)}`
                  : resendMutation.isPending
                    ? "Sending code..."
                    : "Resend code"}
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-full text-md py-2 cursor-pointer mt-2"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  )
}


