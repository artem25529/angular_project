import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../core/services/validation.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { SharedDataService } from '../../core/services/shared-data.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private sharedDataService: SharedDataService,
  ) {}

  authForm!: FormGroup;
  paramsSubscription!: Subscription;
  isSignup: boolean = false;

  ngOnInit() {
    this.initForm();
    this.initSubscriptions();
  }

  initForm() {
    this.authForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      },
      {
        updateOn: 'blur',
      },
    );
  }

  initSubscriptions() {
    this.paramsSubscription = this.activatedRoute.queryParams.subscribe((params) => {
      this.isSignup = !!params['signup'];

      this.authForm.reset({
        email: '',
        password: '',
      });

      if (this.isSignup) {
        this.authForm.clearAsyncValidators();
        this.authForm.get('email')!.setAsyncValidators([this.validationService.signupValidator()]);
      } else {
        this.authForm.get('email')!.clearAsyncValidators();
        this.authForm.setAsyncValidators([this.validationService.loginValidator()]);
      }
    });
  }

  handleSubmit() {
    this.authForm.markAllAsTouched();

    if (this.authForm.valid) {
      if (this.isSignup) {
        this.authService.signup(this.authForm.value);
      } else {
        this.authService.login(this.sharedDataService.lastValidatedUser!);
      }
    }
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
