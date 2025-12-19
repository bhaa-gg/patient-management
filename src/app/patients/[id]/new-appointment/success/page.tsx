import { Button } from '@/components/ui/button'
import { Doctors } from '@/constants'
import { getAppointment } from '@/lib/actions/appointment.actions'
import { getUser } from '@/lib/actions/patinet.actions'
import { formatDateTime } from '@/lib/utils'
import { metrics } from '@sentry/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const RequestSuccess = async ({ searchParams, params }: SearchParamProps) => {
  const searchParam = await searchParams
  const appointment = await getAppointment(searchParam.appointmentId as string)
  const { id } = await params

  const doctor = Doctors.find(
    (d) => d.value.toLowerCase() === appointment.primaryPhysician.toLowerCase(),
  )
  const user = await getUser(id)
    .then((res) => res)
    .catch((err) => console.log({ err }))

  metrics.distribution('user-view-appointment-success', user.name)

  return (
    <div className="  flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image src="/assets/gifs/success.gif" height={300} width={280} alt="success" />
          <h2 className="header mb-6 max-w-[600px] text-dark-700 text-center">
            Your <span className="text-green-500">appointment request</span> has been successfully
            submitted!
          </h2>
          <p className="text-dark-700">We&apos;ll be in touch shortly to confirm.</p>
        </section>
        <section className="request-details text-dark-700">
          <p className="text-dark-700">Requested appointment details: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.imgSrc || ''}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.value}</p>
          </div>
          <div className="flex gap-2">
            <Image src="/assets/icons/calendar.svg" height={24} width={24} alt="calendar" />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>
        <Button variant="ghost" className="bg-green-500 hover:bg-green-400 transition-all " asChild>
          <Link href={`/patients/${id}/new-appointment`}>New Appointment</Link>
        </Button>
        <p className="text-dark-700">© 2024 CarePluse</p>
      </div>
    </div>
  )
}

export default RequestSuccess
