import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Assignment, StudentCompletion } from '../entities';

export type CreateAssignmentData = {
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  listStudents(classroomId: string, id: string) {
    return this.http.get<StudentCompletion[]>(`/api/classrooms/${classroomId}/assignments/${id}/students`);
  }
  private http = inject(HttpClient);

  list(classroomId: string) {
    return this.http.get<Assignment[]>(`/api/classrooms/${classroomId}/assignments`);
  }

  create(classroomId: string, data: CreateAssignmentData) {
    return this.http.post<Assignment>(`/api/classrooms/${classroomId}/assignments`, data);
  }

  complete(classroomId: string, id: string) {
    return this.http.patch<Assignment>(`/api/classrooms/${classroomId}/assignments/${id}`, {});
  }
}