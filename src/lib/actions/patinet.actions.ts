/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { ID, Query } from 'node-appwrite'
import {
  DataBase,
  DATABASE_ID,
  BUCKET_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  Storage,
  Users,
} from '../appwrite.config'
import { parseStringify } from '../utils'
import { InputFile } from 'node-appwrite/file'

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await Users.create(ID.unique(), user.email, user.phone, undefined, user.name)
    return newUser
  } catch (error: any) {
    if (error && error?.code === 409) {
      const docs = await Users.list([Query.equal('email', [user.email])])
      return docs.users[0]
    }
    throw error
  }
}

export const getUser = async (userId: string) => {
  try {
    const user = await Users.get(userId)
    return parseStringify(user)
  } catch (error) {
    throw error
  }
}

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument.get('blobFile') as Blob,
        identificationDocument.get('fileName') as string,
      )
      file = await Storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
    }

    const newPatient = await DataBase.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      },
    )

    return parseStringify(newPatient)
  } catch (error) {
    throw error
  }
}

export const getPatients = async (userId: string) => {
  try {
    const patients = await DataBase.listDocuments(DATABASE_ID!, PATIENT_COLLECTION_ID!, [
      Query.equal('userId', userId),
    ])
    return parseStringify(patients.documents[0])
  } catch (error) {
    throw error
  }
}
