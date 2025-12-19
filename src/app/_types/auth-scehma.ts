import { z } from 'zod'

export const authSchema = z.object({
  userName: z
    .string()
    .min(1, 'User name is required')
    .max(50, 'User name must be at most 50 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number'),
})

export type TAuthSchema = z.infer<typeof authSchema>
export const authSchemaDefaultValues: TAuthSchema = {
  userName: '',
  email: '',
  phoneNumber: '',
}
