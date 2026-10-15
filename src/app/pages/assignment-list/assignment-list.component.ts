import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AssignmentService } from '../../services/assignment.service';
import { AuthService } from '../../services/auth.service';
import { Assignment, StudentCompletion } from '../../entities';

type StudentsByStatus = { done: StudentCompletion[]; todo: StudentCompletion[] };

@Component({
  selector: 'app-assignment-list',
  imports: [AsyncPipe, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.css',
})
export class AssignmentListComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  protected assignmentSrv = inject(AssignmentService);
  protected authSrv = inject(AuthService);

  isTeacher = this.authSrv.isTeacher;
  isStudent = this.authSrv.isStudent;

  // il nome del parametro deve coincidere con quello definito in app.routes.ts
  protected classroomId = this.route.snapshot.paramMap.get('classroomId')!;

  protected notFound = signal(false);
  protected error = signal<string | null>(null);

  protected refresh$ = new BehaviorSubject<void>(undefined);

  // id dell'attività espansa (solo docenti), null = nessuna
  protected selectedId = signal<string | null>(null);

  assignments$ = this.refresh$
                   .pipe(
                     switchMap(() => this.assignmentSrv.list(this.classroomId)
                       .pipe(
                         catchError(err => {
                           if (err.status === 404) {
                             this.notFound.set(true);
                           }
                           return of([] as Assignment[]);
                         })
                       )
                     )
                   );

  // dettaglio studenti dell'attività selezionata: null = chiuso o in caricamento
  students$ = toObservable(this.selectedId)
                .pipe(
                  switchMap((id): Observable<StudentsByStatus | null> => {
                    if (!id) return of(null);
                    return this.assignmentSrv.listStudents(this.classroomId, id)
                      .pipe(
                        map(list => ({
                          done: list.filter(s => s.completed),
                          todo: list.filter(s => !s.completed),
                        })),
                        startWith(null),
                        catchError(() => {
                          this.error.set('Impossibile caricare gli studenti');
                          return of({ done: [], todo: [] });
                        })
                      );
                  })
                );

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  create() {
    if (this.form.invalid) return;
    this.error.set(null);

    this.assignmentSrv.create(this.classroomId, this.form.getRawValue())
      .subscribe({
        next: () => {
          this.form.reset();
          this.refresh$.next();
        },
        error: () => this.error.set("Impossibile creare l'attività"),
      });
  }

  complete(id: string) {
    this.error.set(null);

    this.assignmentSrv.complete(this.classroomId, id)
      .subscribe({
        next: () => this.refresh$.next(),
        error: () => this.error.set("Impossibile completare l'attività"),
      });
  }

  toggleStudents(id: string) {
    if (!this.isTeacher()) return;
    this.error.set(null);
    this.selectedId.update(current => current === id ? null : id);
  }
}