import taskService from "../../services/task.service.js";
import Joi from "joi";
import userService from "../../services/users.service.js";
import Response from "../../../../../../assets/response.model";
import responseMessage from "../../../../../../assets/responseMessage.js";
import { set, get } from "../../../../../redis/utils.js";
import MailNotifier from "../../../../../helper/mailer.js";
export class UserController {
  // Create Task

  /**
   * @swagger
   * /app/task:
   *   post:
   *     tags:
   *       - Task
   *     description: Create a new task
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: Bearer Authorization Header
   *         in: header
   *         required: true
   *         type: string
   *       - name: task
   *         description: Task details
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *               title:
   *                   type: string
   *                   example: "Complete the project"
   *               description:
   *                   type: string
   *                   example: "Complete the backend integration"
   *               dueDate:
   *                   type: string
   *                   format: date
   *                   example: "2024-09-30"
   *               priority:
   *                   type: string
   *                   example: "High"
   *     responses:
   *       200:
   */
  async createTask(request, response, next) {
    const validationSchema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      dueDate: Joi.string().required(),
      priority: Joi.string().required(),
    });

    try {
      const validatedBody = await Joi.validate(request.body, validationSchema);
      let userId = "66d932d0b32f60060c7fdecb";
      const result = await taskService.createTask(
        validatedBody,
        // request.user._id
        userId
      );
      return response.json(new Response(result, responseMessage.SIGNUP));
    } catch (error) {
      return next(error);
    }
  }

  // Get all tasks
  /**
   * @swagger
   * /app/task:
   *   get:
   *     tags:
   *       - Task
   *     description: get task list
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: Bearer Authorization Header
   *         in: header
   *         required: true
   *         type: string
   *       - name: task
   *         description: Task details
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *     responses:
   *       200:
   */
  // async getTasks(request, response, next) {
  //   try {
  //     console.log("here we are");
  //     const {
  //       status,
  //       priority,
  //       dueDate,
  //       search,
  //       page = 1,
  //       limit = 10,
  //     } = request.query;
  //     const pageNumber = parseInt(page, 10);
  //     const limitNumber = parseInt(limit, 10);
  //     const tasks = await taskService.getTasks({
  //       status,
  //       priority,
  //       dueDate,
  //       search,
  //       page: pageNumber,
  //       limit: limitNumber,
  //     });
  //     return response.json(new Response(tasks, responseMessage.TASK_RETRIEVED));
  //   } catch (error) {
  //     return next(error);
  //   }
  // }

  /**
   * @swagger
   * /app/task:
   *   post:
   *     tags:
   *       - Task
   *     description: get user tasks
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: Bearer Authorization Header
   *         in: header
   *         required: true
   *         type: string
   *       - name: task
   *         description: Task details
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *               userId:
   *                   type: string
   *     responses:
   *       200:
   */
  async getUserTask(request, response, next) {
    const validationSchema = Joi.object({
      userId: Joi.string().required(),
    });
    try {
      const { userId } = await Joi.validate(request.body, validationSchema);
      const tasks = await taskService.getUserTask(userId, validationSchema);
      return response.json(new Response(tasks, responseMessage.TASK_RETRIEVED));
    } catch (error) {
      return next(error);
    }
  }

  // Update Task
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
   *               title:
   *                   type: string
   *                   example: "Update project"
   *               description:
   *                   type: string
   *                   example: "Update the project deadline"
   *               dueDate:
   *                   type: string
   *                   format: date
   *                   example: "2024-10-10"
   *               priority:
   *                   type: string
   *                   example: "Medium"
   *     responses:
   *       200:
   *         description: Task updated successfully
   */
  async updateTask(request, response, next) {
    const validationSchema = Joi.object({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      dueDate: Joi.string().optional(),
      priority: Joi.string().optional(),
    });

    try {
      const validatedBody = await Joi.validate(request.body, validationSchema);
      const { id } = request.params;

      // Check if task exists
      const task = await taskService.taskFindById(id);
      if (!task) {
        return response.status(404).json({ error: "Task not found" });
      }

      const updatedTask = await taskService.updateTask(id, validatedBody);
      return response.json(
        new Response(updatedTask, responseMessage.TASK_UPDATED)
      );
    } catch (error) {
      return next(error);
    }
  }

  // Delete Task
  /**
   * @swagger
   * /app/task/{id}:
   *   delete:
   *     tags:
   *       - Task
   *     description: Delete a task by its ID
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
   *     responses:
   *       200:
   *         description: Task deleted successfully
   */
  async deleteTask(request, response, next) {
    try {
      const { id } = request.params;
      await taskService.taskFindById(id);
      await taskService.removeTask(id);
      return response.json(new Response({}, responseMessage.TASK_DELETED));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /app/task/assign:
   *   post:
   *     tags:
   *       - Task
   *     description: assing  task to user
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: Bearer Authorization Header
   *         in: header
   *         required: true
   *         type: string
   *       - name: task
   *         description: Task details
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *               taskId:
   *                   type: string
   *               userId:
   *                   type: string
   *     responses:
   *       200:
   */

  async assignTask(request, response, next) {
    const validationSchema = {
      taskId: Joi.string().required().trim(),
      userId: Joi.string().required().trim(),
    };
    try {
      const { taskId, userId } = await Joi.validate(
        request.body,
        validationSchema
      );
      console.log(taskId, userId, "taskUserID");
      await taskService.findUserTask(taskId, userId);
      let task = await taskService.taskFindById(taskId);
      let user = await userService.findUserByid(userId);
      if (user && user.email) {
        let user = await userService.findUserByid(userId);
        if (user && user.email) {
          await MailNotifier.sendTaskAssignmentEmail({
            to: user.email,
            username: user.username,
            title: task.title,
          });
        }
      }
      if (task) {
        task.assignedTo = userId;
        const updatedTask = await task.save();
        return response.json(new Response({}, responseMessage.TASK_ASSIGNED));
      }
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * /app/task/userprofile:
   *   get:
   *     tags:
   *       - Task
   *     description: get user profile
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: Authorization
   *         description: Bearer Authorization Header
   *         in: header
   *         required: true
   *         type: string
   *       - name: task
   *         description: user details
   *         in: body
   *         required: true
   *         schema:
   *           properties:
   *               userId:
   *                   type: string
   *     responses:
   *       200:
   */

  async userProfile(request, response, next) {
    const validationSchema = {
      userId: Joi.string().required().trim(),
    };
    try {
      const { userId } = await Joi.validate(request.body, validationSchema);
      let userProfile = await userService.findUserByid(userId);
      response.json(new Response(userProfile, responseMessage.USER_PROFILE));
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @swagger
   * path:
   *   /api/tasks/statistics:
   *     get:
   *       tags:
   *         - Task Statistics
   *       summary: Retrieve task statistics for a user or team.
   *       description: Get the count of completed, pending, and overdue tasks for a specific user or team.
   *       parameters:
   *         - name: Authorization
   *           description: Bearer Authorization Header
   *           in: header
   *           required: true
   *           type: string
   *         - name: userId
   *           in: query
   *           description: ID of the user for whom the statistics are being retrieved.
   *           required: false
   *           schema:
   *             type: string
   *       responses:
   *         '200':
   *           description: Successfully retrieved task statistics.
   *
   */

  async getTaskStatistics(request, response, next) {
    try {
      const { userId, teamId } = request.query;

      const completedCount = await taskService.getTaskCountByStatus({
        userId,
        teamId,
        status: "completed",
      });
      const pendingCount = await taskService.getTaskCountByStatus({
        userId,
        teamId,
        status: "Pending",
      });
      const overdueCount = await taskService.getOverdueTasksCount({
        userId,
        teamId,
      });

      return response.json(
        new Response(
          {
            completed: completedCount,
            pending: pendingCount,
            overdue: overdueCount,
          },
          responseMessage.STATISTICS_RETRIEVED
        )
      );
    } catch (error) {
      return next(error);
    }
  }

  async getTasks(request, response, next) {
    try {
      const { status, priority, dueDate, search } = request.query;
      const cacheKey = `tasks_${status || "all"}_${priority || "all"}_${
        dueDate || "all"
      }_${search || "all"}`;
      console.log(`Generated Cache Key: ${cacheKey}`);
      const cachedTasks = await get(cacheKey);
      console.log(`Cached Tasks: ${cachedTasks}`);
      if (cachedTasks) {
        return response.json(
          new Response(JSON.parse(cachedTasks), "Tasks retrieved from cache")
        );
      }
      const tasks = await taskService.getTasks(
        status,
        priority,
        dueDate,
        search
      );
      await set(cacheKey, JSON.stringify(tasks), "EX", 30);
      return response.json(new Response(tasks, "Tasks retrieved from DB"));
    } catch (error) {
      console.error("Error retrieving tasks:", error);
      return next(error);
    }
  }

  /**
   * @swagger
   * /app/task/view/assigned/task:
   *   post:
   *     tags:
   *       - Task
   *     description: assing  task to user
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

  async getAllAssignedTasks(req, res, next) {
    try {
      const tasks = await taskService.assignedTask();
      return res.json(new Response(tasks, 'Assigned tasks fetched successfully'));
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();
