import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  inject,
} from '@angular/core';
import { Cat } from '../../../../core/models/cat.model';
import { CatApiService } from '../../../../core/services/cat-api.service';

@Component({
  selector: 'app-cat-card',
  standalone: true,
  imports: [],
  templateUrl: './cat-card.html',
  styleUrl: './cat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatCard {
  private readonly api = inject(CatApiService);

  readonly cat = input.required<Cat>();
  readonly edit = output<Cat>();
  readonly delete = output<string>();

  readonly isExpanded = signal(false);
  readonly loadingDetail = signal(false);

  private readonly colors = [
    '#7C3AED',
    '#06B6D4',
    '#10B981',
    '#F59E0B',
    '#F43F5E',
    '#3B82F6',
    '#EC4899',
    '#6366F1',
  ];

  readonly avatarColor = computed(() => {
    const name = this.cat().name;
    return this.colors[name.charCodeAt(0) % 8];
  });

  readonly initial = computed(() => {
    return this.cat().name.charAt(0).toUpperCase();
  });

  toggleExpand(): void {
    const next = !this.isExpanded();
    this.isExpanded.set(next);
    if (next && this.cat().id) {
      this.loadingDetail.set(true);
      this.api.getCatById(this.cat().id!).subscribe({
        next: () => {
          this.loadingDetail.set(false);
        },
        error: () => {
          this.loadingDetail.set(false);
        },
      });
    }
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.cat());
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (this.cat().id) {
      this.delete.emit(this.cat().id!);
    }
  }
}
