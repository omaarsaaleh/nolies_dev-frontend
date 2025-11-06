import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attemptWorkEmailVerification, getVerificationAttempts, getWorkplaceVerifications, verifyWorkEmail } from "@/api/profile";

const attemptSchema = z.object({
  work_email: z.string().email(),
  company: z.string().min(1), // slug
});

const verifySchema = z.object({
  work_email: z.string().email(),
  otp: z.string().min(1),
});

type AttemptValues = z.infer<typeof attemptSchema>;
type VerifyValues = z.infer<typeof verifySchema>;

export default function WorkplaceVerificationCard() {
  const qc = useQueryClient();
  const attemptForm = useForm<AttemptValues>({
    resolver: zodResolver(attemptSchema),
    defaultValues: { work_email: "", company: "" },
  });
  const verifyForm = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { work_email: "", otp: "" },
  });

  const attempts = useQuery({ queryKey: ["workplace-verifications", "attempts"], queryFn: () => getVerificationAttempts() });
  const verifications = useQuery({ queryKey: ["workplace-verifications"], queryFn: () => getWorkplaceVerifications() });

  const attemptMx = useMutation({
    mutationFn: attemptWorkEmailVerification,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workplace-verifications", "attempts"] }),
  });
  const verifyMx = useMutation({
    mutationFn: verifyWorkEmail,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workplace-verifications"] }),
  });

  const onAttempt = async (values: AttemptValues) => {
    try {
      await attemptMx.mutateAsync(values);
      toast.success("Verification email sent");
      attemptForm.reset();
    } catch (e: any) {
      toast.error("Failed to send", { description: e?.message || "" });
    }
  };
  const onVerify = async (values: VerifyValues) => {
    try {
      await verifyMx.mutateAsync(values);
      toast.success("Verified successfully");
      verifyForm.reset();
    } catch (e: any) {
      toast.error("Failed to verify", { description: e?.message || "" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workplace Verification</CardTitle>
        <CardDescription>Verify via work email.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="attempt">
          <TabsList>
            <TabsTrigger value="attempt">Attempt</TabsTrigger>
            <TabsTrigger value="verify">Verify</TabsTrigger>
          </TabsList>
          <TabsContent value="attempt" className="pt-4">
            <Form {...attemptForm}>
              <form onSubmit={attemptForm.handleSubmit(onAttempt)} className="space-y-4">
                <FormField
                  control={attemptForm.control}
                  name="work_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={attemptForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company slug</FormLabel>
                      <FormControl>
                        <Input placeholder="company-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={attemptMx.isPending}>
                  {attemptMx.isPending ? "Sending..." : "Send verification email"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="verify" className="pt-4">
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-4">
                <FormField
                  control={verifyForm.control}
                  name="work_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={verifyForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={verifyMx.isPending}>
                  {verifyMx.isPending ? "Verifying..." : "Verify"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        <div className="mt-6 grid gap-4">
          <div>
            <div className="font-medium mb-2">Attempts</div>
            {attempts.isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : attempts.data?.results?.length ? (
              <ul className="space-y-2">
                {attempts.data.results.map((a: any) => (
                  <li key={a.id} className="rounded border p-2 text-sm">
                    <div>{a.attempt?.work_email}</div>
                    <div className="text-muted-foreground">{a.company?.name}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No attempts</div>
            )}
          </div>
          <div>
            <div className="font-medium mb-2">Verifications</div>
            {verifications.isLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : verifications.data?.results?.length ? (
              <ul className="space-y-2">
                {verifications.data.results.map((v: any) => (
                  <li key={v.id} className="rounded border p-2 text-sm">
                    <div>{v.verification?.work_email}</div>
                    <div className="text-muted-foreground">{v.company?.name}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">No verifications</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


