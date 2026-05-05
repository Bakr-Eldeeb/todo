import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase.config';
interface Task {
  id: string;
  title: string;
  userId: string;
}

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoComponent implements OnInit {
  user: User | null = null;
  newTask = '';
  tasks: Task[] = [];
  errorMessage = '';

  constructor(private router: Router) {}

  ngOnInit() {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        this.router.navigate(['/']);
        return;
      }

      this.user = currentUser;
      this.loadTasks();
    });
  }

  loadTasks() {
    if (!this.user) return;

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', this.user.uid),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      this.tasks = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Task, 'id'>)
      }));
    });
  }

  async addTask() {
     console.log("clicked"); // مهم
    if (!this.newTask.trim() || !this.user) return;

    await addDoc(collection(db, 'tasks'), {
      title: this.newTask,
      userId: this.user.uid,
      userEmail: this.user.email,
      createdAt: serverTimestamp()
    });

    this.newTask = '';
  }

  async deleteTask(taskId: string) {
    await deleteDoc(doc(db, 'tasks', taskId));
  }

  shareTask(task: Task) {
    const subject = encodeURIComponent('Shared Task');
    const body = encodeURIComponent(`Task: ${task.title}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  logout() {
    signOut(auth).then(() => {
      this.router.navigate(['/']);
    });
  }
}