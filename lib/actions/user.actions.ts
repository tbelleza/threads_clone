"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { conntectToDB } from "../mongoose"

export async function updateUser(
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string
): Promise<void> {
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