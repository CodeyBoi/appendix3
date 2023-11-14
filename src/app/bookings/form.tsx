'use client';

import Button from 'components/input/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { api } from 'trpc/react';

type FormValues = {
  title: string;
  description?: string;
  start: Date;
  end: Date;
};

type Booking = FormValues;

type BookingsFormProps = {
  booking?: Booking;
};

const BookingForm = ({ booking }: BookingsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: booking,
  });

  const mutation = api.booking.upsert.useMutation();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form className='flex flex-col gap-2' onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col'>
        <label htmlFor='title'>Titel</label>
        <input
          className='rounded border border-solid border-gray-300 p-1'
          id='title'
          type='text'
          {...register('title', { required: true })}
        />
        {errors.title && <span className='text-red-600'>Fyll i titel</span>}
      </div>

      <div className='flex flex-col'>
        <label htmlFor='description'>Beskrivning</label>
        <textarea
          className='rounded border border-solid border-gray-300 p-1'
          id='description'
          {...register('description')}
        />
      </div>

      <div className='flex flex-col'>
        <label htmlFor='start'>Start</label>
        <input
          className='rounded border border-solid border-gray-300 p-1'
          id='start'
          type='datetime-local'
          {...register('start', { required: true, valueAsDate: true })}
        />
        {errors.start && <span className='text-red-600'>Fyll i start</span>}
      </div>

      <div className='flex flex-col'>
        <label htmlFor='end'>Slut</label>
        <input
          className='rounded border border-solid border-gray-300 p-1'
          id='end'
          type='datetime-local'
          {...register('end', { required: true, valueAsDate: true })}
        />
        {errors.end && <span className='text-red-600'>Fyll i slut</span>}
      </div>

      <Button type='submit'>Spara</Button>
    </form>
  );
};

export default BookingForm;
