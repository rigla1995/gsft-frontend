import { Injectable, inject, signal, effect } from '@angular/core';
import { ActiviteService, Activite } from './activite.service';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private activiteSvc = inject(ActiviteService);

  activites = signal<Activite[]>([]);
  currentActiviteId = signal<string>('');

  get currentActivite(): Activite | undefined {
    return this.activites().find(a => a.id === this.currentActiviteId());
  }

  init(): void {
    this.activiteSvc.getActivites().subscribe(list => {
      this.activites.set(list);
      const saved = localStorage.getItem('gsft_activite_id');
      const initial = list.find(a => a.id === saved) ?? list[0];
      if (initial) this.currentActiviteId.set(initial.id);
    });
  }

  setActivite(id: string): void {
    this.currentActiviteId.set(id);
    localStorage.setItem('gsft_activite_id', id);
  }
}
