import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, combineLatest, Subscription, shareReplay, catchError } from 'rxjs';
import { SharedDataService } from '@core/services/shared-data.service';
import { ValidationService } from '@core/services/validation.service';
import { ProductService } from '@product/services/product.service';
import { Product } from '@product/models/product';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private sharedDataService: SharedDataService,
    private validationService: ValidationService,
  ) {}

  private foundProductAmonutSubscription!: Subscription;
  products$!: Observable<Product[]>;

  ngOnInit() {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    this.sharedDataService.updateHeaderInputSubject(queryParams['query'] ?? '');
    this.sharedDataService.updateProductFiltersSubject(
      this.validationService.createProductFiltersFromParams(queryParams),
    );

    this.products$ = combineLatest([
      this.sharedDataService.headerInput$,
      this.sharedDataService.productFilters$,
    ]).pipe(
      switchMap(([query, productFilters]) => this.productService.getAll(query, productFilters)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.foundProductAmonutSubscription = this.products$.subscribe((products) =>
      this.sharedDataService.updateFoundProductAmonutSubject(products.length),
    );
  }

  ngOnDestroy() {
    this.foundProductAmonutSubscription.unsubscribe();
  }
}
