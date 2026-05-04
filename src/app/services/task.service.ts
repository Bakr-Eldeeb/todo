import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, deleteDoc, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { db, auth } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: Firestore) {}

  // ➕ Add Task
 async addTask(task: any) {
    const user = auth.currentUser;

    await addDoc(collection(db, "tasks"), {
      title: task.title,
      desc: task.desc || "",
      status: "todo",

      // 🔥 أهم حاجة
      ownerId: user?.uid,
      ownerEmail: user?.email,

      createdAt: new Date()
    });
  }

  // 📥 Get Tasks (REAL TIME)
  getTasks(callback: (tasks: any[]) => void) {
    const ref = collection(db, "tasks");

    onSnapshot(ref, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      callback(tasks);
    });
  }

  // ❌ Delete Task
  deleteTask(id: string) {
    const ref = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(ref);
  }
}