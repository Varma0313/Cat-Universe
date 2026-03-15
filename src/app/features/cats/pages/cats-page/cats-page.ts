import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatsStore } from '../../store/cats.store';
import { CatCard } from '../../components/cat-card/cat-card';
import { CatDialog } from '../../components/cat-dialog/cat-dialog';
import { Cat } from '../../../../core/models/cat.model';

@Component({
  selector: 'app-cats-page',
  standalone: true,
  imports: [CatCard],
  templateUrl: './cats-page.html',
  styleUrl: './cats-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatsPage implements OnInit {
  private readonly dialog = inject(MatDialog);
  protected readonly store = inject(CatsStore);

  ngOnInit(): void {
    if (!this.store.cats().length) {
      this.store.loadCats();
    }
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.setSearch(value);
  }

  clearSearch(): void {
    this.store.setSearch('');
  }

  onEditCat(cat: Cat): void {
    this.dialog.open(CatDialog, {
      data: cat,
      panelClass: 'dark-dialog',
    });
  }

  onDeleteCat(id: string): void {
    this.store.deleteCat(id);
  }

  openAddDialog(): void {
    this.dialog.open(CatDialog, {
      data: null,
      panelClass: 'dark-dialog',
    });
  }

  retry(): void {
    this.store.loadCats();
  }
}
