// import Mongoose, { Schema } from 'mongoose';
import mongoose from "mongoose";
import { token } from "morgan";
const { Schema } = mongoose;

const options = {
	toJSON: {
		transform: (doc, obj) => {
			delete obj.__v;
			delete obj.id;
			return obj;
		},
		virtuals: false
	},
	strict: true,
	timestamps: true,
	collection: 'Users'
};
const UserSchema = new Schema(
  {
    username: { type: String, index: true },
    email: { type: String, index: true },
    password: { type: String },
	token:{ type: String },
    role: { type: String, enum: ["Admin", "Manager", "User"], default: "User" }, 
  },
  options
);

const UserModel = mongoose.model('appUser', UserSchema);
export default UserModel;
