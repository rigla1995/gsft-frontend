import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../core/services/product.service';
import { ActiviteService, Activite } from '../../core/services/activite.service';
import { Product } from '../../core/models/product.model';
import { FicheTechnique, FicheTechniqueLigne } from '../../core/models/product.model';
import { CurrencyTndPipe } from '../../shared/pipes/currency-tnd.pipe';

@Component({
  selector: 'app-technical-sheets',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatTooltipModule,
    MatCardModule, MatTableModule, MatDividerModule, CurrencyTndPipe,
  ],
  templateUrl: './technical-sheets.component.html',
  styleUrl: './technical-sheets.component.scss',
})
export class TechnicalSheetsComponent implements OnInit {
  private prodSvc = inject(ProductService);
  private activiteSvc = inject(ActiviteService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  activites = signal<Activite[]>([]);
  selectedActiviteId = signal<string>('');
  products = signal<Product[]>([]);
  selectedProductId = signal<string>('');
  fiche = signal<FicheTechnique | null>(null);
  loading = signal(false);
  modeManuel = signal(false);
  overrideValues = signal<Record<string, number | null>>({});

  ficheColumns = ['ingredient', 'quantite', 'prixUnitaire', 'prixOverride', 'prixEffectif', 'cout'];

  ngOnInit(): void {
    this.activiteSvc.getActivites().subscribe(a => {
      this.activites.set(a);
      if (a.length > 0) { this.selectedActiviteId.set(a[0].id); this.loadProducts(); }
    });
  }

  loadProducts(): void {
    this.prodSvc.getProducts(this.selectedActiviteId()).subscribe(p => this.products.set(p));
  }

  loadFiche(): void {
    const prodId = this.selectedProductId();
    if (!prodId) return;
    this.loading.set(true);
    this.overrideValues.set({});
    this.prodSvc.getFicheTechnique(prodId).subscribe({
      next: f => { this.fiche.set(f); this.loading.set(false); },
      error: () => { this.loading.set(false); this.snackBar.open('Erreur chargement fiche', 'Fermer', { duration: 3000, panelClass: 'snack-error' }); },
    });
  }

  toggleManuel(): void {
    this.modeManuel.update(v => !v);
    if (!this.modeManuel()) this.overrideValues.set({});
  }

  setOverride(ingredientId: string, val: string): void {
    const num = val ? parseFloat(val) : null;
    this.overrideValues.update(v => ({ ...v, [ingredientId]: num }));
  }

  saveOverride(ligne: FicheTechniqueLigne): void {
    const prix = this.overrideValues()[ligne.ingredientId] ?? null;
    this.prodSvc.overridePrixIngredient(this.selectedProductId(), ligne.ingredientId, prix).subscribe({
      next: () => { this.snackBar.open('Prix mis à jour', 'Fermer', { duration: 2000 }); this.loadFiche(); },
    });
  }

  exportExcel(): void {
    const prodId = this.selectedProductId();
    if (!prodId) return;
    this.prodSvc.exportFicheTechniqueExcel(prodId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const prodNom = this.products().find(p => p.id === prodId)?.nom ?? 'fiche';
        a.download = `fiche-technique-${prodNom}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.snackBar.open('Erreur export', 'Fermer', { duration: 3000, panelClass: 'snack-error' }),
    });
  }

  getPrixEffectif(ligne: FicheTechniqueLigne): number {
    const override = this.overrideValues()[ligne.ingredientId];
    return override != null ? override : (ligne.prixOverride ?? ligne.prixUnitaire);
  }

  getCoutLigne(ligne: FicheTechniqueLigne): number {
    return this.getPrixEffectif(ligne) * ligne.quantite;
  }

  getTotalCout(): number {
    return this.fiche()?.lignes.reduce((s, l) => s + this.getCoutLigne(l), 0) ?? 0;
  }

  getMargePercent(): number {
    const fiche = this.fiche();
    if (!fiche?.produit.prixVente || !this.getTotalCout()) return 0;
    return ((fiche.produit.prixVente - this.getTotalCout()) / fiche.produit.prixVente) * 100;
  }
}
