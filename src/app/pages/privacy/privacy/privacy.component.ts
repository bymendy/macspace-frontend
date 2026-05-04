import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {

  constructor(
    private router: Router,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToLanding(): void {
    this.router.navigate(['/landing']);
  }
}