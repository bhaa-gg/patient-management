'use client'
import { authSchema, authSchemaDefaultValues, TAuthSchema } from '@/app/_types/auth-scehma'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import CustomFromField from '@/components/custom-from-field'
import { FormFieldType } from '@/constants/enums'
import SubmitButton from '@/components/SubmitButton'
import { createUser } from '@/lib/actions/patinet.actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { SendOtp } from '@/lib/actions/auth.action'
const PatientForm = () => {
  const router = useRouter()
  const form = useForm<TAuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: authSchemaDefaultValues,
  })

  const onSubmit: SubmitHandler<TAuthSchema> = async (data: TAuthSchema) => {
    try {
      const user = await createUser({
        email: data.email,
        name: data.userName,
        phone: data.phoneNumber,
      })
      if (user) {
        router.push(`/patients/${user.$id}/register`)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to create user. Please try again. ')
    }
  }

  const ActiveAdmin = async () => {
    const send = await SendOtp()
    if (!send.status) {
      toast.error(send.message, { duration: 4000, position: 'top-center' })
      return
    }

    router.replace('?admin=true')
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-4 mb-12">
          <h1 className="header">Hi There 👋</h1>
          <p className="text-dark-700">Schedule your first appointment .</p>
        </section>
        <CustomFromField<TAuthSchema>
          name="userName"
          fieldType={FormFieldType.INPUT}
          label="User Name"
          placeholder="Enter User Name"
          type="text"
          iconAlt="user"
          iconSrc="/assets/icons/user.svg"
        />
        <CustomFromField<TAuthSchema>
          name="email"
          fieldType={FormFieldType.INPUT}
          label="Email"
          placeholder="Enter Email"
          type="email"
          iconAlt="email"
          iconSrc="/assets/icons/email.svg"
        />
        <CustomFromField<TAuthSchema>
          name="phoneNumber"
          fieldType={FormFieldType.PHONE_INPUT}
          label="Phone Number"
          placeholder="Enter Phone Number"
        />
        <SubmitButton className="cursor-pointer" isLoading={form.formState.isSubmitting}>
          Submit
        </SubmitButton>
      </form>
      <div className="text-sm flex items-center justify-between mt-20 ">
        <p className="justify-items-end xl:text-left text-dark-600 ">&copy; 2025 CarePulse</p>
        <Button onClick={ActiveAdmin} className="cursor-pointer text-green-500" variant="link">
          Admin
        </Button>
      </div>
    </Form>
  )
}

export default PatientForm
