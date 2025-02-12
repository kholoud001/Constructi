import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectDashboardComponent } from './architect-dashboard.component';

describe('ArchitectDashboardComponent', () => {
  let component: ArchitectDashboardComponent;
  let fixture: ComponentFixture<ArchitectDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArchitectDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchitectDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
