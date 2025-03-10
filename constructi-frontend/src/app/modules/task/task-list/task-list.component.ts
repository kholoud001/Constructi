import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import Swal from 'sweetalert2';
import {
  faListCheck,
  faPlus,
  faSpinner,
  faClipboardList,
  faEye,
  faPencil,
  faTrash,
  faChevronDown,
  faChevronUp,
  faCheckCircle,
  faCalendarPlus,
  faUserCheck,
  faTimesCircle,
  faCalendarDay,
  faFilter,
  faSort,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { SubtaskService } from '../../subtask/subtask.service';
import { UserService } from '../../user/user.service';

interface Task {
  id: number;
  description: string;
  status: string;
  progress: number;
  dateEndEstimated: string;
  assignedTo?: string;
  showSubtasks: boolean;
  subtasks: Subtask[];
  subtasksLoading: boolean;
}

interface Subtask {
  id: number;
  description: string;
  status: string;
  approved: boolean;
  parentTaskId: number;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: false,
})
export class TaskListComponent implements OnInit {
  // Icons
  faListCheck = faListCheck;
  faPlus = faPlus;
  faSpinner = faSpinner;
  faClipboardList = faClipboardList;
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faCheckCircle = faCheckCircle;
  faCalendarPlus = faCalendarPlus;
  faUserCheck = faUserCheck;
  faTimesCircle = faTimesCircle;
  faCalendarDay = faCalendarDay;
  faFilter = faFilter;
  faSort = faSort;
  faSearch = faSearch;

  tasks: Task[] = [];
  isLoading = true;

  constructor(
    private taskService: TaskService,
    private subtaskService: SubtaskService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data.map(task => ({
          ...task,
          showSubtasks: false,
          subtasks: [],
          subtasksLoading: false
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
        this.showErrorAlert('Failed to load tasks', 'Please try again later.');
      }
    });
  }

  toggleSubtasks(task: Task): void {
    task.showSubtasks = !task.showSubtasks;
    if (task.showSubtasks && task.subtasks.length === 0) {
      this.loadSubtasks(task);
    }
  }

  loadSubtasks(task: Task): void {
    task.subtasksLoading = true;
    this.subtaskService.getSubtasksByParentTaskId(task.id).subscribe({
      next: (data) => {
        task.subtasks = data;
        task.subtasksLoading = false;
      },
      error: (error) => {
        console.error('Error loading subtasks:', error);
        task.subtasksLoading = false;
        this.showErrorAlert('Failed to load subtasks', 'Please try again later.');
      }
    });
  }

  addSubtask(parentTaskId: number): void {
    this.router.navigate(['/subtasks/add', parentTaskId]);
  }

  confirmDeleteSubtask(subtask: Subtask): void {
    Swal.fire({
      title: 'Delete Subtask?',
      text: 'Are you sure you want to delete this subtask? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
        cancelButton: 'px-4 py-2 text-sm font-medium rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSubtask(subtask);
      }
    });
  }

  deleteSubtask(subtask: Subtask): void {
    const loadingAlert = this.showLoadingAlert('Deleting subtask...');

    this.subtaskService.deleteSubtask(subtask.id).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Subtask deleted successfully');
        // Reload the subtasks for the parent task
        const parentTask = this.tasks.find(t => t.id === subtask.parentTaskId);
        if (parentTask) {
          this.loadSubtasks(parentTask);
        }
      },
      error: (error) => {
        Swal.close();
        console.error('Error deleting subtask:', error);
        this.showErrorAlert('Failed to delete subtask', 'Please try again later.');
      }
    });
  }

  confirmApproveSubtask(subtask: Subtask): void {
    Swal.fire({
      title: 'Approve Subtask?',
      text: 'Are you sure you want to approve this subtask?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
        cancelButton: 'px-4 py-2 text-sm font-medium rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveSubtask(subtask);
      }
    });
  }

  approveSubtask(subtask: Subtask): void {
    const loadingAlert = this.showLoadingAlert('Approving subtask...');

    this.subtaskService.approveSubtask(subtask.id).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Subtask approved successfully');
        // Reload the subtasks for the parent task
        const parentTask = this.tasks.find(t => t.id === subtask.parentTaskId);
        if (parentTask) {
          this.loadSubtasks(parentTask);
        }
      },
      error: (error) => {
        Swal.close();
        console.error('Error approving subtask:', error);
        this.showErrorAlert('Failed to approve subtask', 'Please try again later.');
      }
    });
  }

  viewSubtask(subtaskId: number): void {
    this.router.navigate(['/subtasks/detail', subtaskId]);
  }

  editSubtask(subtaskId: number): void {
    this.router.navigate(['/subtasks/edit', subtaskId]);
  }

  viewTask(taskId: number): void {
    this.router.navigate(['/tasks/detail', taskId]);
  }

  editTask(taskId: number): void {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  confirmDelete(task: Task): void {
    Swal.fire({
      title: 'Delete Task?',
      text: 'Are you sure you want to delete this task and all its subtasks? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
        cancelButton: 'px-4 py-2 text-sm font-medium rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTask(task.id);
      }
    });
  }

  deleteTask(taskId: number): void {
    const loadingAlert = this.showLoadingAlert('Deleting task...');

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        Swal.close();
        this.showSuccessAlert('Task deleted successfully');
        this.loadTasks();
      },
      error: (error) => {
        Swal.close();
        console.error('Error deleting task:', error);
        this.showErrorAlert('Failed to delete task', 'Please try again later.');
      }
    });
  }

  addTask(): void {
    this.router.navigate(['/tasks/add']);
  }

  prolongSubtask(subtaskId: number): void {
    Swal.fire({
      title: 'Prolong Subtask',
      input: 'date',
      inputLabel: 'New End Date',
      inputAttributes: {
        required: 'true'
      },
      showCancelButton: true,
      confirmButtonText: 'Prolong',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
        cancelButton: 'px-4 py-2 text-sm font-medium rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newEndDate = result.value;
        const loadingAlert = this.showLoadingAlert('Prolonging subtask...');

        this.subtaskService.prolongSubtask(subtaskId, newEndDate).subscribe({
          next: () => {
            Swal.close();
            this.showSuccessAlert('Subtask prolonged successfully');
            // Find and reload the parent task's subtasks
            for (const task of this.tasks) {
              if (task.subtasks.some(s => s.id === subtaskId)) {
                this.loadSubtasks(task);
                break;
              }
            }
          },
          error: (error) => {
            Swal.close();
            let errorMessage = 'Failed to prolong subtask. Please try again later.';

            if (error.error) {
              if (typeof error.error === 'string') {
                errorMessage = error.error;
              }
              else if (error.error.message) {
                errorMessage = error.error.message;
              }
            }
            this.showErrorAlert('Error', errorMessage);
          }
        });
      }
    });
  }

  assignTaskToWorker(taskId: number): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        const userOptions = users.reduce((acc, user) => {
          if (user.id !== undefined) {
            acc[user.id] = `${user.fname} ${user.lname}`;
          }
          return acc;
        }, {} as { [key: number]: string });

        Swal.fire({
          title: 'Assign Task to Worker',
          input: 'select',
          inputOptions: userOptions,
          inputLabel: 'Select a Worker',
          inputAttributes: {
            required: 'true'
          },
          showCancelButton: true,
          confirmButtonText: 'Assign',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#16a34a',
          cancelButtonColor: '#6b7280',
          heightAuto: false,
          customClass: {
            popup: 'rounded-xl',
            confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg',
            cancelButton: 'px-4 py-2 text-sm font-medium rounded-lg'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const workerId = result.value;
            const loadingAlert = this.showLoadingAlert('Assigning task...');

            this.taskService.assignTaskToWorker(taskId, workerId).subscribe({
              next: () => {
                Swal.close();
                this.showSuccessAlert('Task assigned successfully');
                this.loadTasks();
              },
              error: (error) => {
                Swal.close();
                console.error('Error assigning task:', error);
                this.showErrorAlert('Failed to assign task', 'Please try again later.');
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.showErrorAlert('Failed to load users', 'Please try again later.');
      }
    });
  }

  private showLoadingAlert(message: string) {
    return Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl'
      }
    });
  }

  private showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer: 2000,
      showConfirmButton: false,
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl'
      }
    });
  }

  private showErrorAlert(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626',
      heightAuto: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'px-4 py-2 text-sm font-medium text-white rounded-lg'
      }
    });
  }
}
