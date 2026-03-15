import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cat, CatPayload } from '../../../../core/models/cat.model';
import { CatsStore } from '../../store/cats.store';

@Component({
  selector: 'app-cat-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './cat-dialog.html',
  styleUrl: './cat-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CatDialog>);
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(CatsStore);
  readonly data = inject<Cat | null>(MAT_DIALOG_DATA);

  readonly isEditMode = computed(() => !!this.data?.id);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: [
      this.data?.name ?? '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(25)],
    ],
    age: [
      this.data?.age ?? '',
      [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1), Validators.max(30)],
    ],
    description: [
      this.data?.description ?? '',
      [Validators.required, Validators.minLength(2)],
    ],
  });

  get nameLength(): number {
    return (this.form.controls.name.value ?? '').length;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const payload: CatPayload = {
      name: this.form.controls.name.value,
      age: this.form.controls.age.value,
      description: this.form.controls.description.value,
    };

    if (this.isEditMode() && this.data?.id) {
      this.store.updateCat(this.data.id, payload);
      this.snackBar.open(`✨ ${payload.name} has been updated!`, 'Close', {
        duration: 3000,
        panelClass: ['snack-success'],
      });
    } else {
      this.store.createCat(payload);
      this.snackBar.open(`🐱 ${payload.name} has joined the universe!`, 'Close', {
        duration: 3000,
        panelClass: ['snack-success'],
      });
    }

    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
