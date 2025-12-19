import Image from 'next/image'
import Link from 'next/link'
import PatientForm from './_components/auth-form/patient-form'
import { PassKeyModel } from './patients/[id]/new-appointment/_components/PassKeyModal'
import { SendOtp } from '@/lib/actions/auth.action'
import { Button } from '@/components/ui/button'

export default async function Home({ searchParams }: SearchParamProps) {
  const searchParam = await searchParams

  


  return (
    <>
      <PassKeyModel />
      <div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container  my-auto ">
          <div className=" mx-auto flex size-full flex-col py-10 text-white max-w-[496px]">
            <Image
              className="h-10 mb-12 w-fit"
              src={'/assets/icons/logo-full.svg'}
              alt="logo"
              width={1000}
              height={1000}
            />
            <PatientForm />
          </div>
        </section>
        <Image
          src={'/assets/images/onboarding-img.png'}
          className="rounded-3xl hidden h-full object-cover md:block max-w-1/2"
          alt="bg"
          width={1000}
          height={1000}
        />
      </div>
    </>
  )
}
