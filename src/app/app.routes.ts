import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ClassroomListComponent } from './pages/classroom-list/classroom-list.component';
import { authGuard } from './utils/auth.guard';
import { AssignmentListComponent } from './pages/assignment-list/assignment-list.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
    {
    path: 'classrooms',
    component: ClassroomListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'classrooms/:classroomId', 
    component: AssignmentListComponent, 
    canActivate: [authGuard] 
  },
  {
    path: '',
    redirectTo: '/classrooms',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];