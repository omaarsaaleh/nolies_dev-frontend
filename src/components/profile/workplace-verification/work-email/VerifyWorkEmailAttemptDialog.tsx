import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormErrors, FormField, FormItem, addErrors } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { WORK_EMAIL_OTP_LENGTH, WORK_EMAIL_OTP_RESEND_COOLDOWN } from "@/constants/api/profile";
import { attemptWorkEmailVerification, verifyWorkEmail } from "@/api/verifications";
import { RateLimitError, ValidationError, VerificationError } from "@/api/errors";
import type { WorkplaceVerificationAttempt } from "@/types/api/verifications";

/**

### /workplace-verifications/email/attempt/

- POST
    
  resend attempt
  {
      "work_email" : "omar@paymob.com",
      "company" : "paymob"
  }

 */

const otpSchema = z.object({
  otp: z
    .string()
    .min(WORK_EMAIL_OTP_LENGTH, `Enter the ${WORK_EMAIL_OTP_LENGTH}-digit code`)
    .max(WORK_EMAIL_OTP_LENGTH, `Enter the ${WORK_EMAIL_OTP_LENGTH}-digit code`)
    .regex(new RegExp(`^\\d{${WORK_EMAIL_OTP_LENGTH}}$`), `OTP must be ${WORK_EMAIL_OTP_LENGTH} digits`),
});

type OtpFormData = z.infer<typeof otpSchema>;

type VerifyWorkEmailAttemptDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  attempt: WorkplaceVerificationAttempt | null;
};

export function VerifyWorkEmailAttemptDialog({ attempt, onSuccess, onOpenChange, open }: VerifyWorkEmailAttemptDialog) {
  const [formError, setFormError] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ otp: "" });
      setFormError("");
      setResendCooldown(0);
    }
  }, [open, form]);

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
    mutationFn: async (values: OtpFormData) => {
      if (!attempt || attempt.type !== "WORK_EMAIL") return;
      return verifyWorkEmail({
        work_email: attempt.attempt.work_email,
        otp: values.otp,
      });
    },
    onSuccess: () => {
      toast.success("Verification confirmed");
      onSuccess();
      onOpenChange(false);
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
    mutationFn: async () => {
      if (!attempt || attempt.type !== "WORK_EMAIL") return;
      return attemptWorkEmailVerification({
        work_email: attempt.attempt.work_email,
        company: attempt.company.slug,
      });
    },
    onSuccess: () => {
      setResendCooldown(WORK_EMAIL_OTP_RESEND_COOLDOWN);
      toast.success("Verification code sent");
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

  async function onSubmit(values: OtpFormData) {
    setFormError("");
    await verifyMutation.mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter verification code</DialogTitle>
          <DialogDescription>
            {attempt?.attempt.work_email
              ? `Enter the code sent to ${attempt.attempt.work_email}`
              : "Enter the code you received by email."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={WORK_EMAIL_OTP_LENGTH}
                      value={field.value}
                      onChange={(val) => field.onChange(val.replace(/\D/g, ""))}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      containerClassName="justify-center"
                      className="mt-1"
                    >
                      {(() => {
                        const half = Math.floor(WORK_EMAIL_OTP_LENGTH / 2);
                        return (
                          <>
                            <InputOTPGroup className="">
                              {Array.from({ length: half }).map((_, i) => (
                                <InputOTPSlot className="h-12 w-10 text-lg" index={i} key={`slot-a-${i}`} />
                              ))}
                            </InputOTPGroup>
                            <InputOTPSeparator className="mx-2 text-muted-foreground" />
                            <InputOTPGroup className="">
                              {Array.from({ length: WORK_EMAIL_OTP_LENGTH - half }).map((_, i) => {
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}