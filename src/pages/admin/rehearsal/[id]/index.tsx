import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../../../utils/trpc";

const defaultValues = {
  title: "",
  date: null as unknown as Date,
  corpsIds: [] as string[],
};
type FormValues = typeof defaultValues;

const AdminRehearsal = () => {
  const router = useRouter();
  const rehearsalId = router.query.id as string;
  const newRehearsal = rehearsalId === "new";
  const utils = trpc.useContext();
  
  const { data: rehearsal } = trpc.rehearsal.getWithId.useQuery(rehearsalId,
    { enabled: !newRehearsal && !!rehearsalId });

  const form = useForm<FormValues>({
    initialValues: rehearsal && !newRehearsal ? {
      title: rehearsal.title,
      date: rehearsal.date,
      corpsIds: rehearsal.corpsIds,
    } : defaultValues,
    validate: {
      title: (title) => (title ? null : "Fyll i titel"),
      date: (date) => (date ? null : "Välj datum"),
    },
  });

  const create = trpc.rehearsal.upsert.useMutation({
    onSuccess: () => {
      utils.rehearsal.getWithId.invalidate(rehearsalId);
      router.push("/admin/rehearsal");
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (newRehearsal) {
      await create.mutateAsync(values);
    } else {
      await create.mutateAsync({ ...values, id: rehearsalId });
    }
  };

  return (
    <div>

    </div>
  );
};

export default AdminRehearsal;
