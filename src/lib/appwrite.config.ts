import * as sdk from 'node-appwrite'

export const {
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  USERS_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  PROJECT_ID,
  API_KEY,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env

const client = new sdk.Client()

client?.setEndpoint(ENDPOINT!)?.setProject(PROJECT_ID!)?.setKey(API_KEY!)

// export const account = new sdk.Account(client)
export const DataBase = new sdk.Databases(client)
export const Storage = new sdk.Storage(client)
export const Messaging = new sdk.Messaging(client)
export const Users = new sdk.Users(client)
