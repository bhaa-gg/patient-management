'use client'
import React, { useCallback, useEffect } from 'react'
import {
  AppointmentSchema,
  AppointmentSchemaDefaultValues,
  IAppointmentSchema,
} from '../_types/appointment.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import CustomFromField from '@/components/custom-from-field'
import { FormFieldType } from '@/constants/enums'
import { Doctors } from '@/constants'
import SubmitButton from '@/components/SubmitButton'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createAppointment, updateAppointment } from '@/lib/actions/appointment.actions'
import { Appointment } from '../../../../../../types/appwrite.types'

type AppointmentFormProps = {
  patientId: string
  userId: string
  type: 'create' | 'cancel' | 'schedule'
  appointment?: Appointment
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  open?: boolean
}

const AppointmentForm = ({
  setOpen,
  appointment,
  patientId,
  userId,
  type,
  open,
}: AppointmentFormProps) => {
  const router = useRouter()
  const form = useForm<IAppointmentSchema>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician || '',
      schedule: new Date(appointment?.schedule || new Date()),
      note: appointment?.note || '',
      action: type,
      reason: appointment?.reason || '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  })

  const onCreate = async (values: IAppointmentSchema, status: string) => {
    try {
      const appointmentData = {
        userId,
        patient: patientId,
        primaryPhysician: values.primaryPhysician,
        schedule: new Date(values.schedule),
        reason: values.reason,
        status: status as Status,
        note: values.note,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newAppointment = await createAppointment(appointmentData as any)
      console.log(newAppointment)

      if (newAppointment) {
        form.reset(AppointmentSchemaDefaultValues)
        router.push(
          `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`,
        )
      }
      toast.success('Appointment Created Successfully')
    } catch (error) {
      console.log({ error })
      toast.error('Failed to create appointment. Please try again.')
    }
  }

  const onUpdate = async (values: IAppointmentSchema, status: string) => {
    try {
      const appointmentToUpdate = {
        userId,
        appointmentId: appointment?.$id,
        appointment: {
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          status: status as Status,
          cancellationReason: values.cancellationReason,
        },
        type,
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedAppointment = await updateAppointment(appointmentToUpdate as any)
      console.log({ updatedAppointment })
      if (updatedAppointment) {
        setOpen?.(false)
      }
      toast.success('Message Send Successfully')
    } catch (error) {
      console.log({ error })
      toast.error('Failed to update appointment. Please try again.')
    }
  }

  const handleSubmit: SubmitHandler<IAppointmentSchema> = async (values: IAppointmentSchema) => {
    const status = type === 'schedule' ? 'scheduled' : type === 'cancel' ? 'cancelled' : 'pending'
    if (type === 'create') onCreate(values, status)
    else onUpdate(values, status)
  }

  const buttonLabel = useCallback(() => {
    switch (type) {
      case 'create':
        return 'Request Appointment'
      case 'cancel':
        return 'Cancel Appointment'
      case 'schedule':
        return 'Schedule Appointment'
    }
  }, [type])

  useEffect(() => {
    if (!open) {
      form.reset(AppointmentSchemaDefaultValues)
    }
  }, [open])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 space-y-6">
        {type === 'create' && (
          <section className="mb-12 space-y-4">
            <h1 className="header text-dark-700">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
          </section>
        )}
        {type !== 'cancel' && (
          <>
            <CustomFromField<IAppointmentSchema>
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Primary care physician"
              placeholder="Select a physician"
              listValues={Doctors}
            />
            <CustomFromField<IAppointmentSchema>
              fieldType={FormFieldType.DATE_PICKER}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div className={`flex flex-col gap-6  ${type === 'create' && 'xl:flex-row'}`}>
              <CustomFromField<IAppointmentSchema>
                fieldType={FormFieldType.TEXTAREA}
                className="text-white"
                name="reason"
                label="Appointment reason"
                placeholder="Annual montly check-up"
                disabled={type === 'schedule'}
              />

              <CustomFromField<IAppointmentSchema>
                fieldType={FormFieldType.TEXTAREA}
                className="text-white"
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                disabled={type === 'schedule'}
              />
            </div>
          </>
        )}

        {type === 'cancel' && (
          <CustomFromField<IAppointmentSchema>
            fieldType={FormFieldType.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}
        <SubmitButton
          isLoading={form.formState.isSubmitting}
          className={`${
            type === 'cancel' ? 'bg-red-800' : 'shad-primary-btn'
          } cursor-pointer w-full`}
        >
          {buttonLabel()}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm
