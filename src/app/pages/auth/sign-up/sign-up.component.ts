import { Component, HostBinding, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/*';
import { BlankLayoutCardComponent } from 'app/components/blank-layout-card';

@Component({
  selector: 'app-sign-up',
  styleUrls: ['../../../components/blank-layout-card/blank-layout-card.component.scss'],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent extends BlankLayoutCardComponent implements OnInit {
  public registerForm: FormGroup;
  private email;
  private name;
  private password;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {
    super();

    this.registerForm = this.fb.group({
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
        Validators.maxLength(20),
      ]),
    });
    this.email = this.registerForm.get('email');
    this.password = this.registerForm.get('password');
    this.name = this.registerForm.get('name');
  }

  public ngOnInit() {
    this.authService.logout();
    this.registerForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  public register() {
    this.error = null;
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.getRawValue())
        .subscribe(
          res => this.router.navigate(['/auth/login']),
          error => this.error = error.error.message,
        );
    }
  }

  public onInputChange(event) {
    event.target.required = true;
  }
}
