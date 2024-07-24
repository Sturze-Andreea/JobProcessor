import { Module } from '@nestjs/common';
import { TaskController } from './controllers/tasks.controller';
import { TaskService } from './services/tasks.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
})
export class TasksModule {}
