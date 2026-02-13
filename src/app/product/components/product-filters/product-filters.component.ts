import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, first, filter, Observable } from 'rxjs';
import { isEqual } from 'lodash';
import { SharedDataService } from '@core/services/shared-data.service';
import { ValidationService } from '@core/services/validation.service';
import { getDefaultValue } from '@core/utils/product-filters-utils';
import { ProductFiltersForm } from '@product/models/product-filters-form';

@Component({
  selector: 'app-product-filters',
  standalone: false,
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss',
})
export class ProductFiltersComponent implements OnInit, AfterViewInit {
  constructor(
    private sharedDataService: SharedDataService,
    private validationService: ValidationService,
    private root: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
  ) {}

  private defaultFiltersFormValue!: ProductFiltersForm;
  foundProductAmount$!: Observable<number | undefined>;
  filtersForm!: FormGroup;
  showRemoveAllFiltersButton = signal(false);

  ngOnInit() {
    this.initForm();
    this.initSubscritions();
  }

  ngAfterViewInit() {
    this.setStickyPosition();
  }

  resetForm() {
    this.filtersForm.reset(this.defaultFiltersFormValue);
  }

  initForm() {
    this.filtersForm = this.fb.group({
      rating: this.fb.array([0, 0]),
      price: this.fb.array(['', '']),
      hasReviews: [false],
      inStock: [false],
    });

    this.defaultFiltersFormValue = this.filtersForm.value;

    this.filtersForm.valueChanges.pipe(debounceTime(100)).subscribe((value: ProductFiltersForm) => {
      this.showRemoveAllFiltersButton.set(!isEqual(this.defaultFiltersFormValue, value));
      this.sharedDataService.updateProductFiltersSubject(
        this.validationService.createProductFilters(value),
      );
    });
  }

  initSubscritions() {
    this.sharedDataService.productFilters$
      .pipe(
        filter((value) => value !== undefined && value !== null),
        first(),
      )
      .subscribe((productFilters) => {
        const value =
          this.validationService.createProductFiltersFormFromProductFilters(productFilters);
        this.filtersForm.patchValue(value, { emitEvent: false });
        this.showRemoveAllFiltersButton.set(!isEqual(this.defaultFiltersFormValue, value));
      });

    this.sharedDataService.productFilterToRemove$.subscribe((filter) => {
      const control = this.filtersForm.get(filter)!;
      control.reset(getDefaultValue(typeof control.value));
    });

    this.foundProductAmount$ = this.sharedDataService.foundProductAmonut$;
  }

  setStickyPosition() {
    this.renderer.setStyle(
      this.root.nativeElement,
      'top',
      `${this.root.nativeElement.offsetTop}px`,
    );
  }
}
