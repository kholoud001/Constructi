import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskAddComponent } from './subtask-add.component';

describe('SubtaskAddComponent', () => {
  let component: SubtaskAddComponent;
  let fixture: ComponentFixture<SubtaskAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubtaskAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtaskAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
