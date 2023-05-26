import mongoose, { Schema } from "mongoose";

interface IAdminUser extends mongoose.Document {
  fullName: string;
  passwword: string;
  email: string;
  adminToken: string;
}

const AdminUserSchema: mongoose.Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      // validate:[validator.isEmail, 'Please enter valid email address']
    },
    adminToken: {
      type: String,
    },
  },
  { timestamps: true }
);
const AdminUser =
  mongoose.models.Admin || mongoose.model<IAdminUser>("Admin", AdminUserSchema);
export default AdminUser;
