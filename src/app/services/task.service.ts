import { Injectable } from '@angular/core';
import { db } from '../firebase.config';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private unsubscribeFn: (() => void) | null = null;

  // ➕ Add Task
  addTask(task: any) {
    const tasksRef = collection(db, 'tasks');
    return addDoc(tasksRef, task);
  }

  // 📥 Get Tasks (REAL TIME)
getTasks(callback: (tasks: any[]) => void) {
  const ref = collection(db, "tasks");

  // اقفل القديم لو موجود
  if (this.unsubscribeFn) {
    this.unsubscribeFn();
  }

  this.unsubscribeFn = onSnapshot(ref, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(tasks);
  });

  return this.unsubscribeFn;
}
  // ❌ Delete Task
  deleteTask(id: string) {
    const ref = doc(db, `tasks/${id}`);
    return deleteDoc(ref);
  }
}