import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-project-progress',
  templateUrl: './project-progress.component.html',
  styleUrls: ['./project-progress.component.css'],
})
export class ProjectProgressComponent implements OnInit {
  @Input() project: any;

  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Not Started', 'In Progress', 'Finished'],
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#FF5733', '#FFC300', '#4CAF50'] }],
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
  };

  ngOnInit(): void {
    if (this.project) {
      const notStarted = this.project.tasks.filter((task: any) => task.status === 'NOT_STARTED').length;
      const inProgress = this.project.tasks.filter((task: any) => task.status === 'IN_PROGRESS').length;
      const completed = this.project.tasks.filter((task: any) => task.status === 'FINISHED').length;

      this.doughnutChartData = {
        labels: ['Not Started', 'In Progress', 'Finished'],
        datasets: [{ data: [notStarted, inProgress, completed], backgroundColor: ['#FF5733', '#FFC300', '#4CAF50'] }],
      };
    }
  }
}
