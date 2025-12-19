'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import React from 'react'
import { Appointment } from '../../../../types/appwrite.types'
import StatusBadge from '@/components/StatusBadge'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import { Doctors } from '@/constants'
import AppointmentModal from '../_components/AppointmentModal'

const columns: ColumnDef<Appointment>[] = [
  {
    header: '#',
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>
    },
  },

  {
    accessorKey: 'patient',
    header: () => <p className="text-14-medium  text-center ">Patient</p>,
    cell: ({ row }) => {
      const appointment = row.original
      return <p className="text-14-medium text-center ">{appointment.patient.name}</p>
    },
  },

  {
    accessorKey: 'status',
    header: () => <p className="text-14-medium  text-center ">Status</p>,
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <div className="min-w-[115px] flex items-center justify-center ">
          <StatusBadge status={appointment.status} />
        </div>
      )
    },
  },
  {
    accessorKey: 'schedule',
    header: () => <p className="text-14-medium  text-center ">Appointment</p>,
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <p className="text-14-regular text-center min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      )
    },
  },
  {
    accessorKey: 'primaryPhysician',
    header: () => <p className="text-14-medium  text-center ">Doctor</p>,
    cell: ({ row }) => {
      const appointment = row.original

      const doctor = Doctors.find((doctor) => doctor.value === appointment.primaryPhysician)

      return (
        <div className="flex justify-center items-center gap-3">
          <Image
            src={doctor?.imgSrc ?? ''}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.value}</p>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className="pl-4 text-center">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original

      return (
        <div className="flex items-center justify-center gap-1">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      )
    },
  },
]

export default columns
