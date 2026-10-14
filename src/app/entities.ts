import { User } from './services/auth.service';

export interface Classroom {
  id: string;
  name: string;
  studentsCount: number;
  createdBy: User;
}

export interface Assignment {
  id: string;
  title: string;
  studentsCount: number;
  completedCount: number;
  // presente solo se chi chiama è uno studente
  completed?: boolean;
  createdAt: string;
  createdBy: User;
}