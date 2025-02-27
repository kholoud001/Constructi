import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialUpdateComponent } from './material-update.component';

describe('MaterialUpdateComponent', () => {
  let component: MaterialUpdateComponent;
  let fixture: ComponentFixture<MaterialUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
