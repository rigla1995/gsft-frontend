import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActiviteService, Activite } from '../../core/services/activite.service';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule,
    MatChipsModule, MatDividerModule, MatProgressSpinnerModule,
  ],
  templateUrl: './activites.component.html',
  styleUrl: './activites.component.scss',
})
export class ActivitesComponent implements OnInit {
  private svc = inject(ActiviteService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  activites = signal<Activite[]>([]);
  loading = signal(false);
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    type: ['DISTINCTE' as 'FRANCHISE' | 'DISTINCTE' | 'LABO', Validators.required],
  });

  columns = ['nom', 'type', 'statut', 'actions'];

  types: { value: 'FRANCHISE' | 'DISTINCTE' | 'LABO'; label: string }[] = [
    { value: 'FRANCHISE', label: 'Franchise' },
    { value: 'DISTINCTE', label: 'Distincte' },
    { value: 'LABO', label: 'Laboratoire' },
  ];

  get franchise() { return this.activites().filter(a => a.type === 'FRANCHISE'); }
  get distinctes() { return this.activites().filter(a => a.type === 'DISTINCTE'); }
  get labos() { return this.activites().filter(a => a.type === 'LABO'); }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.svc.getActivites().subscribe({
      next: list => { this.activites.set(list); this.loading.set(false); },
      error: () => { this.snackBar.open('Erreur chargement activités', 'Fermer', { duration: 3000 }); this.loading.set(false); },
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({ nom: '', type: 'DISTINCTE' });
    this.showForm.set(true);
  }

  openEdit(a: Activite): void {
    this.editingId.set(a.id);
    this.form.reset({ nom: a.nom, type: a.type });
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  submit(): void {
    if (this.form.invalid) return;
    const { nom, type } = this.form.getRawValue();
    const id = this.editingId();
    const op = id
      ? this.svc.updateActivite(id, { nom, type })
      : this.svc.createActivite({ nom, type });

    op.subscribe({
      next: () => {
        this.snackBar.open(id ? 'Activité mise à jour' : 'Activité créée', 'OK', { duration: 3000 });
        this.cancelForm();
        this.load();
      },
      error: () => this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 }),
    });
  }

  delete(a: Activite): void {
    if (!confirm(`Supprimer l'activité « ${a.nom} » ?`)) return;
    this.svc.deleteActivite(a.id).subscribe({
      next: () => {
        this.snackBar.open('Activité supprimée', 'OK', { duration: 3000 });
        this.load();
      },
      error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 }),
    });
  }

  typeLabel(type: string): string {
    return this.types.find(t => t.value === type)?.label ?? type;
  }

  typeColor(type: string): 'primary' | 'accent' | '' {
    return type === 'FRANCHISE' ? 'primary' : type === 'LABO' ? 'accent' : '';
  }
}
