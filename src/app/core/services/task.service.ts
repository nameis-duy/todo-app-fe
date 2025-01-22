import { inject, Injectable } from '@angular/core';
import { AppConstant } from '../constants/constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../shared/models/task.model';
import { ResponseResult } from '../../shared/models/response.model';
import { TaskCreateRequest } from '../../shared/models/dtos/task.create.request.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly API_URL = AppConstant.URL + "tasks";

    http = inject(HttpClient);

    getTasks() : Observable<ResponseResult<Task[]>> {
       return this.http.get<ResponseResult<Task[]>>(this.API_URL);
    }

    addTask(task: TaskCreateRequest) : Observable<ResponseResult<number>> {
        return this.http.post<ResponseResult<number>>(this.API_URL, task);
    }
}
