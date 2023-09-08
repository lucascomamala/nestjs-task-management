import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { Task } from './task.entity'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
