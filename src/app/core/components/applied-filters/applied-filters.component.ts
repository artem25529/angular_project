import { Component, OnInit } from '@angular/core';
import { AppliedFilter } from '../../models/applied-filter';
import { createAppliedFiltersFromProductFilters } from '../../utils/product-filters-utils';
import { SharedDataService } from '../../services/shared-data.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-applied-filters',
  standalone: false,
  templateUrl: './applied-filters.component.html',
  styleUrl: './applied-filters.component.scss',
})
export class AppliedFiltersComponent implements OnInit {
  constructor(private sharedDataService: SharedDataService) {}

  filters$!: Observable<AppliedFilter[]>;

  ngOnInit() {
    this.filters$ = this.sharedDataService.productFilters$.pipe(
      map((filters) => createAppliedFiltersFromProductFilters(filters!)),
    );
  }

  handleClick(filterName: string) {
    this.sharedDataService.updateProductFilterToRemoveSubject(filterName);
  }
}
