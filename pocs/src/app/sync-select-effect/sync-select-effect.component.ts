import { Component, inject } from '@angular/core';
import { UserService } from './user.service';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-sync-select-effect',
  standalone: true,
  imports: [],
  templateUrl: 'sync-select-effect.component.html'
})
export class SyncSelectEffectComponent {
  pageTitle = 'Team Members and Tasks';

  // Services
  userService = inject(UserService);
  todoService = inject(TodoService);

  // User Signals  
  members = this.userService.members;

  // Todo Signals
  todosForMember = this.todoService.todos;
  errorMessage = this.todoService.errorMessage;


  onSelectedMember(event: EventTarget | null): void {
    const memberId = Number((event as HTMLSelectElement)?.value)
    this.todoService.setMemberId(memberId)
  }

  onSelectedTask(a: any): void {
    console.log(a);
  }

}
