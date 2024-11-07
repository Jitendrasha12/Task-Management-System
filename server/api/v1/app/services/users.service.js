import Boom from '@hapi/boom';
import UserModel from '../../../../models/appUsers.model.js';
import Config from 'config';
import { flatObject, generateCustomerId } from '../../../../helper/util.js';
import Mongoose from 'mongoose';
;
import mailer from '../../../../helper/mailer.js';
export class userServices {
  async signUp(insertObj) {
    const { username, email, password,role } = insertObj;
    let user = await UserModel.findOne({ email });
    if (user) {
      throw Boom.conflict("User already exists with this email");
    }
    user = new UserModel({
      username,
      email,
      password,
      role
    });
    await user.save();
    return user;
  }

  async findUserByEmail(email) {
    let user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("User not found with this email");
    }
    return user;
  }

  async findUserByid(id) {
     const user = await UserModel.findById({_id:id});
     if (!user) {
       throw new Error("User not found");
     }
     return user;
  }

  async updateUser(email, token) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      user.token = token;
      await user.save();
      return user;
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const errorMessage = `Error updating user token: ${error.message}`;
      throw new Error(errorMessage);
    }
  }

  async updateUserToken(id) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { token: '' },
        { new: true }
      );
  
      if (!updatedUser) {
        throw new Error("User not found");
      }
  
      return updatedUser;
  
    } catch (error) {
      throw new Error('Failed to update user token');
    }
  }

}

export default new userServices();
