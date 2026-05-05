import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { auth, db } from '../firebase.config';

interface Task {
  id: string;
  title: string;
  userId: string;
  userEmail: string;
  sharedWith: string[];
  createdAt?: any;
}

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoComponent implements OnInit {
  user: User | null = null;
  newTask = '';
  tasks: Task[] = [];

  private ownTasks: Task[] = [];
  private sharedTasks: Task[] = [];

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
    if (!this.user || !this.user.email) return;

    const ownQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', this.user.uid)
    );

    const sharedQuery = query(
      collection(db, 'tasks'),
      where('sharedWith', 'array-contains', this.user.email)
    );

    onSnapshot(ownQuery, (snapshot) => {
      this.ownTasks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Task, 'id'>)
      }));

      this.mergeTasks();
    });

    onSnapshot(sharedQuery, (snapshot) => {
      this.sharedTasks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Task, 'id'>)
      }));

      this.mergeTasks();
    });
  }

  mergeTasks() {
  const allTasks = [...this.ownTasks, ...this.sharedTasks];

  this.tasks = allTasks
    .map(task => ({
      ...task,
      sharedWith: task.sharedWith || []
    }))
    .filter(
      (task, index, self) =>
        index === self.findIndex((t) => t.id === task.id)
    );
}

  async addTask() {
    if (!this.newTask.trim() || !this.user || !this.user.email) return;

    await addDoc(collection(db, 'tasks'), {
      title: this.newTask.trim(),
      userId: this.user.uid,
      userEmail: this.user.email,
      sharedWith: [],
      createdAt: serverTimestamp()
    });

    this.newTask = '';
  }

  async deleteTask(task: Task) {
    if (!this.user) return;

    if (task.userId !== this.user.uid) {
      alert('You cannot delete a shared task');
      return;
    }

    await deleteDoc(doc(db, 'tasks', task.id));
  }

  async shareTask(task: Task) {
    if (!this.user) return;

    if (task.userId !== this.user.uid) {
      alert('Only the task owner can share this task');
      return;
    }

    const email = prompt('Enter user email to share this task with:');

    if (!email || !email.trim()) return;

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === this.user.email) {
      alert('You cannot share the task with yourself');
      return;
    }

    const taskRef = doc(db, 'tasks', task.id);

    await updateDoc(taskRef, {
      sharedWith: arrayUnion(cleanEmail)
    });

    alert('Task shared successfully');
  }

  logout() {
    signOut(auth).then(() => {
      this.router.navigate(['/']);
    });
  }
}