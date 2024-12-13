'use client';

import { Children, ReactElement, ReactNode, createElement } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

type FormProps = {
  defaultValues: any;
  className?: string;
  children: ReactNode;
  onSubmit: SubmitHandler<any>;
}

const hasProps = (child: ReactNode): child is ReactElement => typeof child !== 'string';

const Form = ({ defaultValues, children, onSubmit, className }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof defaultValues>({ defaultValues });

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      {Children.map(children, (child) => {
        if (!hasProps(child)) {
          return null;
        }
        return child.props.name ? createElement(child.type, {
          ...{
            ...child.props,
            register,
            error: errors[child.props.name],
            key: child.props.name,
          }
        }) : child;
      })}
    </form>
  )
}

export default Form;
