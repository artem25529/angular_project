import { Component, Input } from '@angular/core';
import { Review } from '@product/models/review';

@Component({
  selector: 'app-review',
  standalone: false,
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
})
export class ReviewComponent {
  @Input() review!: Review;
}
