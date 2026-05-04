import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from './../services/data.service';  // ← Adjust path if needed

interface Task {
  id: number;
  title: string;
  desc: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'inprogress' | 'done';
  owner: string;      
  sharedWith: string[]; 
  created: Date;
}

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {

  userName: string = '';
  userEmail: string = '';
  tasks: Task[] = []; 

  newTask: any = { title: '', desc: '', priority: 'medium' };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    const user = this.dataService.getCurrentUser();
    if (user) {
      this.userName = user.name || 'Guest';
      this.userEmail = user.email || '';
    }

    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.dataService.getAllTasks();
  }

  // Main getter used by template
  get myVisibleTasks() {
    return this.dataService.getVisibleTasksForUser(this.userEmail);
  }

  get todoTasks() { 
    return this.myVisibleTasks.filter((t: Task) => t.status === 'todo'); 
  }

  get inProgressTasks() { 
    return this.myVisibleTasks.filter((t: Task) => t.status === 'inprogress'); 
  }

  get doneTasks() { 
    return this.myVisibleTasks.filter((t: Task) => t.status === 'done'); 
  }

  addTask() {
    if (!this.newTask.title.trim() || !this.userEmail) return;

    const taskToAdd: Task = {
      id: Date.now(),
      title: this.newTask.title,
      desc: this.newTask.desc || '',
      priority: this.newTask.priority,
      status: 'todo',
      owner: this.userEmail,
      sharedWith: [],
      created: new Date()
    };

    this.dataService.addTask(taskToAdd);
    this.loadTasks();
    this.resetForm();
  }

  shareTask(task: Task, friendEmail: string) {
    if (!friendEmail || friendEmail === this.userEmail) return;

    const success = this.dataService.shareTask(task.id, friendEmail.trim());
    if (success) {
      alert(`✅ Shared successfully with ${friendEmail}`);
      this.loadTasks();
    } else {
      alert('Failed to share or already shared');
    }
  }

  moveTask(task: Task, status: 'todo' | 'inprogress' | 'done') {
    this.dataService.updateTaskStatus(task.id, status);
    this.loadTasks();
  }

  deleteTask(id: number) {
    this.dataService.deleteTask(id);
    this.loadTasks();
  }

  resetForm() {
    this.newTask = { title: '', desc: '', priority: 'medium' };
  }
}