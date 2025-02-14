import { inject, Injectable } from '@angular/core';
import { AppConstant } from '../constants/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../shared/models/task.model';
import { ResponseResult } from '../../shared/models/response.model';
import { TaskCreateRequest } from '../../shared/models/dtos/tasks/task-create-request.model';
import { TaskUpdateRequest } from '../../shared/models/dtos/tasks/task-update-request.model';
import { TaskChangeStatusRequest } from '../../shared/models/dtos/tasks/task-change-status-request.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly API_URL = AppConstant.URL + "tasks";

    http = inject(HttpClient);

    getTasks() : Observable<ResponseResult<Task[]>> {
       return this.http.get<ResponseResult<Task[]>>(this.API_URL);
    }

    getTaskById(id: number) : Observable<ResponseResult<Task>> {
        return this.http.get<ResponseResult<Task>>(this.API_URL + `/${id}`);
    }

    addTask(task: TaskCreateRequest) : Observable<ResponseResult<Task>> {
        return this.http.post<ResponseResult<Task>>(this.API_URL, task);
    }

    updateTask(task: TaskUpdateRequest) : Observable<ResponseResult<Task>> {
        return this.http.put<ResponseResult<Task>>(this.API_URL, task);
    }

    removeTask(id: number) : Observable<ResponseResult<Task>> {
        return this.http.delete<ResponseResult<Task>>(this.API_URL + `/${id}`);
    }

    changeTaskStatus(task: TaskChangeStatusRequest) : Observable<ResponseResult<Task>> {
        return this.http.put<ResponseResult<Task>>(`${this.API_URL}/status`, task);
    }
}
