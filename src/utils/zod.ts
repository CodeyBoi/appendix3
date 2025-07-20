import z from "zod";

export const stringToNullableNumber = (pipe: any) => z.string().transform((val) => val === '' ? null : val).nullable().refine((val) => val === null || !isNaN(Number(val)), 'Ogiltigt nummer 23123').transform((val) => val === null ? null : Number(val)).pipe(pipe)
