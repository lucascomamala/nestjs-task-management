import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Task } from './task.entity'
import { TaskStatus } from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskStatusDto } from './dto/update-task-status.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { User } from 'src/auth/user.entity'

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true })

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // Get tasks
  // optional filters
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto

    const query = this.tasksRepository.createQueryBuilder('task')
    query.where({ user })
    if (status) {
      query.andWhere('task.status = :status', { status })
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      )
    }
    try {
      const tasks = await query.getMany()
      return tasks
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }", Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      )
      throw new InternalServerErrorException()
    }
  }

  // Get task by id
  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } })
    if (!found) {
      this.logger.error(
        `Failed to get task with id "${id}" for user "${user.username}"`,
      )
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }
    return found
  }

  // Create task
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    })

    try {
      await this.tasksRepository.save(task)
      return task
    } catch (error) {
      this.logger.error(
        `Failed to create task for user "${
          user.username
        }". Data: ${JSON.stringify(createTaskDto)}`,
        error.stack,
      )
      throw new InternalServerErrorException()
    }
  }

  // Delete task
  async deleteTask(id: string, user: User): Promise<void> {
    const found = await this.tasksRepository.delete({ id, user })

    if (found.affected === 0) {
      this.logger.error(
        `Failed to delete task with id "${id}" for user "${user.username}"`,
      )
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }
  }

  // Update task status
  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto
    const task = await this.getTaskById(id, user)

    try {
      task.status = status
      await this.tasksRepository.save(task)
      return task
    } catch (error) {
      this.logger.error(
        `Failed to update task with id "${id}" for user "${user.username}"`,
      )
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }
  }
}
