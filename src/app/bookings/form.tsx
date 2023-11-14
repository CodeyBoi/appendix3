'use client';

import { SubmitHandler, useForm } from 'react-hook-form';

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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor='title'>Titel</label>
      <input
        id='title'
        type='text'
        {...register('title', { required: true })}
      />
      {errors.title && <span className='text-red-600'>Fyll i titel</span>}

      <label htmlFor='description'>Beskrivning</label>
      <textarea id='description' {...register('description')} />

      <label htmlFor='start'>Start</label>
      <input
        id='start'
        type='datetime-local'
        {...register('start', { required: true, valueAsDate: true })}
      />
      {errors.start && <span className='text-red-600'>Fyll i start</span>}

      <label htmlFor='end'>Slut</label>
      <input
        id='end'
        type='datetime-local'
        {...register('end', { required: true, valueAsDate: true })}
      />
      {errors.end && <span className='text-red-600'>Fyll i slut</span>}

      <button type='submit'>Spara</button>
    </form>
  );
};

export default BookingForm;
