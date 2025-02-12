import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostTrackingComponent } from './cost-tracking.component';

describe('CostTrackingComponent', () => {
  let component: CostTrackingComponent;
  let fixture: ComponentFixture<CostTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
