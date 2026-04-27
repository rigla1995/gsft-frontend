import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../core/services/product.service';
import { CatalogueService } from '../../core/services/catalogue.service';
import { ActiviteService, Activite } from '../../core/services/activite.service';
import { Product, RecetteLigne, ProductType } from '../../core/models/product.model';
import { Ingredient } from '../../core/models/catalogue.model';
import { CurrencyTndPipe } from '../../shared/pipes/currency-tnd.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTabsModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatTooltipModule,
    MatCardModule, MatDividerModule, CurrencyTndPipe,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private prodSvc = inject(ProductService);
  private catSvc = inject(CatalogueService);
  private activiteSvc = inject(ActiviteService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  activites = signal<Activite[]>([]);
  selectedActiviteId = signal<string>('');
  products = signal<Product[]>([]);
  ingredients = signal<Ingredient[]>([]);
  allProducts = signal<Product[]>([]);

  editingProduct = signal<Product | null>(null);
  showProductForm = signal(false);
  editingRecette = signal<Product | null>(null);
  recetteLignes = signal<Partial<RecetteLigne>[]>([]);

  productColumns = ['nom', 'type', 'prixVente', 'cout', 'actions'];
  recetteColumns = ['nom', 'quantite', 'cout', 'actions'];

  productTypes: { value: ProductType; label: string }[] = [
    { value: 'SELLABLE', label: 'Produit vendu' },
    { value: 'USABLE', label: 'Sous-produit / composant' },
  ];

  productForm = this.fb.group({
    nom: ['', Validators.required],
    type: ['SELLABLE' as ProductType, Validators.required],
    prixVente: [null as number | null],
  });

  recetteLigneForm = this.fb.group({
    ligneType: ['INGREDIENT' as 'INGREDIENT' | 'PRODUIT', Validators.required],
    ingredientId: [''],
    sousProduitId: [''],
    quantite: [null as number | null, [Validators.required, Validators.min(0.001)]],
  });

  ngOnInit(): void {
    this.activiteSvc.getActivites().subscribe(a => {
      this.activites.set(a);
      if (a.length > 0) { this.selectedActiviteId.set(a[0].id); this.loadProducts(); }
    });
    this.catSvc.getAllIngredients().subscribe(i => this.ingredients.set(i));
  }

  loadProducts(): void {
    this.prodSvc.getProducts(this.selectedActiviteId()).subscribe(p => {
      this.products.set(p);
      this.allProducts.set(p);
    });
  }

  openProductForm(p?: Product): void {
    this.editingProduct.set(p ?? null);
    this.productForm.reset({ nom: p?.nom ?? '', type: p?.type ?? 'SELLABLE', prixVente: p?.prixVente ?? null });
    this.showProductForm.set(true);
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;
    const v = { ...this.productForm.value, activiteId: this.selectedActiviteId() } as Partial<Product>;
    const obs = this.editingProduct() ? this.prodSvc.updateProduct(this.editingProduct()!.id, v) : this.prodSvc.createProduct(v);
    obs.subscribe({ next: () => { this.snackBar.open('Enregistré', 'Fermer', { duration: 2000 }); this.showProductForm.set(false); this.loadProducts(); } });
  }

  deleteProduct(p: Product): void {
    if (!confirm('Supprimer "' + p.nom + '" ?')) return;
    this.prodSvc.deleteProduct(p.id).subscribe({ next: () => { this.snackBar.open('Supprimé', 'Fermer', { duration: 2000 }); this.loadProducts(); } });
  }

  openRecetteEditor(p: Product): void {
    this.editingRecette.set(p);
    this.recetteLignes.set(p.recette ? [...p.recette] : []);
  }

  addRecetteLigne(): void {
    if (this.recetteLigneForm.invalid) return;
    const v = this.recetteLigneForm.value;
    const ligne: Partial<RecetteLigne> = {
      type: v.ligneType as 'INGREDIENT' | 'PRODUIT',
      ingredientId: v.ligneType === 'INGREDIENT' ? (v.ingredientId || undefined) : undefined,
      sousProduitId: v.ligneType === 'PRODUIT' ? (v.sousProduitId || undefined) : undefined,
      quantite: v.quantite as number,
    };
    this.recetteLignes.update(l => [...l, ligne]);
    this.recetteLigneForm.reset({ ligneType: 'INGREDIENT', quantite: null });
  }

  removeLigne(idx: number): void {
    this.recetteLignes.update(l => l.filter((_, i) => i !== idx));
  }

  saveRecette(): void {
    if (!this.editingRecette()) return;
    this.prodSvc.updateRecette(this.editingRecette()!.id, this.recetteLignes()).subscribe({
      next: () => { this.snackBar.open('Recette enregistrée', 'Fermer', { duration: 2000 }); this.editingRecette.set(null); this.loadProducts(); },
    });
  }

  getLigneName(l: Partial<RecetteLigne>): string {
    if (l.type === 'INGREDIENT') {
      return this.ingredients().find(i => i.id === l.ingredientId)?.name ?? '—';
    }
    return this.allProducts().find(p => p.id === l.sousProduitId)?.nom ?? '—';
  }
}
