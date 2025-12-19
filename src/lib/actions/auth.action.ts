'use server'
import { Query } from 'node-appwrite'
import { DataBase, DATABASE_ID, USERS_COLLECTION_ID } from '../appwrite.config'
import axios from 'axios'
import { encryptKey } from '../utils'

export const SendOtp = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const email = process.env.NEXT_PUBLIC_EMAIL!
  try {
    const users = await DataBase.listDocuments(DATABASE_ID!, USERS_COLLECTION_ID!, [
      Query.equal('Email', email!),
    ])

    if (users.total === 0) {
      return { message: 'User not found', status: false }
    }

    const userId = users.documents[0].$id

    const updatedUser = await DataBase.updateDocument(DATABASE_ID!, USERS_COLLECTION_ID!, userId, {
      AuthOtp: encryptKey(otp),
    })

    if (!updatedUser) return { message: 'Failed to update OTP', status: false }

    await sendOtp(otp, email!)
    return { message: 'OTP sent successfully', status: true }
  } catch (error) {
    console.error('Error updating OTP:', error)
    throw Error('Error updating OTP')
  }
}

export const verifyOtp = async (otp: string) => {
  const email = process.env.NEXT_PUBLIC_EMAIL!
  try {
    const users = await DataBase.listDocuments(DATABASE_ID!, USERS_COLLECTION_ID!, [
      Query.equal('Email', email!),
    ])

    if (!users.total) return { message: 'User not found', status: false }

    const user = users.documents[0]
    if (user.AuthOtp !== encryptKey(otp)) return { message: 'Invalid OTP', status: false }

    return {
      message: 'OTP verified successfully',
      status: true,
      accessKey: user.AuthOtp,
    }
    return { message: 'OTP verified successfully', status: true }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw Error('Error verifying OTP')
  }
}

export const sendOtp = async (otp: string, email: string) => {
  try {
    const htmlForm = `
      <h1>Your OTP Code</h1>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code is valid for 10 minutes.</p>
    `

    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_DOMAIN
    axios
      .post(`${baseUrl}/api/sendMail`, {
        to: email,
        html: htmlForm,
        subject: 'Your OTP Code',
        message: 'message',
      })
      .catch((err) => console.log({ errBhaa: err }))
  } catch (error) {
    console.error({ errorServer: error })
  }
}
