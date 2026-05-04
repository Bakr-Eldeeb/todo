import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';           // ← Added

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private registeredUsers = [
    { name: 'Mohammed', email: 'medo14274@gmail.com', password: 'Mohammed@14274' },
    { name: 'Bakr', email: 'Bakrmahmoud@gmail.com', password: '123' },
    { name: 'Mahmoud', email: 'mahmoudshabana@gmail.com', password: '1234' }
  ];

  private currentUser: any = null;

  constructor() { 
    if (!localStorage.getItem('allTasks')) {
      localStorage.setItem('allTasks', JSON.stringify([]));
    }
  }

  // ====================== AUTH METHODS ======================

  addUser(user: any): Observable<any> {
    // Check if email already exists
    if (this.isUserRegistered(user.email)) {
      return of({ success: false, message: 'Email already registered' });
    }

    // Add the new user
    this.registeredUsers.push({
      name: `${user.firstName} ${user.secondName}`,
      email: user.email,
      password: user.password
    });

    console.log('✅ New User Added:', user);
    return of({ 
      success: true, 
      message: 'User registered successfully',
      user 
    });
  }

  isUserRegistered(email: string): boolean {
    return this.registeredUsers.some(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
  }

  validateCredentials(email: string, pass: string): boolean {
    return this.registeredUsers.some(user => 
      user.email.toLowerCase() === email.toLowerCase() && user.password === pass
    );
  }

  getUserByEmail(email: string) {
    return this.registeredUsers.find(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    }
    return this.currentUser;
  }

  // ====================== TASK METHODS ======================

  getAllTasks(): any[] {
    const tasks = localStorage.getItem('allTasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  saveAllTasks(tasks: any[]) {
    localStorage.setItem('allTasks', JSON.stringify(tasks));
  }

  getVisibleTasksForUser(email: string): any[] {
    const allTasks = this.getAllTasks();
    return allTasks.filter(task => 
      task.owner === email || (task.sharedWith && task.sharedWith.includes(email))
    );
  }

  addTask(task: any) {
    const allTasks = this.getAllTasks();
    allTasks.push(task);
    this.saveAllTasks(allTasks);
    return task;
  }

  shareTask(taskId: number, friendEmail: string): boolean {
    const allTasks = this.getAllTasks();
    const task = allTasks.find(t => t.id === taskId);
    
    if (task && friendEmail && !task.sharedWith?.includes(friendEmail)) {
      if (!task.sharedWith) task.sharedWith = [];
      task.sharedWith.push(friendEmail);
      this.saveAllTasks(allTasks);
      return true;
    }
    return false;
  }

  updateTaskStatus(taskId: number, newStatus: string) {
    const allTasks = this.getAllTasks();
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      this.saveAllTasks(allTasks);
    }
  }

  deleteTask(taskId: number) {
    let allTasks = this.getAllTasks();
    allTasks = allTasks.filter(t => t.id !== taskId);
    this.saveAllTasks(allTasks);
  }
}