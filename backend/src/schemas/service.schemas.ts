import { z } from 'zod';

export const serviceSchema = z.object({
  name: z.string({ message: 'Name is required' }),
  description: z.string({ message: 'Description is required' }),
  price: z.number({ message: 'Price required' }),
  additionalFee: z
    .object({
      type: z.string().optional(),
      description: z.string().optional(),
      amount: z.number().optional(),
    })
    .optional(),
});

export const cabinSchema = serviceSchema
  .extend({
    minCapacity: z.number().int(),
    maxCapacity: z.number().int(),
  })
  .refine((data) => data.minCapacity < data.maxCapacity, {
    message: 'Min capacity should be less than Max capacity',
    path: ['minCapacity'],
  });
