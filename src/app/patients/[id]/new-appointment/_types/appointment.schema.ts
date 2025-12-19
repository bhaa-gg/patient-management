import { z } from 'zod'

const BaseSchema = z.object({
  primaryPhysician: z.string().min(2, 'Select at least one doctor'),
  schedule: z.date(),
  note: z.string().optional(),
})

const CreateSchema = BaseSchema.extend({
  action: z.literal('create'),
  reason: z
    .string()
    .min(2, 'Reason must be at least 2 characters')
    .max(500, 'Reason must be at most 500 characters'),
  cancellationReason: z.string().optional(),
  schedule: z.date().min(new Date(), 'Date must be in the future'),
})

const ScheduleSchema = BaseSchema.extend({
  action: z.literal('schedule'),
  reason: z.string().optional(),
  cancellationReason: z.string().optional(),
})

const CancelSchema = BaseSchema.extend({
  action: z.literal('cancel'),
  reason: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, 'Reason must be at least 2 characters')
    .max(500, 'Reason must be at most 500 characters'),
})

// ---- final schema ----
export const AppointmentSchema = z.discriminatedUnion('action', [
  CreateSchema,
  ScheduleSchema,
  CancelSchema,
])

export type IAppointmentSchema = z.infer<typeof AppointmentSchema>

export const AppointmentSchemaDefaultValues: IAppointmentSchema = {
  primaryPhysician: '',
  schedule: new Date(),
  note: '',
  action: 'schedule',
  reason: '',
  cancellationReason: '',
}

// export const CreateAppointmentSchema = z.object({
//   primaryPhysician: z.string().min(2, 'Select at least one doctor'),
//   schedule: z.coerce.date(),
//   reason: z
//     .string()
//     .min(2, 'Reason must be at least 2 characters')
//     .max(500, 'Reason must be at most 500 characters'),
//   note: z.string().optional(),
//   cancellationReason: z.string().optional(),
// })

// export const ScheduleAppointmentSchema = z.object({
//   primaryPhysician: z.string().min(2, 'Select at least one doctor'),
//   schedule: z.coerce.date(),
//   reason: z.string().optional(),
//   note: z.string().optional(),
//   cancellationReason: z.string().optional(),
// })

// export const CancelAppointmentSchema = z.object({
//   primaryPhysician: z.string().min(2, 'Select at least one doctor'),
//   schedule: z.coerce.date(),
//   reason: z.string().optional(),
//   note: z.string().optional(),
//   cancellationReason: z
//     .string()
//     .min(2, 'Reason must be at least 2 characters')
//     .max(500, 'Reason must be at most 500 characters'),
// })

// export function getAppointmentSchema(type: string) {
//   switch (type) {
//     case 'create':
//       return CreateAppointmentSchema
//     case 'cancel':
//       return CancelAppointmentSchema
//     default:
//       return ScheduleAppointmentSchema
//   }
// }
