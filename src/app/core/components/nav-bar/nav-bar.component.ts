import { Component } from '@angular/core';
import { RouterLinkConfig } from '@core/models/router-link-config';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  routerLinkConfigs: RouterLinkConfig[] = [
    {
      label: 'Contacts',
      routerLink: '',
    },
    {
      label: 'About',
      routerLink: '',
    },
  ];
}
