import taskModel from "../../../../models/task.model.js";
import appUserModel from "../../../../models/appUsers.model.js";
import moment from "moment";
import mongoose from "mongoose";

class TaskService {
  // Create a task
  async createTask({ title, description, dueDate, priority }, userId) {
    const task = new taskModel({
      title,
      description,
      dueDate,
      priority,
      createdBy: userId, // Capture the creator from userId
    });
    return await task.save();
  }

  // Get all tasks with populated user details
  async getTasks(status, priority, dueDate, search, page = 1, limit = 10) {
    try {
      // Initialize the query object
      const query = {};

      // Apply filters
      if (status) {
        query.status = status;
      }
      if (priority) {
        query.priority = priority;
      }
      if (dueDate) {
        const parsedDate = new Date(dueDate);
        if (!isNaN(parsedDate.getTime())) {
          query.dueDate = { $lte: parsedDate }; // Fetch tasks due on or before the given date
        }
      }

      // Apply search if provided
      let searchQuery = {};
      if (search) {
        searchQuery = {
          $text: { $search: search },
        };
      }
      console.log(searchQuery,'seachQuerry')

      // Combine the filter and search query
      const combinedQuery = { ...query, ...searchQuery };
      console.log(combinedQuery, "Complete the Project");
      // Handle pagination
      const skip = (page - 1) * limit;

      // Retrieve tasks with filtering, searching, and pagination
      const tasks = await taskModel
        .find(combinedQuery)
        .skip(skip)
        .limit(limit)
        .exec();

      return tasks;
    } catch (error) {
      console.error("Error retrieving tasks:", error);
      throw new Error("Error retrieving tasks");
    }
  }

  // Get tasks assigned to a specific user
  async getUserTask(userId) {
    return await taskModel.find({ assignedTo: userId });
  }

  // Find task by ID
  async taskFindById(id) {
    const task = await taskModel.findById(id);
    if (!task) {
      throw new Error("Task not found with this id");
    }
    return task;
  }

  async findUserTask(id, userId) {
    const task = await taskModel.findOne({ _id: id, assignedTo: userId });
    if (!task) {
      return null;
    }
    throw new Error("Task already assigned to this user");
  }

  // Update task by ID
  async updateTaskStatus(taskId, userId, newStatus) {
    try {
      const task = await taskModel.findOne({ _id: taskId, assignedTo: userId });

      // If task not found or not assigned to the user
      if (!task) {
        throw new Error("Task not found or not assigned to this user");
      }

      // Update task status
      task.status = newStatus;
      await task.save();

      return task;
    } catch (error) {
      throw new Error("Error updating task status: " + error.message);
    }
  }

  // Remove task by ID
  async removeTask(id) {
    const task = await taskModel.findByIdAndRemove(id);
    if (!task) {
      throw new Error("Task not found");
    }
  }

  async getTaskCountByStatus({ userId, status }) {
    try {
      const counts = await taskModel.aggregate([
        {
          $match: {
            ...(userId && { assignedTo: userId }),
            ...(status && { status }), // Directly match the status
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      return counts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
    } catch (error) {
      throw new Error("Error retrieving task counts by status");
    }
  }

  // Get tasks count by overdue status
  async getOverdueTasksCount({ userId, teamId }) {
    try {
      const today = new Date();
      const counts = await taskModel.aggregate([
        {
          $match: {
            ...(userId && { assignedTo: userId }),
            ...(teamId && { teamId: teamId }),
            dueDate: { $lt: today },
            status: { $ne: "completed" }, // Exclude completed tasks
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);

      return counts.length > 0 ? counts[0].count : 0;
    } catch (error) {
      throw new Error("Error retrieving overdue tasks count");
    }
  }

 async assignedTask(){
    const tasks = await taskModel.find({ userId: { $ne: null } }).sort({ createdAt: -1 });
    return tasks

  }
}

export default new TaskService();
