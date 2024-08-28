import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { setErrorMessage } from '../utility/errorHandling';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoUrl = 'https://jsonplaceholder.typicode.com/todos';

  // Services
  private http = inject(HttpClient);
  // private destroyRef = inject(DestroyRef);

  todos = signal<Todo[]>([]);
  errorMessage = signal('');

  selectedMemberId = signal<number>(undefined!);
  setMemberId(memberId: number): void {
    this.todos.set([]);
    // this.getTodos(memberId).subscribe(this.todos.set);
    this.selectedMemberId.set(memberId);
  }
  effectSelectedMemberId = effect(() => {
      this.getTodos(this.selectedMemberId()).subscribe(this.todos.set);
  });

  private getTodos(id: number): Observable<Todo[]> {
    const todoUrl = `${this.todoUrl}?userId=${id}`;
    console.log(todoUrl);
    return this.http.get<Todo[]>(todoUrl).pipe(
      map(data => data.map(t => t.title.length > 20 ? ({ ...t, title: t.title.substring(0, 20) }) : t)),
      catchError(err => {
        this.errorMessage.set(setErrorMessage(err)); 
        return of([])
      })
    )
  }
}


export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
