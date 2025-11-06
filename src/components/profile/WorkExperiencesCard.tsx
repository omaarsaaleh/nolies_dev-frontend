import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import WorkExperienceForm from "@/components/profile/WorkExperienceForm";
import type { WorkExperienceFormValues } from "@/components/profile/WorkExperienceForm";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkExperience, deleteWorkExperience, getWorkExperiences, updateWorkExperience } from "@/api/profile";

export default function WorkExperiencesCard() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["work-experiences"], queryFn: () => getWorkExperiences() });
  const createMx = useMutation({ mutationFn: createWorkExperience, onSuccess: () => qc.invalidateQueries({ queryKey: ["work-experiences"] }) });
  const updateMx = useMutation({ mutationFn: ({ id, data }: { id: number; data: any }) => updateWorkExperience(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["work-experiences"] }) });
  const deleteMx = useMutation({ mutationFn: (id: number) => deleteWorkExperience(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["work-experiences"] }) });

  const experiences: any[] = data?.results ?? [];

  const initialValues: WorkExperienceFormValues | undefined = useMemo(() => {
    if (!editing) return undefined;
    return {
      company: editing.company?.slug ?? "",
      roles: (editing.roles ?? []).map((r: any) => ({
        id: r.id,
        job_role: r.job_role?.id,
        start_date: r.start_date,
        end_date: r.end_date,
        present: r.end_date == null,
      })),
      verification: editing.verification?.id,
    } as WorkExperienceFormValues;
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
      verification: values.verification,
    };
    await createMx.mutateAsync(payload as any);
    toast.success("Experience added");
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
      verification: values.verification,
    };
    await updateMx.mutateAsync({ id: editing.id, data: payload as any });
    toast.success("Experience updated");
  };

  const handleDelete = async (id: number) => {
    await deleteMx.mutateAsync(id);
    toast.success("Experience deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Manage your work history</div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setOpen(true); }}>Add experience</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Work Experience" : "Add Work Experience"}</DialogTitle>
            </DialogHeader>
            <WorkExperienceForm
              defaultValues={initialValues}
              onSuccess={() => setOpen(false)}
              onSubmit={editing ? handleUpdate : handleCreate}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="rounded border p-4 text-sm text-muted-foreground">Loading...</div>
      ) : experiences.length === 0 ? (
        <div className="rounded border p-4 text-sm text-muted-foreground">No experiences yet.</div>
      ) : (
        <ul className="space-y-3">
          {experiences.map((exp: any) => (
            <li key={exp.id} className="rounded border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{exp.company?.name}</div>
                  <div className="text-xs text-muted-foreground">{exp.company?.slug}</div>
                </div>
                <div className="flex items-center gap-2">
                  {exp.is_verified ? <Badge variant="secondary">Verified</Badge> : null}
                  <Button size="sm" variant="outline" onClick={() => { setEditing(exp); setOpen(true); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(exp.id)}>Delete</Button>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-sm">
                {(exp.roles ?? []).map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between">
                    <div>{r.job_role?.job_title?.name} • {r.job_role?.seniority_level}</div>
                    <div className="text-muted-foreground">
                      {r.start_date} – {r.end_date ?? "Present"}
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


