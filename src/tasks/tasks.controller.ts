import { Controller, Get, Param } from '@nestjs/common'

import { Task } from './task.entity'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   // if we have any filters defined, call tasksService.getTasksWithFilters
  //   // otherwise, just get all tasks

  //   if (Object.keys(filterDto).length) {
  //     return this.tasksService.getTasksWithFilters(filterDto)
  //   } else {
  //     return this.tasksService.getAllTasks()
  //   }
  // }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id)
  }

  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //   return this.tasksService.createTask(createTaskDto)
  // }

  // @Delete('/:id')
  // deleteTask(@Param('id') id: string): void {
  //   this.tasksService.deleteTask(id)
  // }

  // @Patch('/:id/status')
  // updateTaskStatus(
  //   @Param('id') id: string,
  //   @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  // ): Task {
  //   return this.tasksService.updateTaskStatus(id, updateTaskStatusDto)
  // }
}
