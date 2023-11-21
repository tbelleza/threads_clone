"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { conntectToDB } from "../mongoose"

interface Params {
  userId: string,
  username: string,
  name: string, 
  bio: string,
  image: string,
  path: string
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path
}: Params): Promise<void> {
  conntectToDB()

  try {
    await User.findOneAndUpdate(
      { id: userId },
      { 
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true
      },
      // database operation that updates a row if exists else inserts
      { upsert: true }
    )
  
    if (path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to create update user: ${error.message}`)
  }
}