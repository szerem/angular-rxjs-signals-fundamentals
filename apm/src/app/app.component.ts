//import 'zone.js/dist/zone';  // Required for Stackblitz
import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { concatMap, delay, mergeMap, of, range, switchMap, tap } from 'rxjs';

@Component({
  selector: 'pm-root',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Just enough here for the template to compile
  pageTitle = 'Acme Product Management';

  cartCount = 0;

  ngOnInit(): void {

    // sekwencyjnie
    // jak sztafeta
    range(0, 5).pipe(
      // tap(x => console.log(`c ${x} begin`)),
      concatMap(i => of(i).pipe(
        // tap(x => console.log(`cc ${x} begin`)),
        delay(this.randomDaley()),
        // tap(x => console.log(`cc ${x} end`)),
      )),
      // tap(x => console.log(`c ${x} end`)),
    ).subscribe(v => console.log('concatMap', v))

    // rownolegle
    // wyścig
    range(11, 5).pipe(
      // tap(x => console.log(`m ${x} begin`)),
      mergeMap(i => of(i).pipe(
        // tap(x => console.log(`mm ${x} begin`)),
        delay(this.randomDaley()),
        // tap(x => console.log(`mm ${x} end`)),
      )),
      // tap(x => console.log(`m ${x} end`)),
    ).subscribe(v => console.log('mergeMap', v))

    // po kolei i zwroci ostatni
    // podmiana zawsze ostatni jest emitowany
    range(21, 5).pipe(
      // tap(x => console.log(`s ${x} begin`)),
      switchMap(i => of(i).pipe(
        // tap(x => console.log(`ss ${x} begin`)),
        delay(this.randomDaley()),
        // tap(x => console.log(`ss ${x} end`)),
      )),
      // tap(x => console.log(`s ${x} end`)),
    ).subscribe(v => console.log('switchMap', v))

  }


  randomDaley() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
