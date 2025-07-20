import { FieldValues, useForm as reactUseForm, RegisterOptions, UseFormProps } from 'react-hook-form';

export const useForm = (props?: UseFormProps) => {
  const form = reactUseForm(props);
  const register = (name: keyof FieldValues, options?: RegisterOptions) => ({
    ...form.register(name, options),
    error: form.formState.errors[name]?.message?.toString(),
  });
  return {
    ...form,
    register,
  }
}
