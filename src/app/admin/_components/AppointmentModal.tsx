'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Appointment } from '../../../../types/appwrite.types'
import { Button } from '@/components/ui/button'
import AppointmentForm from '@/app/patients/[id]/new-appointment/_components/appointment-form'

type AppointmentModalProps = {
  patientId: string
  userId: string
  appointment?: Appointment
  type: 'schedule' | 'cancel'
  title: string
  description: string
}
const AppointmentModal = ({
  patientId,
  userId,
  appointment,
    type,
  title,
  description,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`cursor-pointer  capitalize ${type === 'schedule' && 'text-green-500'}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md shadow border  rounded-2xl p-10  ">
        <DialogHeader className="space-y-4">
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
          open={open}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentModal
