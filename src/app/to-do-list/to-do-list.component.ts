import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { auth } from '../firebase.config';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {

  tasks: any[] = [];
  newTask = { title: '', desc: '' };

  constructor(private taskService: TaskService) {}

private unsubscribe: (() => void) | null = null;

ngOnInit() {
  this.unsubscribe = this.taskService.getTasks((tasks) => {
    console.log("snapshot fired"); // debug
    this.tasks = tasks;
  });
}

ngOnDestroy() {
  if (this.unsubscribe) {
    this.unsubscribe();
    this.unsubscribe = null;
  }
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