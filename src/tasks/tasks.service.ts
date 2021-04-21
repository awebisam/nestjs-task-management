import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';;
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';



@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }
    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks()

        if (status) {
            tasks = tasks.filter(task => task.status === status)
        }

        if (search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
        }

        return tasks
    }

    createTask(createTaskDto): Task {
        const { title, description } = createTaskDto
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task)
        return task;


    }

    getTaskById(id: string): Task {
        let found = this.tasks.find(task => task.id === id)

        if (!found) {
            throw new NotFoundException();
        }

        return found

    }

    deleteTaskById(id: string): Task[] {
        return this.tasks.filter((task) => task.id !== id)
    }

    updateTask(id: string, status: TaskStatus): Task {
        const task_edited = this.getTaskById(id)
        task_edited.status = status
        return task_edited
    }

}

