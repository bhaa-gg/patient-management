/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Form, FormControl } from '@/components/ui/form'
import CustomFromField from '@/components/custom-from-field'
import { FormFieldType, GenderOptions } from '@/constants/enums'
import SubmitButton from '@/components/SubmitButton'
import {
  IRegisterFormSchema,
  RegisterFormSchema,
  RegisterFormSchemaDefaultValues,
} from '../_types/register.schema'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Doctors, IdentificationTypes } from '@/constants'
import FileUploader from '@/components/file-uploader'
import { toast } from 'sonner'
import { registerPatient } from '@/lib/actions/patinet.actions'
import { useRouter } from 'next/navigation'

const RegisterForm = ({ user }: { user?: User }) => {
  const router = useRouter()
  const form = useForm<IRegisterFormSchema>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: RegisterFormSchemaDefaultValues,
  })

  const onSubmit: SubmitHandler<IRegisterFormSchema> = async (values: IRegisterFormSchema) => {
    let fromData = null
    if (values.identificationDocument && values.identificationDocument.length > 0) {
      {
        const blobFile = new Blob([values.identificationDocument[0]], {
          type: values.identificationDocument[0].type,
        })
        fromData = new FormData()
        fromData.append('blobFile', blobFile)
        fromData.append('fileName', values.identificationDocument[0]?.name)
      }
    }

    try {
      const patientData = {
        userId: user?.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: values.birthDate ? new Date(values.birthDate) : null,
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument ? fromData : undefined,
        privacyConsent: values.privacyConsent,
      }

      const patient = await registerPatient(patientData as any)

      if (patient) router.push(`/patients/${user?.$id}/new-appointment`)
    } catch (error) {
      console.log({ error })
      toast.error(error+"" , {
        position : 'top-center'
      })
    }
  }

  console.log({
    err: form.formState.errors,
    err2: form.formState.isValid,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className="space-y-4">
          <h1 className="header">Welcome {user?.name} 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6 ">
          <div className="mb-9 space-y-1">
            <h2 className="text-3xl">Personal Information</h2>
          </div>
          <CustomFromField<IRegisterFormSchema>
            name="name"
            fieldType={FormFieldType.INPUT}
            placeholder="Full Name"
            type="text"
            iconAlt="user"
            iconSrc="/assets/icons/user.svg"
          />
          <div className="flex flex-col gap-2 xl:flex-row">
            <CustomFromField<IRegisterFormSchema>
              name="email"
              fieldType={FormFieldType.INPUT}
              placeholder="example@example.com"
              type="email"
              iconAlt="email"
              iconSrc="/assets/icons/email.svg"
            />
            <CustomFromField<IRegisterFormSchema>
              name="phone"
              fieldType={FormFieldType.PHONE_INPUT}
              placeholder="(123) 456-7890"
            />
          </div>
          <div className="flex flex-col gap-2 xl:flex-row">
            <CustomFromField<IRegisterFormSchema>
              fieldType={FormFieldType.DATE_PICKER}
              name="birthDate"
              label="Date of birth"
            />

            <CustomFromField<IRegisterFormSchema>
              fieldType={FormFieldType.SKELETON}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex   h-11 gap-6 xl:justify-between"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {Object.values(GenderOptions).map((option, i) => (
                      <div
                        key={option + i}
                        className={`radio-group ${
                          option === field.value && '!bg-white/10 !border-fuchsia-700'
                        } `}
                      >
                        <RadioGroupItem
                          checked={option === field.value}
                          value={option}
                          id={option}
                          className="bg-white "
                        />
                        <Label htmlFor={option} className={`cursor-pointer `}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>
          <div className="flex flex-col gap-2 xl:flex-row">
            <CustomFromField<IRegisterFormSchema>
              name="address"
              label="Address"
              fieldType={FormFieldType.INPUT}
              placeholder="ex: 14 street, New York, NY - 5101"
            />
            <CustomFromField<IRegisterFormSchema>
              name="occupation"
              label="Occupation"
              fieldType={FormFieldType.INPUT}
              placeholder="Software Engineer"
            />
          </div>
          <div className="flex flex-col gap-2 xl:flex-row">
            <CustomFromField<IRegisterFormSchema>
              name="emergencyContactName"
              label="Emergency contact name"
              fieldType={FormFieldType.INPUT}
              placeholder="Guardian’s name"
            />
            <CustomFromField<IRegisterFormSchema>
              name="emergencyContactNumber"
              label="Emergency Phone number"
              fieldType={FormFieldType.PHONE_INPUT}
              placeholder="ex: +1 (868) 579-9831"
            />
          </div>
        </section>

        <section className="space-y-6 ">
          <div className="mb-9 space-y-1">
            <h2 className="text-3xl">Medical Information</h2>
          </div>
          <CustomFromField<IRegisterFormSchema>
            fieldType={FormFieldType.SELECT}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
            listValues={Doctors}
          />

          <div className="flex flex-col gap-2 xl:flex-row">
            <CustomFromField<IRegisterFormSchema>
              fieldType={FormFieldType.INPUT}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="BlueCross BlueShield"
            />
            <CustomFromField<IRegisterFormSchema>
              fieldType={FormFieldType.INPUT}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789"
            />
          </div>
          <div className="flex flex-col gap-2 xl:flex-row">
            <CustomFromField<IRegisterFormSchema>
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies (if any)"
              placeholder="ex: Peanuts, Penicillin, Pollen"
            />
            <CustomFromField<IRegisterFormSchema>
              fieldType={FormFieldType.TEXTAREA}
              name="currentMedication"
              label="Current medications"
              placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>
          <div className="flex flex-col gap-2 xl:flex-row">
            <CustomFromField<IRegisterFormSchema>
              fieldType={FormFieldType.TEXTAREA}
              name="familyMedicalHistory"
              label="Family medical history (if relevant)"
              placeholder="ex: Mother had breast cancer"
            />
            <CustomFromField<IRegisterFormSchema>
              fieldType={FormFieldType.TEXTAREA}
              name="pastMedicalHistory"
              label="Past medical history medications"
              placeholder="ex: Asthma diagnosis in childhood"
            />
          </div>
        </section>

        <section className="space-y-6 ">
          <div className="mb-9 space-y-1">
            <h2 className="text-3xl">Identification and Verfication</h2>
          </div>
          <CustomFromField<IRegisterFormSchema>
            fieldType={FormFieldType.SELECT}
            name="identificationType"
            label="Identification type"
            placeholder="Select a Identification type"
            listValues={IdentificationTypes}
          />
          <CustomFromField<IRegisterFormSchema>
            fieldType={FormFieldType.INPUT}
            name="identificationNumber"
            label="Identification Number"
            placeholder="ex 1234567"
          />
          <CustomFromField<IRegisterFormSchema>
            fieldType={FormFieldType.SKELETON}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFromField<IRegisterFormSchema>
            fieldType={FormFieldType.CHECKBOX}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFromField<IRegisterFormSchema>
            fieldType={FormFieldType.CHECKBOX}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFromField<IRegisterFormSchema>
            fieldType={FormFieldType.CHECKBOX}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>

        <SubmitButton
          // disabled={!form.formState.isValid}
          className="cursor-pointer"
          isLoading={form.formState.isSubmitting}
        >
          Submit
        </SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm
