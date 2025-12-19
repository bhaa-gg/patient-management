/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import React from 'react'
import AppointmentForm from './_components/appointment-form'
import { getPatients } from '@/lib/actions/patinet.actions'
import { metrics } from '@sentry/nextjs'

const NewAppointment = async ({ params }: SearchParamProps) => {
  const { id } = await params
  const patient = await getPatients(id)
  metrics.distribution('user-view-new-appointment', patient.name)

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm patientId={patient?.$id} userId={id} type="create" />
          <p className="copyright text-dark-700 mt-10 py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  )
}

export default NewAppointment
