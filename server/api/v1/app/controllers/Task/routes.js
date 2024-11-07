import Express from "express";
import controller from "./controller.js";
import { authenticateApp } from "../../../../../helper/jwtHelper.js";
import roleAuth from "../../../../../helper/roleAuth.js";
export default Express.Router()
  .post(
    "/task",
    authenticateApp(),
    roleAuth(["Admin", "Manager"]),
    controller.createTask
  ) // Route to create a task
  .get(
    "/task",
    controller.getTasks
  ) // Route to get all tasks
  .get(
    "/task/user",
    authenticateApp(),
    roleAuth(["Admin", "Manager"]),
    controller.getUserTask
  ) // Route to get tasks assigned to a specific user
  .put(
    "/task/:id",
    authenticateApp(),
    roleAuth(["Admin", "Manager"]),
    controller.updateTask
  ) 
  .delete(
    "/task/:id",
    authenticateApp(),
    roleAuth(["Admin"]),
    controller.deleteTask
  )
  .post(
    "/assign",
    authenticateApp(),
    roleAuth(["Manager"]),
    controller.assignTask
  )
  .get(
    "/userprofile",
    authenticateApp(),
    roleAuth(["Admin", "Manager"]),
    controller.userProfile
  )
  .get(
    "/tasks/statistics",
    // authenticateApp(),
    // roleAuth(["Admin", "Manager"]),
    controller.getTaskStatistics
  )

  .get('/view/assigned/task', authenticateApp(),
  roleAuth(["Admin", "Manager"]),controller.getAllAssignedTasks)
  

 

 