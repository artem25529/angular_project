import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
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
export class AppliedFiltersComponent implements OnInit, AfterViewInit {
  constructor(
    private sharedDataService: SharedDataService,
    private root: ElementRef,
    private renderer: Renderer2,
  ) {}

  filters$!: Observable<AppliedFilter[]>;

  ngOnInit() {
    this.filters$ = this.sharedDataService.productFilters$.pipe(
      map((filters) => createAppliedFiltersFromProductFilters(filters!)),
    );
  }

  ngAfterViewInit() {
    this.renderer.setStyle(this.root.nativeElement, 'position', 'fixed');
  }

  handleClick(filterName: string) {
    this.sharedDataService.updateProductFilterToRemoveSubject(filterName);
  }
}
