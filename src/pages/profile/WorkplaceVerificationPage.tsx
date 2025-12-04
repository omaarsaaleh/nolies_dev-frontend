import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getVerificationAttempts, getWorkplaceVerifications } from "@/api/verifications";
import Pagination from "@/components/common/Pagination";
import type { PaginatedResponse } from "@/types/api/common";
import type { WorkplaceVerificationAttempt, WorkplaceVerification } from "@/types/api/verifications";
import { CreateVerificationAttemptDialog } from "@/components/profile/workplace-verification/CreateVerificationAttemptDialog";
import { VerifyAttemptDialog } from "@/components/profile/workplace-verification/VerifyAttemptDialog";
import { StatusHandler } from "@/components/profile/workplace-verification/StatusHandler";
import { VerificationItem } from "@/components/profile/workplace-verification/VerificationItem";
import { AttemptItem } from "@/components/profile/workplace-verification/AttemptItem";
import { commonQueryOptions } from "@/utils/query";

const PAGE_SIZE = 10;
const TABS = {
  VERIFICATIONS: "verifications",
  ATTEMPTS: "attempts"
}


export default function WorkplaceVerificationPage() {
  const [activeTab, setActiveTab] = useState(TABS.VERIFICATIONS);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<WorkplaceVerificationAttempt | null>(null);
  const [attemptPage, setAttemptPage] = useState(1);
  const [verificationPage, setVerificationPage] = useState(1);
  const qc = useQueryClient();

  const verificationsQuery = useQuery<PaginatedResponse<WorkplaceVerification>>({
    ...commonQueryOptions,
    queryKey: ["workplace-verifications", { page: verificationPage, page_size: PAGE_SIZE }],
    queryFn: async () => {
      return await getWorkplaceVerifications({ page: verificationPage, page_size: PAGE_SIZE });
    },
    enabled: activeTab === TABS.VERIFICATIONS,
  });

  const attemptsQuery = useQuery<PaginatedResponse<WorkplaceVerificationAttempt>>({
    ...commonQueryOptions,
    queryKey: ["workplace-verifications", "attempts", { page: attemptPage, page_size: PAGE_SIZE }],
    queryFn: async () => {
      return await getVerificationAttempts({ page: attemptPage, page_size: PAGE_SIZE });
    },
    enabled: activeTab === TABS.ATTEMPTS,

  });

  const verificationTotalPages = Math.ceil((verificationsQuery.data?.count || 0) / PAGE_SIZE);
  const attemptTotalPages = Math.ceil((attemptsQuery.data?.count || 0) / PAGE_SIZE);

  const openOtpDialog = (attempt: WorkplaceVerificationAttempt) => {
    setSelectedAttempt(attempt);
    setOtpDialogOpen(true);
  };

  const handleVerificationSuccess = () => {
    qc.invalidateQueries({ queryKey: ["workplace-verifications"] });
    qc.invalidateQueries({ queryKey: ["workplace-verifications", "attempts"] });
  };
  const handleVerificationAttemptCreation = () => {
    qc.invalidateQueries({ queryKey: ["workplace-verifications", "attempts"] });
  };

  return (
    <div className="flex-1 flex justify-center">
      <Card className="border-0 shadow-none bg-background w-full pt-0">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Workplace verification</CardTitle>
            <CardDescription>
              Manage your workplace verification attempts and confirm ownership of company email domains.
            </CardDescription>
          </div>
          {/* Create Verification Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="md: self-end">Create verification</Button>
            </DialogTrigger>
            <CreateVerificationAttemptDialog
              onClose={() => setCreateDialogOpen(false)}
              onSucess={handleVerificationAttemptCreation}
            />
          </Dialog>
        </CardHeader>
        <CardContent>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value={TABS.VERIFICATIONS}>Verifications</TabsTrigger>
              <TabsTrigger value={TABS.ATTEMPTS}>Attempts</TabsTrigger>
            </TabsList>
            {/* Verifications */}
            <TabsContent value={TABS.VERIFICATIONS} className="pt-4 space-y-4">
              <StatusHandler
                isLoading={verificationsQuery.isLoading}
                isError={verificationsQuery.isError}
                errorMessage={"Couldn't fetch the data, please try again later."}
                isEmpty={!verificationsQuery.data?.results?.length}
                emptyMessage="No verifications yet."
              />
              {verificationsQuery.data?.results?.map((verification: WorkplaceVerification, index: number) => (
                <VerificationItem 
                  key={verification.id} 
                  verification={verification} 
                  className={index != 0 ? "border-t-1" : ""}
                />
              ))}
              {verificationsQuery.data?.results?.length ? (
                <Pagination
                  totalPages={verificationTotalPages}
                  currentPage={verificationPage}
                  setCurrentPage={setVerificationPage}
                />
              ) : null}
            </TabsContent>
            {/* Attempts */}
            <TabsContent value={TABS.ATTEMPTS} className="pt-4 space-y-4">
              <StatusHandler
                isLoading={attemptsQuery.isLoading}
                isError={attemptsQuery.isError}
                errorMessage={"Couldn't fetch the data, please try again later."}
                isEmpty={!attemptsQuery.data?.results?.length}
                emptyMessage="No pending/failed verification attempts."
              />
              {attemptsQuery.data?.results?.map((attempt: WorkplaceVerificationAttempt, index: number) => (
                <AttemptItem
                  key={attempt.id}
                  attempt={attempt}
                  onVerify={() => openOtpDialog(attempt)}
                  className={index != 0 ? "border-t-1" : ""}
                />
              ))}
              {attemptsQuery.data?.results?.length ? (
                <Pagination totalPages={attemptTotalPages} currentPage={attemptPage} setCurrentPage={setAttemptPage} />
              ) : null}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Verify Attempt Dialog */}
      <VerifyAttemptDialog
        open={otpDialogOpen}
        onOpenChange={setOtpDialogOpen}
        attempt={selectedAttempt}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
}
