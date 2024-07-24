import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Task } from './interfaces/task.interface';
import { Response } from 'express';
import { TaskService } from './tasks.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('process')
  async processTasks(@Body('tasks') tasks: Task[], @Res() res: Response) {
    try {
      if (!Array.isArray(tasks) || tasks.length === 0) {
        throw new Error('Tasks must be a non-empty array.');
      }

      const sortedTasks = this.taskService.sortTasks(tasks).map((task) => ({
        name: task.name,
        command: task.command,
      }));

      res.json({ tasks: sortedTasks });
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('script')
  async generateScript(@Body('tasks') tasks: Task[], @Res() res: Response) {
    try {
      if (!Array.isArray(tasks) || tasks.length === 0) {
        throw new Error('Tasks must be a non-empty array.');
      }

      const sortedTasks = this.taskService.sortTasks(tasks);
      const scriptLines = ['#!/usr/bin/env bash'];
      sortedTasks.forEach((task) => {
        scriptLines.push(task.command);
      });

      const script = scriptLines.join('\n');
      res.set('Content-Type', 'text/plain');
      res.send(script);
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
