import { Injectable, inject, signal, computed } from '@angular/core';
import { CatApiService } from '../../../core/services/cat-api.service';
import { Cat, ApiResponse, CatRaw, CatPayload } from '../../../core/models/cat.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class CatsStore {
  private readonly api = inject(CatApiService);
  private readonly snackBar = inject(MatSnackBar);

  readonly cats = signal<Cat[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredCats = computed<Cat[]>(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.cats();
    return this.cats().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  });

  readonly totalCats = computed(() => this.cats().length);

  readonly avgAge = computed(() => {
    const cats = this.cats();
    if (!cats.length) return '0';
    return (
      cats.reduce((s, c) => s + Number(c.age), 0) / cats.length
    ).toFixed(1);
  });

  readonly youngestCat = computed(() => {
    const cats = this.cats();
    if (!cats.length) return null;
    return cats.reduce((min, c) =>
      Number(c.age) < Number(min.age) ? c : min
    );
  });

  readonly oldestCat = computed(() => {
    const cats = this.cats();
    if (!cats.length) return null;
    return cats.reduce((max, c) =>
      Number(c.age) > Number(max.age) ? c : max
    );
  });

  setSearch(q: string): void {
    this.searchQuery.set(q);
  }

  loadCats(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getCats().subscribe({
      next: (res: ApiResponse<CatRaw[]>) => {
        this.cats.set(
          res.data.map((item) => ({
            id: item.id,
            name: item.info.name,
            age: item.info.age,
            description: item.info.description,
          }))
        );
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load cats.');
        this.loading.set(false);
        this.snackBar.open('😿 Something went wrong...', 'Close', {
          duration: 3000,
          panelClass: ['snack-error'],
        });
      },
    });
  }

  createCat(payload: CatPayload): void {
    this.api.createCat(payload).subscribe({
      next: () => this.loadCats(),
      error: () => {
        this.error.set('Failed to create.');
        this.snackBar.open('😿 Something went wrong...', 'Close', {
          duration: 3000,
          panelClass: ['snack-error'],
        });
      },
    });
  }

  updateCat(id: string, payload: CatPayload): void {
    this.api.updateCat(id, payload).subscribe({
      next: () =>
        this.cats.update((list) =>
          list.map((c) => (c.id === id ? { ...c, ...payload } : c))
        ),
      error: () => {
        this.error.set('Failed to update.');
        this.snackBar.open('😿 Something went wrong...', 'Close', {
          duration: 3000,
          panelClass: ['snack-error'],
        });
      },
    });
  }

  deleteCat(id: string): void {
    this.api.deleteCat(id).subscribe({
      next: () => {
        this.loadCats();
        this.snackBar.open('👋 Cat has left the universe', 'Close', {
          duration: 3000,
          panelClass: ['snack-success'],
        });
      },
      error: () => {
        this.error.set('Failed to delete.');
        this.snackBar.open('😿 Something went wrong...', 'Close', {
          duration: 3000,
          panelClass: ['snack-error'],
        });
      },
    });
  }
}
