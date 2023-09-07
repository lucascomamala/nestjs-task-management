import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Task } from './task.entity'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // getAllTasks(): Task[] {
  //   return this.tasks
  // }
  // getTasksWithFilters(filterDto: any): Task[] {
  //   const { status, search } = filterDto
  //   let tasks = this.getAllTasks()
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status)
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true
  //       }
  //       return false
  //     })
  //   }
  //   return tasks
  // }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id: id })
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }
    return found
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    })

    await this.tasksRepository.save(task)
    return task
  }

  // deleteTask(id: string): void {
  //   const found = this.getTaskById(id)
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id)
  // }
  // updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
  //   const { status } = updateTaskStatusDto
  //   const task = this.getTaskById(id)
  //   task.status = status
  //   return task
  // }
}
