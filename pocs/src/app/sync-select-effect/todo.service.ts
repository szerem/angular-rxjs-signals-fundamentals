import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { setErrorMessage } from '../utility/errorHandling';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoUrl = 'https://jsonplaceholder.typicode.com/todos';

  // Services
  private http = inject(HttpClient);

  // todos = signal<Todo[]>([]);
  errorMessage = signal('');

  private selectedMemberId = signal<number>(undefined!);
  private selectedMemberId$ = toObservable(this.selectedMemberId);

  setMemberId(memberId: number): void {
    // this.todos.set([]);
    // this.getTodos(memberId).subscribe(this.todos.set);
    this.selectedMemberId.set(memberId);
  }
  // effectSelectedMemberId = effect(() => {
  //     this.getTodos(this.selectedMemberId()).subscribe(this.todos.set);
  // });

  readonly todos$ = this.selectedMemberId$.pipe(
    filter(Boolean),
    switchMap(id => this.http.get<Todo[]>(`${this.todoUrl}?userId=${id}`)
      .pipe(
        tap(() => console.log(id)),
        map(data => data.map(t => t.title.length > 20 ? ({ ...t, title: t.title.substring(0, 20) }) : t)),
        catchError(err => {
          this.errorMessage.set(setErrorMessage(err));
          return of([])
        })
      )
    )
  );
  todos = toSignal(this.todos$)

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
