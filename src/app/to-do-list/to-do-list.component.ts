import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { auth } from '../firebase.config';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html'
})
export class ToDoListComponent implements OnInit {

  tasks: any[] = [];
  newTask = { title: '', desc: '' };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    // 🔥 REALTIME LISTENER
    this.taskService.getTasks((data) => {
      this.tasks = data;
    });
  }

  async addTask() {
    if (!this.newTask.title) return;

    await this.taskService.addTask(this.newTask);

    this.newTask = { title: '', desc: '' };
  }
   async deleteTask(id: string) {
    await this.taskService.deleteTask(id);
  }
}