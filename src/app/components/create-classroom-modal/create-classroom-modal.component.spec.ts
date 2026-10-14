import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClassroomModalComponent } from './create-classroom-modal.component';

describe('CreateClassroomModalComponent', () => {
  let component: CreateClassroomModalComponent;
  let fixture: ComponentFixture<CreateClassroomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClassroomModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClassroomModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
