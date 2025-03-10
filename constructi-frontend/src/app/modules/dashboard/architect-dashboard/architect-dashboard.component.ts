import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  project: Project;
}

interface Project {
  id: number;
  name: string;
  client: string;
}

interface Invoice {
  id: number;
  project: Project;
  date: Date;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

interface Architect {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-architect-dashboard',
  standalone: false,
  templateUrl: './architect-dashboard.component.html',
  styleUrl: './architect-dashboard.component.css'
})
export class ArchitectDashboardComponent implements OnInit {
  activeTab: 'tasks' | 'invoices' | 'profile' = 'tasks';
  profileForm!: FormGroup;

  architect: Architect = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890'
  };

  tasks: Task[] = [
    {
      id: 1,
      title: 'Design Floor Plan',
      description: 'Create detailed floor plans for the new office building',
      deadline: new Date('2025-04-15'),
      status: 'In Progress',
      project: { id: 1, name: 'Office Tower', client: 'ABC Corp' }
    },
    {
      id: 2,
      title: 'Facade Design Review',
      description: 'Review and approve facade design proposals',
      deadline: new Date('2025-04-20'),
      status: 'Pending',
      project: { id: 1, name: 'Office Tower', client: 'ABC Corp' }
    },
    {
      id: 3,
      title: 'Interior Layout',
      description: 'Design interior layout for residential units',
      deadline: new Date('2025-04-10'),
      status: 'Completed',
      project: { id: 2, name: 'Riverside Residences', client: 'XYZ Developers' }
    },
    {
      id: 4,
      title: 'Material Selection',
      description: 'Select materials for lobby and common areas',
      deadline: new Date('2025-04-25'),
      status: 'Pending',
      project: { id: 2, name: 'Riverside Residences', client: 'XYZ Developers' }
    }
  ];

  invoices: Invoice[] = [
    {
      id: 101,
      project: { id: 1, name: 'Office Tower', client: 'ABC Corp' },
      date: new Date('2025-03-15'),
      amount: 5000,
      status: 'Paid'
    },
    {
      id: 102,
      project: { id: 2, name: 'Riverside Residences', client: 'XYZ Developers' },
      date: new Date('2025-03-28'),
      amount: 7500,
      status: 'Pending'
    },
    {
      id: 103,
      project: { id: 1, name: 'Office Tower', client: 'ABC Corp' },
      date: new Date('2025-02-15'),
      amount: 3000,
      status: 'Paid'
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initProfileForm();
  }

  get activeTasks(): Task[] {
    return this.tasks.filter(task => task.status !== 'Completed');
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(task => task.status === 'Completed');
  }

  get projects(): Project[] {
    // Get unique projects
    const projectIds = new Set(this.tasks.map(task => task.project.id));
    return Array.from(projectIds).map(id => {
      const task = this.tasks.find(t => t.project.id === id);
      return task ? task.project : { id: 0, name: '', client: '' };
    });
  }

  initProfileForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.architect.firstName, Validators.required],
      lastName: [this.architect.lastName, Validators.required],
      email: [this.architect.email, [Validators.required, Validators.email]],
      phone: [this.architect.phone],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]]
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      // In a real app, you would call a service to update the profile
      console.log('Profile updated:', this.profileForm.value);

      // Update local architect object
      this.architect = {
        ...this.architect,
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        phone: this.profileForm.value.phone
      };

      // Reset password fields
      this.profileForm.patchValue({
        currentPassword: '',
        newPassword: ''
      });

      // Show success message (in a real app)
      alert('Profile updated successfully!');
    }
  }
}
