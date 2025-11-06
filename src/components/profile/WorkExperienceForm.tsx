import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Fragment } from "react";
import { validateRolesNoOverlapAndPresent } from "@/components/profile/utils";

const roleSchema = z.object({
  id: z.number().optional(),
  job_role: z.coerce.number(),
  start_date: z.string().min(1),
  end_date: z.string().nullable().optional(),
  present: z.boolean().optional(),
});

const schema = z.object({
  company: z.string().min(1), // slug
  roles: z.array(roleSchema).min(1).max(5),
  verification: z.coerce.number().optional(),
}).superRefine((values, ctx) => {
  const errors = validateRolesNoOverlapAndPresent(values.roles);
  for (const message of errors) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["roles"], message });
  }
});

export type WorkExperienceFormValues = z.infer<typeof schema>;

export default function WorkExperienceForm({ onSuccess, defaultValues, onSubmit: onSubmitProp }: { onSuccess?: () => void; defaultValues?: Partial<WorkExperienceFormValues>; onSubmit?: (values: WorkExperienceFormValues) => Promise<void> | void }) {
  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: "",
      roles: [
        { job_role: 1 as unknown as number, start_date: "", end_date: null, present: true },
      ],
      verification: undefined,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "roles" });

  const onSubmit = async (values: WorkExperienceFormValues) => {
    await onSubmitProp?.(values);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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

        <div className="space-y-3">
          {fields.map((field, index) => (
            <Fragment key={field.id}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                <FormField
                  control={form.control}
                  name={`roles.${index}.job_role` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job role id</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`roles.${index}.start_date` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`roles.${index}.end_date` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={form.watch(`roles.${index}.present`)} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`roles.${index}.present` as const}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                      </FormControl>
                      <FormLabel className="!mt-0">Present</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="ghost" onClick={() => remove(index)}>Remove</Button>
              </div>
            </Fragment>
          ))}
          <Button type="button" variant="secondary" onClick={() => append({ job_role: 1 as unknown as number, start_date: "", end_date: null, present: false })}>Add role</Button>
        </div>

        <FormField
          control={form.control}
          name="verification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification id (optional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Save</Button>
      </form>
    </Form>
  );
}


