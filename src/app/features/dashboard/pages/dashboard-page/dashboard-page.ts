import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatsStore } from '../../../cats/store/cats.store';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit {
  private readonly router = inject(Router);
  protected readonly store = inject(CatsStore);

  readonly funFact = signal<string>('');

  private readonly catFacts = [
    "Cats spend 70% of their lives sleeping. 😴",
    "A cat's purr has a frequency of 25 to 150 Hertz, which can improve bone density and promote healing. 🧬",
    "Cats have five toes on their front paws, but only four on the back ones. 🐾",
    "A cat can jump up to six times its height. 🚀",
    "The oldest known pet cat was found in a 9,500-year-old grave on the Mediterranean island of Cyprus. 🏛️",
    "A group of kittens is called a kindle, and a group of cats is called a clowder. 🐈",
    "Cats can't taste sweetness. 🍬",
    "A cat's nose print is unique, much like a human's fingerprint. 👃",
    "Isaac Newton is credited with inventing the cat flap door. 🚪",
    "Cats only meow to communicate with humans, not with other cats. 🗣️"
  ];

  ngOnInit(): void {
    this.store.loadCats();
    this.funFact.set(this.catFacts[Math.floor(Math.random() * this.catFacts.length)]);
  }

  get recentCats() {
    return this.store.cats().slice(-5).reverse();
  }

  private readonly avatarColors = [
    '#7C3AED', '#06B6D4', '#10B981', '#F59E0B',
    '#F43F5E', '#3B82F6', '#EC4899', '#6366F1',
  ];

  getAvatarColor(name: string): string {
    return this.avatarColors[name.charCodeAt(0) % 8];
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  exportCsv(): void {
    const cats = this.store.cats();
    if (!cats.length) return;

    const headers = 'Name,Age,Description\n';
    const rows = cats
      .map((c) => `"${c.name}","${c.age}","${c.description.replace(/"/g, '""')}"`)
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'cat-universe-export.csv');
  }

  navigateToCats(): void {
    this.router.navigate(['/cats']);
  }
}
