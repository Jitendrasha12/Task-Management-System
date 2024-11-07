import Express from 'express';
import controller from './controller.js';
import { authenticateApp } from '../../../../../helper/jwtHelper.js';
import Limiter from "../../../../../helper/rateLimiter.js";
import roleAuth from "../../../../../helper/roleAuth.js";
export default Express.Router()
  .post("/signup", controller.signUp)
  .post("/login", Limiter, controller.login)
  .post("/logout",controller.logOut)
  .get(
    "/mytasks",
    authenticateApp(),
    roleAuth(["User"]),
    controller.getUserTask
  )
  .get(
    "/myprofile",
    authenticateApp(),
    roleAuth(["Admin", "User"]),
    controller.userProfile
  )
  .put(
    "/task",
    authenticateApp(),
    roleAuth(["User"]),
    controller.updateTaskStatus
  );
  
  