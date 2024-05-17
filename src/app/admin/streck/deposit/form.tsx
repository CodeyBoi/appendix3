"use client"

import Button from "components/input/button";
import NumberInput from "components/input/number-input";
import SelectCorps from "components/select-corps";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { api } from "trpc/react"

type FormValues = {
  id: string;
  amount: number;
};

const AdminStreckDepositForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
  }  = useForm<FormValues>();
  
  const mutation = api.streck.addTransactions.useMutation({
    onSuccess: () => {
      router.refresh();
      router.replace("/admin/streck")
    }
  })

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      transactions: [
      {
      item: 'Insättning',
      pricePer: values.amount,
      amount: 1,
      corpsId: values.id,
      },
      
    ]
    })
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="flex flex-col gap-2">
      <SelectCorps />
      <NumberInput />
      <Button type="submit">
        Spara
      </Button>
    </div>
  </form>
  )
}

export default AdminStreckDepositForm
