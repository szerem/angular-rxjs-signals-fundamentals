import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SyncSelectEffectComponent } from "./sync-select-effect/sync-select-effect.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SyncSelectEffectComponent],
  template: `
    <h1>Welcome to {{title}}!</h1>
    <app-sync-select-effect>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'POCs';
}
