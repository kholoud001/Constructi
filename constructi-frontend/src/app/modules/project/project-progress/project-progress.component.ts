import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-progress',
  standalone: false,
  templateUrl: './project-progress.component.html',
  styleUrl: './project-progress.component.css'
})
export class ProjectProgressComponent {

  @Input() tasks: any[] = [];
  getProgress(): number {
    if (!this.tasks.length) return 0;
    const completedTasks = this.tasks.filter(task => task.status === 'FINISHED').length;
    return (completedTasks / this.tasks.length) * 100;
  }

}
