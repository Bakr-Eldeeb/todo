import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';

interface Task {
  id?: string;
  title: string;
  createdAt: any;
}

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {

  tasks: Task[] = [];
  newTask: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  addTask() {
    if (!this.newTask.trim()) return;

    this.taskService.addTask({
      title: this.newTask,
      createdAt: new Date()
    });

    this.newTask = '';
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }
}