'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Image from 'next/image'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { decryptKey, encryptKey } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { verifyOtp } from '@/lib/actions/auth.action'

export function PassKeyModel() {
  const [admin, setAdmin] = useQueryState('admin', parseAsBoolean)
  const [otpValue, setOtpValue] = useState<string>('')
  const router = useRouter()

  const verify = async () => {
    const storedKey = sessionStorage.getItem('accessKey')

    if (!storedKey) {
      router.push('/')
      return
    }
    const accessKey = decryptKey(storedKey)
    const verifc = await verifyOtp(accessKey)
    if (!verifc.status) return

    router.push('/admin')
  }

  const validatePasskey = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    if (otpValue.trim().length !== 6) {
      toast.error('Please enter a valid OTP', { position: 'top-center' })
      return
    }
    const verify = await verifyOtp(otpValue)

    if (!verify.status) {
      toast.error(verify.message, { position: 'top-center' })
      return
    }
    sessionStorage.setItem('accessKey', verify.accessKey!)
    setAdmin(null)
    setOtpValue('')

    setTimeout(() => {
      router.replace('/admin')
    }, 5)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    verify()
  }, [])

  return (
    <AlertDialog open={admin as boolean} onOpenChange={setAdmin}>
      <AlertDialogContent className="md:max-w-[640px] rounded-2xl bg-[#1A1D21F5] ">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white  relative text-[24px]  ">
            Verify OTP
            <button className="absolute top-0 right-0 ">
              <Image
                src="/assets/icons/close.svg"
                alt="close"
                width={20}
                height={20}
                onClick={() => setAdmin(null)}
                className="cursor-pointer"
              />
            </button>
          </AlertDialogTitle>
          <AlertDialogDescription className=" text-base text-[#ABB8C4] ">
            Please enter the OTP sent to your registered mobile number.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="">
          <InputOTP value={otpValue} onChange={setOtpValue} maxLength={6}>
            <InputOTPGroup className="w-full flex justify-between ">
              <InputOTPSlot className="scd-slot" index={0} />
              <InputOTPSlot className="scd-slot" index={1} />
              <InputOTPSlot className="scd-slot" index={2} />
              <InputOTPSlot className="scd-slot" index={3} />
              <InputOTPSlot className="scd-slot" index={4} />
              <InputOTPSlot className="scd-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="cursor-pointer bg-green-500 hover:bg-green-600  w-full"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
