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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StockService } from '../../core/services/stock.service';
import { ActiviteService, Activite } from '../../core/services/activite.service';
import { CatalogueService } from '../../core/services/catalogue.service';
import { StockItem, Mouvement, MouvementType, MouvementRequest, TransfertRequest } from '../../core/models/stock.model';
import { Ingredient, PaginatedResponse } from '../../core/models/catalogue.model';
import { DateFrPipe } from '../../shared/pipes/date-fr.pipe';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTabsModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatPaginatorModule,
    MatTooltipModule, MatCardModule, MatChipsModule, MatBadgeModule,
    MatDatepickerModule, MatNativeDateModule, DateFrPipe,
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent implements OnInit {
  private stockSvc = inject(StockService);
  private activiteSvc = inject(ActiviteService);
  private catSvc = inject(CatalogueService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  activites = signal<Activite[]>([]);
  selectedActiviteId = signal<string>('');
  stock = signal<StockItem[]>([]);
  mouvements = signal<Mouvement[]>([]);
  mouvementsTotal = signal(0);
  mouvementsPage = 0;
  mouvementsPageSize = 10;

  mouvementTypeFilter = signal<string>('');
  mouvementDateDebut = signal<string>('');
  mouvementDateFin = signal<string>('');

  ingredients = signal<Ingredient[]>([]);

  showMouvementForm = signal(false);
  showTransfertForm = signal(false);

  stockColumns = ['ingredient', 'categorie', 'quantite', 'seuil', 'alerte'];
  mouvColumns = ['date', 'ingredient', 'type', 'quantite', 'note'];

  mouvementTypes: { value: MouvementType; label: string }[] = [
    { value: 'ACHAT', label: 'Achat' },
    { value: 'CONSOMMATION', label: 'Consommation' },
    { value: 'AJUSTEMENT', label: 'Ajustement' },
    { value: 'TRANSFERT_IN', label: 'Transfert reçu' },
    { value: 'TRANSFERT_OUT', label: 'Transfert envoyé' },
  ];

  mouvementForm = this.fb.group({
    ingredientId: ['', Validators.required],
    type: ['ACHAT' as MouvementType, Validators.required],
    quantite: [null as number | null, [Validators.required, Validators.min(0.001)]],
    note: [''],
  });

  transfertForm = this.fb.group({
    ingredientId: ['', Validators.required],
    activiteDestId: ['', Validators.required],
    quantite: [null as number | null, [Validators.required, Validators.min(0.001)]],
    note: [''],
  });

  ngOnInit(): void {
    this.activiteSvc.getActivites().subscribe(a => {
      this.activites.set(a);
      if (a.length > 0) { this.selectedActiviteId.set(a[0].id); this.loadData(); }
    });
    this.catSvc.getAllIngredients().subscribe(i => this.ingredients.set(i));
  }

  selectActivite(id: string): void {
    this.selectedActiviteId.set(id);
    this.mouvementsPage = 0;
    this.loadData();
  }

  loadData(): void {
    const id = this.selectedActiviteId();
    if (!id) return;
    this.stockSvc.getStock(id).subscribe(s => this.stock.set(s));
    this.loadMouvements();
  }

  loadMouvements(): void {
    const id = this.selectedActiviteId();
    if (!id) return;
    this.stockSvc.getMouvements(id, {
      type: (this.mouvementTypeFilter() || undefined) as MouvementType | undefined,
      dateDebut: this.mouvementDateDebut() || undefined,
      dateFin: this.mouvementDateFin() || undefined,
      page: this.mouvementsPage,
      pageSize: this.mouvementsPageSize,
    }).subscribe((res: PaginatedResponse<Mouvement>) => {
      this.mouvements.set(res.data);
      this.mouvementsTotal.set(res.total);
    });
  }

  onMouvPage(e: PageEvent): void { this.mouvementsPage = e.pageIndex; this.mouvementsPageSize = e.pageSize; this.loadMouvements(); }

  saveMouvement(): void {
    if (this.mouvementForm.invalid) return;
    const v = this.mouvementForm.value as MouvementRequest;
    this.stockSvc.enregistrerMouvement(this.selectedActiviteId(), v).subscribe({
      next: () => {
        this.snackBar.open('Mouvement enregistré', 'Fermer', { duration: 2000 });
        this.showMouvementForm.set(false);
        this.mouvementForm.reset({ type: 'ACHAT' });
        this.loadData();
      },
    });
  }

  saveTransfert(): void {
    if (this.transfertForm.invalid) return;
    const v = this.transfertForm.value as TransfertRequest;
    this.stockSvc.transferer(v).subscribe({
      next: () => {
        this.snackBar.open('Transfert effectué', 'Fermer', { duration: 2000 });
        this.showTransfertForm.set(false);
        this.transfertForm.reset();
        this.loadData();
      },
    });
  }

  getTypeBadge(type: MouvementType): string {
    const map: Record<MouvementType, string> = {
      ACHAT: 'achat', CONSOMMATION: 'conso', AJUSTEMENT: 'ajust',
      TRANSFERT_IN: 'in', TRANSFERT_OUT: 'out',
    };
    return map[type] ?? type;
  }

  alerteCount(): number {
    return this.stock().filter(s => s.isAlerte).length;
  }
}
