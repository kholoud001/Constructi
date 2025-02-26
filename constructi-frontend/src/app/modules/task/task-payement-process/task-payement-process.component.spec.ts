import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPayementProcessComponent } from './task-payement-process.component';

describe('TaskPayementProcessComponent', () => {
  let component: TaskPayementProcessComponent;
  let fixture: ComponentFixture<TaskPayementProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskPayementProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPayementProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
