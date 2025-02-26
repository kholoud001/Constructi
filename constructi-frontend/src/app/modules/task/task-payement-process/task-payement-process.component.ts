import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {faCreditCard} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-payement-process',
  standalone: false,
  templateUrl: './task-payement-process.component.html',
  styleUrls: ['./task-payement-process.component.css']
})
export class TaskPayementProcessComponent implements OnInit {
  taskId: string | null = null;
  taskDetails: any = null; // Placeholder for your task details

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the task ID from the route parameters
    this.taskId = this.route.snapshot.paramMap.get('id');

    // Fetch task details by taskId (make sure you have a service to fetch details)
    this.fetchTaskDetails(this.taskId);
  }

  fetchTaskDetails(taskId: string | null) {
    // Simulate fetching task data (replace with an actual service call)
    if (taskId) {
      // Fetch data by taskId
      this.taskDetails = {
        description: 'Task Description Here',
        budgetLimit: 1000,
        totalPaid: 500,
        invoice: 'Invoice123',
        paymentStatus: 'Pending'
      };
    }
  }

  protected readonly faCreditCard = faCreditCard;
}
