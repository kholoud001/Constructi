import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInvoiceHistoryComponent } from './material-invoice-history.component';

describe('MaterialInvoiceHistoryComponent', () => {
  let component: MaterialInvoiceHistoryComponent;
  let fixture: ComponentFixture<MaterialInvoiceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialInvoiceHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialInvoiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
