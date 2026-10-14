import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassroomService } from '../../services/classroom.service';
import { AuthService } from '../../services/auth.service';
import { CreateClassroomModalComponent } from '../../components/create-classroom-modal/create-classroom-modal.component';

@Component({
  selector: 'app-classroom-list',
  imports: [AsyncPipe],
  templateUrl: './classroom-list.component.html',
  styleUrl: './classroom-list.component.css',
})
export class ClassroomListComponent {
  protected classroomSrv = inject(ClassroomService);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);
  protected modalSrv = inject(NgbModal);

  isTeacher = this.authSrv.isTeacher;

  // ogni next() rilancia la chiamata: lo uso per ricaricare la lista dopo la creazione
  protected refresh$ = new BehaviorSubject<void>(undefined);

  classrooms$ = this.refresh$
                  .pipe(
                    switchMap(() => this.classroomSrv.list())
                  );

  openCreate() {
    this.modalSrv.open(CreateClassroomModalComponent)
      .result
      .then(() => this.refresh$.next())
      .catch(() => {}); // modal chiuso senza creare: niente da fare
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/classrooms', id]);
  }
}