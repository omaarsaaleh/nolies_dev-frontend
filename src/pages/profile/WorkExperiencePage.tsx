import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import WorkExperienceForm from "@/components/profile/work-experience/WorkExperienceForm";
import type { WorkExperienceFormValues } from "@/components/profile/work-experience/WorkExperienceForm";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkExperience, deleteWorkExperience, getWorkExperiences, updateWorkExperience } from "@/api/experiences";
import type { WorkExperience } from "@/types/api/experiences";
import { CompanyAvatar } from "@/components/companies/CompanyAvatar";
import { Separator } from "@/components/ui/separator";
import { Trash2, Edit, Building2 } from "lucide-react";

export default function WorkExperiencePage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WorkExperience | null>(null);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ 
    queryKey: ["work-experiences"], 
    queryFn: () => getWorkExperiences() 
  });
  
  const createMx = useMutation({ 
    mutationFn: createWorkExperience, 
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["work-experiences"] });
      toast.success("Work experience added successfully");
    },
    onError: () => {
      toast.error("Failed to add work experience");
    }
  });
  
  const updateMx = useMutation({ 
    mutationFn: ({ id, data }: { id: number; data: WorkExperienceFormValues }) => 
      updateWorkExperience(id, data), 
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["work-experiences"] });
      toast.success("Work experience updated successfully");
    },
    onError: () => {
      toast.error("Failed to update work experience");
    }
  });
  
  const deleteMx = useMutation({ 
    mutationFn: (id: number) => deleteWorkExperience(id), 
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["work-experiences"] });
      toast.success("Work experience deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete work experience");
    }
  });

  // Group experiences by company
  const groupedExperiences = useMemo(() => {
    const experiences: WorkExperience[] = data?.results ?? [];
    const grouped = new Map<string, WorkExperience>();
    experiences.forEach((exp) => {
      grouped.set(exp.company.slug, exp);
    });
    return Array.from(grouped.values());
  }, [data?.results]);

  const initialValues: WorkExperienceFormValues | undefined = useMemo(() => {
    if (!editing) return undefined;
    return {
      company: editing.company.slug,
      roles: editing.roles.map((r) => ({
        id: r.id,
        job_role: r.job_role.id,
        start_date: r.start_date,
        end_date: r.end_date,
        present: r.end_date === null,
      })),
      verification: editing.verification?.id,
    };
  }, [editing]);

  const handleCreate = async (values: WorkExperienceFormValues) => {
    const payload = {
      company: values.company,
      roles: values.roles.map((r) => ({
        id: r.id,
        job_role: Number(r.job_role),
        start_date: r.start_date,
        end_date: r.present ? null : r.end_date ?? null,
      })),
      verification: values.verification ?? null,
    };
    await createMx.mutateAsync(payload);
  };

  const handleUpdate = async (values: WorkExperienceFormValues) => {
    if (!editing) return;
    const payload = {
      company: values.company,
      roles: values.roles.map((r) => ({
        id: r.id,
        job_role: Number(r.job_role),
        start_date: r.start_date,
        end_date: r.present ? null : r.end_date ?? null,
      })),
      verification: values.verification ?? null,
    };
    await updateMx.mutateAsync({ id: editing.id, data: payload });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this work experience?")) {
      await deleteMx.mutateAsync(id);
    }
  };

  const handleOpenDialog = (exp: WorkExperience | null) => {
    setEditing(exp);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Work Experience
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your work history and roles
            </p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { 
            if (!v) handleCloseDialog(); 
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog(null)}>
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Work Experience" : "Add Work Experience"}
                </DialogTitle>
              </DialogHeader>
              <WorkExperienceForm
                defaultValues={initialValues}
                onSuccess={handleCloseDialog}
                onSubmit={editing ? handleUpdate : handleCreate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            Loading work experiences...
          </div>
        ) : groupedExperiences.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            No work experiences yet. Add your first work experience to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {groupedExperiences.map((exp) => (
              <Card key={exp.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <CompanyAvatar company={exp.company} className="h-12 w-12 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{exp.company.name}</h3>
                        <p className="text-xs text-muted-foreground">{exp.company.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {exp.verification && (
                        <Badge variant="secondary" className="gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Verified
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(exp)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(exp.id)}
                        disabled={deleteMx.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {exp.roles.map((role, index) => (
                      <div key={role.id}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">
                              {role.job_role.job_title.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {role.job_role.seniority_level}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground shrink-0">
                            {new Date(role.start_date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                            {" – "}
                            {role.end_date
                              ? new Date(role.end_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Present"}
                          </div>
                        </div>
                        {index < exp.roles.length - 1 && (
                          <Separator className="mt-3" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
}
