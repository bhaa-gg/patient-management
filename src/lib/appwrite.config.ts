import * as sdk from 'node-appwrite'

export const {
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  USERS_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  PROJECT_ID = '69238fae00114512bb99',
  API_KEY,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT = 'https://fra.cloud.appwrite.io/v1',
} = process.env

const client = new sdk.Client()

const my =
  'standard_e3ab19163ea075396aa0a23ac4d9c2bc0ff7a46350dc971d8c10eda1e91c3f9a988bb9bc4881d19f1c597d770b057a725fc77fd3ff7d4d3b61c5aaee0822ce0db2448452f4b3351ea815e6ffa486333832046a1e6b1d04e75f369cc3e65531f10cad6f7c907b2478a3bd66b2b225e2217853de32a501bd92d4a2d093d1bdd7a5'
client
  ?.setEndpoint(ENDPOINT ?? 'https://fra.cloud.appwrite.io/v1')
  ?.setProject(PROJECT_ID! ?? '69238fae00114512bb99')
  ?.setKey(my)

// export const account = new sdk.Account(client)
export const DataBase = new sdk.Databases(client)
export const Storage = new sdk.Storage(client)
export const Messaging = new sdk.Messaging(client)
export const Users = new sdk.Users(client)
