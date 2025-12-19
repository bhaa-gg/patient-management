/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { formatDateTime, parseStringify } from '../utils'

import {
  DataBase,
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  PATIENT_COLLECTION_ID,
  Messaging,
} from '../appwrite.config'
import { Databases, ID, Query } from 'node-appwrite'
import { revalidatePath } from 'next/cache'

import axios from 'axios'
import { getUser } from './patinet.actions'

export const createAppointment = async (appointmentData: CreateAppointmentParams) => {
  try {
    const newAppointment = await DataBase.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointmentData,
    )
    revalidatePath('/admin')
    return parseStringify(newAppointment)
  } catch (error) {
    throw 'An error occurred while creating a new appointment:' + error
  }
}
export const updateAppointment = async (appointmentData: UpdateAppointmentParams) => {
  try {
    const updateAppointment = await DataBase.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentData.appointmentId,
      appointmentData.appointment,
    )

    if (!updateAppointment) throw 'Appointment Not Found :'

  
    await sendEmail(appointmentData)

    revalidatePath('/admin')

    return parseStringify(updateAppointment)
  } catch (error) {
    console.log({ error })
    throw 'An error occurred while creating a new appointment:' + error
  }
}
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await DataBase.listDocuments(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, [
      Query.orderDesc('$createdAt'),
    ])
    const enrichedAppointments = await Promise.all(
      appointments.documents.map(async (appointment) => {
        const patientData = await DataBase.getDocument(
          DATABASE_ID!,
          PATIENT_COLLECTION_ID!,
          appointment.patient,
        )

        return {
          ...appointment,
          patient: patientData,
        }
      }),
    )

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    }

    const counts = appointments.documents.reduce((acc, appointment) => {
      switch (appointment.status) {
        case 'scheduled':
          acc.scheduledCount++
          break
        case 'pending':
          acc.pendingCount++
          break
        case 'cancelled':
          acc.cancelledCount++
          break
      }
      return acc
    }, initialCounts)

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: enrichedAppointments,
    }

    return parseStringify(data)
  } catch (error) {
    console.error('An error occurred while retrieving the recent appointments:', error)
  }
}
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await DataBase.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
    )

    return parseStringify(appointment)
  } catch (error) {
    throw 'An error occurred while retrieving the existing patient:' + error
  }
}

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await Messaging.createSms(ID.unique(), content, [], [userId])
    return parseStringify(message)
  } catch (error) {
    console.error('An error occurred while sending sms:', error)
  }
}
export const sendSMSNotificationAx = async (userId: string, content: string) => {
  try {
    const user = await getUser(userId)
    const phonrNum: string = (user.phone as string).replace('+', '')
    const data = {
      from: process.env.NEXT_PUBLIC_FROM_NUM!,
      to: phonrNum || process.env.NEXT_PUBLIC_TO_NUM!,
      message_type: 'text',
      text: content,
      channel: 'whatsapp',
    }

    axios
      .post(process.env.NEXT_PUBLIC_API_URL!, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        auth: {
          username: process.env.NEXT_PUBLIC_API_KEY || '',
          password: process.env.NEXT_PUBLIC_API_SECRET || '',
        },
      })
      .then((response) => {
        console.log('Message sent successfully:', response.data)
      })
      .catch((error) => {
        console.error(
          'Error sending message:',
          error.response ? error.response.data : error.message,
        )
      })
  } catch (error) {
    console.error('An error occurred while sending sms:', error)
  }
}
export const sendEmail = async (appointmentData: any) => {
  try {
    const htmlForm = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background:#f7f7f7;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">
      
      <h2 style="color: #4CAF50; text-align:center;">Greetings from CarePulse</h2>

      <p style="font-size: 16px; color: #333;">
        ${
          appointmentData.type === 'schedule'
            ? `
              Your appointment is confirmed for 
              <strong style="color:#000;">
                ${
                  formatDateTime(appointmentData.appointment.schedule!, appointmentData.timeZone)
                    .dateTime
                }
              </strong> 
              with Dr. 
              <strong style="color:#000;">
                ${appointmentData.appointment.primaryPhysician}
              </strong>.
            `
            : `
              We regret to inform you that your appointment scheduled for 
              <strong style="color:#000;">
                ${
                  formatDateTime(appointmentData.appointment.schedule!, appointmentData.timeZone)
                    .dateTime
                }
              </strong>
              has been 
              <span style="color: red; font-weight: bold;">cancelled</span>.
              <br/><br/>
              <strong>Reason:</strong> 
              <em>${appointmentData.appointment.cancellationReason}</em>
            `
        }
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 14px; color: #777; text-align:center;">
        Thank you for choosing <strong>CarePulse</strong>.<br>
        If you have questions, feel free to contact us anytime.
      </p>

    </div>
  </div>
`
    const user = await getUser(appointmentData.userId)
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.NEXT_PUBLIC_DOMAIN
    axios
      .post(`${baseUrl}/api/sendMail`, {
        to: user.email,
        html: htmlForm,
        subject: 'Cate Pulse Appointment Notification',
        message: 'message',
      })
      .catch((err) => console.log({ errBhaa: err }))
  } catch (error) {
    console.error({ errorServer: error })
  }
}
