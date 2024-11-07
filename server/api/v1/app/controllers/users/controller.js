import Boom from '@hapi/boom';
import taskService from "../../services/task.service.js";
import Joi, { boolean } from 'joi';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import {
  encryptPassword,
  verifyingCredentials,
} from "../../../../../helper/util.js";
import { generateJwt, validateJwt } from '../../../../../helper/jwtHelper.js';
import Response from "../../../../../../assets/response.model.js";
import MailNotifier from "../../../../../helper/mailer.js";
import responseMessage from "../../../../../../assets/responseMessage.js";
import Config from 'config';
import userService from '../../services/users.service.js';
export class UserController {
  /**
   * @swagger
   * /app/user/signup:
   *   post:
   *     tags:
   *       - App
   *     description: Signup
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: signup
   *         description: signup
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *               username:
   *                   type: string
   *               email:
   *                   type: string
   *               password:
   *                   type: string
   *               role:
   *                   type: string
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async signUp(request, response, next) {
    const validationSchema = {
      username: Joi.string().required(),
      password: Joi.string().min(6).max(10).required().trim(),
      email: Joi.string()
        .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
        .required()
        .trim()
        .error(new Error("Invalid Email")),
      role: Joi.string().valid("Admin", "Manager", "User").default("User"), // Role validation
    };

    try {
      const validatedBody = await Joi.validate(request.body, validationSchema);
      validatedBody.password = await encryptPassword(validatedBody.password);
      let user = await userService.signUp(validatedBody);
      const { _id, email, role } = user;
      console.log(validatedBody.username,'user name   ');
      const token = await generateJwt({ _id, email, role }, "app");
      delete user.password;
      const result = Object.assign({}, { user, token });
      if (user?.email) {
        await MailNotifier.sendRegistrationEmail({
          to: user.email,
          username: validatedBody.username,
        });
      }
      
      response.json(new Response(result, "Sign-up and login successfully"));
    } catch (err) {
      return next(Boom.badRequest(err));
    }
  }

  /**
   * @swagger
   * /app/user/login:
   *   post:
   *     tags:
   *       - App
   *     description: login
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: login
   *         description: login
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *               email:
   *                   type: string
   *               password:
   *                   type: string
   *     responses:
   *       200:
   *         description: Returns success message
   */

  async login(request, response, next) {
    const validateSchema = {
      email: Joi.string()
        .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
        .required()
        .trim()
        .error(new Error("Invalid Email")),
      password: Joi.string().optional(),
    };
    try {
      const { email, password } = await Joi.validate(
        request.body,
        validateSchema
      );
      let user;
      if (email) {
        user = await userService.findUserByEmail(email);
      }
      await verifyingCredentials(user.password, password);
      const { _id, role } = user;
      const token = await generateJwt({ _id, email, role }, "app");
      if(token){
        await userService.updateUser(email,token)
      }

      delete user.password;
      console.log(token, "this is our token");
      const result = Object.assign({}, { user, token });
      return response.json(new Response(result, responseMessage.LOGIN));
    } catch (error) {
      return next(error);
    }
  }

  async logOut(request, response, next) {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      if (!token) {
        return response.status(400).json({ message: 'No token provided' });
      }
      const secret = Config.get("jwtsecret");  
      const decoded = jwt.verify(token,secret);
      const { _id } = decoded;
  
      const user = await userService.findUserByid(_id);
      if (!user) {
        return response.status(404).json({ message: 'User not found' });
      }
  
      await userService.updateUserToken(_id);
      return response.json(new Response(null, responseMessage.LOGOUT_SUCCESS));
  
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /app/mytasks:
   *   get:
   *     tags:
   *       - App
   *     description: get user tasks
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: Bearer Authorization Header
   *         in: header
   *         required: true
   *         type: string
   *     responses:
   *       200:
   */

  async getUserTask(request, response, next) {
    try {
      console.log(request.user._id, "request.user._id");
      const tasks = await taskService.getUserTask(request.user._id);

      return response.json({
        message: "User tasks retrieved successfully",
        data: tasks,
      });
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @swagger
   * /app/myprofile:
   *   get:
   *     tags:
   *       - App
   *     description: get user profile
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: Bearer Authorization Header
   *         in: header
   *         required: true
   *         type: string
   *     responses:
   *       200:
   */
  async userProfile(request, response, next) {
    let userProfile = await userService.findUserByid(request.user._id);
    response.json(new Response(userProfile, "Sign-up and login successfully"));
  }

  /**
   * @swagger
   * /app/task/{id}:
   *   put:
   *     tags:
   *       - Task
   *     description: Update an existing task
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: Bearer Authorization Header
   *         in: header
   *         required: true
   *         type: string
   *       - name: id
   *         in: path
   *         required: true
   *         description: Task ID
   *         type: string
   *       - name: task
   *         in: body
   *         description: Task details to be updated
   *         required: true
   *         schema:
   *           properties:
   *               status:
   *                   type: string

   *     responses:
   *       200:
   *         description: Task updated successfully
   */
  async updateTaskStatus(request, response, next) {
    const validationSchema = Joi.object({
      status: Joi.string().optional(),
    });

    try {
      const validatedBody = await Joi.validate(request.body, validationSchema);
      const { id } = request.params;
      const userId = request.user._id;
      const task = await taskService.findUserTask(id, userId);
      if (!task) {
        return response
          .status(404)
          .json({ error: "Task not found or not assigned to you" });
      }
      const updatedTask = await taskService.updateTaskStatus(
        id,
        userId,
        validatedBody.status
      );
      return response.json(
        new Response(updatedTask, responseMessage.TASK_UPDATED)
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();
