import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-note-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title><mat-icon>notes</mat-icon> Note du transfert</h2>
    <mat-dialog-content>
      <p class="note-text">{{ data.note }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `,
  styles: [`.note-text { white-space: pre-wrap; font-size: 0.95rem; line-height: 1.6; min-height: 60px; }`],
})
export class NoteDialogComponent {
  data = inject<{ note: string }>(MAT_DIALOG_DATA);
}
