import Image from 'next/image'
import RegisterForm from './_components/register-form'
import { getUser } from '@/lib/actions/patinet.actions'
import { metrics } from '@sentry/nextjs'

const Register = async ({ params }: SearchParamProps) => {
  const { id } = await params
  const user = await getUser(id)
    .then((res) => res)
    .catch((err) => console.log({ err }))

  metrics.distribution('user-view-register', user.name)

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container    my-auto ">
        <div className=" mx-auto flex   size-full flex-col py-10 text-white max-w-[650px]">
          <Image
            className="h-10 mb-12 w-fit"
            src={'/assets/icons/logo-full.svg'}
            alt="logo"
            width={1000}
            height={1000}
          />
          <RegisterForm user={user} />
          <p className="justify-items-end my-2 xl:text-left text-dark-600 ">
            &copy; 2025 CarePulse
          </p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        className="rounded-3xl  max-w-[390px] hidden h-full object-cover md:block "
        alt="bg"
        width={1000}
        height={1000}
      />
    </div>
  )
}

export default Register
