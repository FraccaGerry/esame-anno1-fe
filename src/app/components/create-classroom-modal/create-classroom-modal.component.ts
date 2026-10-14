import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ClassroomService } from '../../services/classroom.service';

@Component({
  selector: 'app-create-classroom-modal',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './create-classroom-modal.component.html',
  styleUrl: './create-classroom-modal.component.css',
})
export class CreateClassroomModalComponent implements OnInit {
  protected fb = inject(FormBuilder);
  protected userSrv = inject(UserService);
  protected classroomSrv = inject(ClassroomService);
  protected activeModal = inject(NgbActiveModal);
  private destroyRef = inject(DestroyRef);

  students$ = this.userSrv.list('student');

  form = this.fb.group({
    name: ['', { validators: [Validators.required] }],
    students: new FormControl([] as string[], { validators: [Validators.required] })
  });

  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.errorMessage.set(null))
  }

  isSelected(id: string) {
    return this.form.controls.students.value!.includes(id);
  }

  toggleStudent(id: string, checked: boolean) {
    const current = this.form.controls.students.value!;
    const next = checked ? [...current, id] : current.filter(s => s !== id);
    this.form.controls.students.setValue(next);
  }

  create() {
    if (this.form.valid) {
      const { name, students } = this.form.value;
      this.classroomSrv.create({ name: name!, students: students! })
        .pipe(
          catchError(response => {
            this.errorMessage.set(response.error.message);
            return throwError(() => response);
          })
        )
        .subscribe(classroom => this.activeModal.close(classroom));
    }
  }
}