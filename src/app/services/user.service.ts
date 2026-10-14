import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Role, User } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  list(type: Role) {
    return this.http.get<User[]>('/api/users', { params: { type } });
  }
}