import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private userUrl = "https://jsonplaceholder.typicode.com/users";
  private http = inject(HttpClient);

  // Retrieve team members
  // Read-only data
  members = toSignal(this.http.get<User[]>(this.userUrl).pipe(tap(console.log)), { initialValue: [] });

}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string;
}

