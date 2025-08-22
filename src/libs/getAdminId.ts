import { User } from "@/models";
import mongoose from "mongoose";

export async function getAdminId(): Promise<mongoose.Types.ObjectId | null> {
  // Find first admin user (adjust query as per your schema)
  const adminUser = await User.findOne({ role: 7 }).select("_id").lean();
  return adminUser?._id || null;
}
