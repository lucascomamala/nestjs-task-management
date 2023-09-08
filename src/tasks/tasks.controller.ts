import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Task } from './task.entity'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskStatusDto } from './dto/update-task-status.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { GetUser } from 'src/auth/get-user.decorator'
import { User } from 'src/auth/user.entity'

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController', { timestamp: true })
  constructor(private tasksService: TasksService) {}

  // Get all tasks
  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    )
    return this.tasksService.getTasks(filterDto, user)
  }

  // Get task by id
  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" retrieving task with id: ${id}`,
    )
    return this.tasksService.getTaskById(id, user)
  }

  // Create task
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    )
    return this.tasksService.createTask(createTaskDto, user)
  }

  // Delete task
  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User "${user.username}" deleting task with id: ${id}`)
    return this.tasksService.deleteTask(id, user)
  }

  // Update task status
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${
        user.username
      }" updating task with id: ${id}. Data: ${JSON.stringify(
        updateTaskStatusDto,
      )}`,
    )
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto, user)
  }
}
