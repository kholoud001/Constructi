import {Component, OnInit} from '@angular/core';

import {InvoiceService} from '../invoice.service';

@Component({
  selector: 'app-invoice-list',
  standalone: false,
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent implements OnInit{

  constructor(
    private invoiceService: InvoiceService
  ) {}



  ngOnInit(): void {
    this.invoiceService.getUserInvoices(1).subscribe(data => {
      console.log('Invoices:', data);
    });

  }


}
