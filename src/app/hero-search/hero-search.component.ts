import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.scss' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
  /*Con el operador switchMap, cada evento de clave calificador puede desencadenar una llamada
  **de método. Incluso con una pausa de 300 ms entre solicitudes, podría tener varias solicitudes
  **HTTP en vuelo y es posible que no regresen en el pedido enviado.HttpClient.get()
  **switchMap() conserva el orden de solicitud original al tiempo que devuelve solo el observable
  **de la llamada al método HTTP más reciente. Los resultados de
  **las llamadas anteriores se cancelan y se descartan.*/
}