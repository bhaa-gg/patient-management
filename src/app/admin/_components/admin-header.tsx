'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const AdminHeader = () => {
  const router = useRouter()
  return (
    <header className="admin-header">
      <Link href="/" className="cursor-pointer">
        <Image
          src="/assets/icons/logo-full.svg"
          height={32}
          width={162}
          alt="logo"
          className="h-8 w-fit"
        />
      </Link>

      <p className="text-base font-semibold">Admin Dashboard</p>
      <Button
        onClick={() => {
          sessionStorage.removeItem('accessKey')
          router.replace('/')
        }}
        className="bg-red-500 text-white font-bold cursor-pointer"
        variant="link"
      >
        Logout
      </Button>
    </header>
  )
}

export default AdminHeader
