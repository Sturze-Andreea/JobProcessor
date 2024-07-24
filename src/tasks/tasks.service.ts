import { Injectable } from '@nestjs/common';
import { Task } from './interfaces/task.interface';

@Injectable()
export class TaskService {
  public sortTasks(tasks: Task[]): Task[] {
    let tasksList: Task[] = [...tasks];
    const sortedTasks: Task[] = [];
    const noDependencyTasks: Task[] = [];

    // Compute the number of dependencies and initial no dependency list
    tasksList = tasksList.map((task) => {
      if (task.requires) {
        return { ...task, dependencies: task.requires.length };
      } else {
        noDependencyTasks.push(task);
        return { ...task, dependencies: 0 };
      }
    });

    while (noDependencyTasks.length > 0) {
      const task = noDependencyTasks.pop()!;
      sortedTasks.push(task);

      // Recompile the dependencies after adding one of the no dependency tasks in the sorted list
      tasksList = tasksList.map((t) => {
        if (t.requires && t.requires.includes(task.name)) {
          t.dependencies! -= 1;
          if (t.dependencies === 0) {
            noDependencyTasks.push(t);
          }
        }
        return t;
      });
    }

    // If the number of tasks sorted is not the same as the initial length of the list, then the tasks have a circular dependency
    if (sortedTasks.length !== tasks.length) {
      throw new Error('Tasks are involved in a cycle!');
    }

    return sortedTasks;
  }
}
