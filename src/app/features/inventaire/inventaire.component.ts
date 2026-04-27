import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StockService } from '../../core/services/stock.service';
import { ActiviteService, Activite } from '../../core/services/activite.service';
import { InventaireSession, InventaireLigne } from '../../core/models/stock.model';
import { DateFrPipe } from '../../shared/pipes/date-fr.pipe';

@Component({
  selector: 'app-inventaire',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatCardModule, MatChipsModule, MatProgressBarModule, DateFrPipe,
  ],
  templateUrl: './inventaire.component.html',
  styleUrl: './inventaire.component.scss',
})
export class InventaireComponent implements OnInit {
  private stockSvc = inject(StockService);
  private activiteSvc = inject(ActiviteService);
  private snackBar = inject(MatSnackBar);

  activites = signal<Activite[]>([]);
  selectedActiviteId = signal<string>('');
  sessions = signal<InventaireSession[]>([]);
  activeSession = signal<InventaireSession | null>(null);
  loading = signal(false);

  lignesColumns = ['ingredient', 'theoriqueQty', 'realleQty', 'delta', 'actions'];
  sessionsColumns = ['date', 'statut', 'lignes', 'actions'];

  ngOnInit(): void {
    this.activiteSvc.getActivites().subscribe(a => {
      this.activites.set(a);
      if (a.length > 0) { this.selectedActiviteId.set(a[0].id); this.loadSessions(); }
    });
  }

  selectActivite(id: string): void {
    this.selectedActiviteId.set(id);
    this.activeSession.set(null);
    this.loadSessions();
  }

  loadSessions(): void {
    const id = this.selectedActiviteId();
    if (!id) return;
    this.stockSvc.getInventaires(id).subscribe(s => this.sessions.set(s));
  }

  creerSession(): void {
    const id = this.selectedActiviteId();
    if (!id) return;
    this.loading.set(true);
    this.stockSvc.createInventaireSession(id).subscribe({
      next: (session) => {
        this.snackBar.open('Session d\'inventaire créée', 'Fermer', { duration: 2000 });
        this.activeSession.set(session);
        this.loadSessions();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  ouvrirSession(session: InventaireSession): void {
    this.stockSvc.getInventaireSession(this.selectedActiviteId(), session.id).subscribe(s => this.activeSession.set(s));
  }

  updateLigne(ligne: InventaireLigne, event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    if (isNaN(val) || val < 0) return;
    this.stockSvc.updateInventaireLigne(this.selectedActiviteId(), this.activeSession()!.id, ligne.id, val).subscribe({
      next: () => {
        ligne.quantiteReelle = val;
        this.snackBar.open('Quantité mise à jour', 'Fermer', { duration: 1500 });
      },
    });
  }

  validerSession(): void {
    const s = this.activeSession();
    if (!s) return;
    if (!confirm('Valider cette session d\'inventaire ? Les écarts seront enregistrés.')) return;
    this.stockSvc.validerInventaire(this.selectedActiviteId(), s.id).subscribe({
      next: () => {
        this.snackBar.open('Inventaire validé', 'Fermer', { duration: 2000 });
        this.activeSession.set(null);
        this.loadSessions();
      },
    });
  }

  delta(ligne: InventaireLigne): number {
    return (ligne.quantiteReelle ?? 0) - (ligne.quantiteTheorique ?? 0);
  }

  deltaClass(ligne: InventaireLigne): string {
    const d = this.delta(ligne);
    if (d === 0) return '';
    return d > 0 ? 'delta-pos' : 'delta-neg';
  }

  retourListe(): void {
    this.activeSession.set(null);
  }
}
