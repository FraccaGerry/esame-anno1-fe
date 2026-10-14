import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Classroom } from '../entities';

export type CreateClassroomData = {
  name: string;
  students: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private http = inject(HttpClient);

  list() {
    return this.http.get<Classroom[]>('/api/classrooms');
  }

  create(data: CreateClassroomData) {
    return this.http.post<Classroom>('/api/classrooms', data);
  }
}