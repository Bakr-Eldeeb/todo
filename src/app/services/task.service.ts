import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: Firestore) {}

  // ➕ Add Task
addTask(task: any) {
  const ref = collection(this.firestore, 'tasks');
  return addDoc(ref, task)
    .then(res => console.log("ADDED OK", res))
    .catch(err => console.log("ERROR", err));
}

  // 📥 Get Tasks (REAL TIME)
  getTasks(): Observable<any[]> {
    const ref = collection(this.firestore, 'tasks');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

  // ❌ Delete Task
  deleteTask(id: string) {
    const ref = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(ref);
  }
}