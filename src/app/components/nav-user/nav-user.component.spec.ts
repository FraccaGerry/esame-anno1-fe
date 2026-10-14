import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavUserComponent } from './nav-user.component';

describe('NavUserComponent', () => {
  let component: NavUserComponent;
  let fixture: ComponentFixture<NavUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
