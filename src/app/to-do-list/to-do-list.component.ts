import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { addDoc, collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { CommonModule } from '@angular/common';

interface Task {
  id?: string;
  title: string;
  ownerId: string;
  createdAt: any;
}

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html'
})
export class ToDoListComponent implements OnInit {

  tasks: Task[] = [];

  form = new FormGroup({
    title: new FormControl('')
  });

  ngOnInit() {
    this.listenToTasks();
  }

  listenToTasks() {
    onSnapshot(collection(db, "tasks"), (snapshot) => {
      const user = auth.currentUser;

      this.tasks = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task))
        .filter(t => t.ownerId === user?.uid); // 👈 كل user يشوف بتاعه بس
    });
  }

  async addTask() {
    const user = auth.currentUser;

    if (!this.form.value.title) return;

    await addDoc(collection(db, "tasks"), {
      title: this.form.value.title,
      
      ownerId: user?.uid,
      createdAt: new Date()
    });

    this.form.reset();
  }

  async deleteTask(id: string) {
    await deleteDoc(doc(db, "tasks", id));
  }
}