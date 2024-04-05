"use server";

import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/database/connectToDatabase";
import User from "@/lib/database/models/user.model";
import { handleError } from "@/lib/utils";
import { CreateUserParams, UpdateUserParams } from "@/types";

// create user
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    if (!newUser) throw new Error("Failed to create user.");

    return JSON.parse(JSON.stringify(newUser));
  } catch (error: unknown) {
    handleError(error);
  }
}

// read user
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found.");

    return JSON.parse(JSON.stringify(user));
  } catch (error: unknown) {
    handleError(error);
  }
}

// update user
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updateUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updateUser) throw new Error("Failed to update user.");

    return JSON.parse(JSON.stringify(user));
  } catch (error: unknown) {
    handleError(error);
  }
}

// delete user
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deletedUser) throw new Error("Failed to delete user.");

    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error: unknown) {
    handleError(error);
  }
}

// use credits

export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true },
    );

    if (!updatedUserCredits) throw new Error("Unable to update user credits.");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error: unknown) {
    handleError(error);
  }
}
