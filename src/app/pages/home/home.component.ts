import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h1>Welcome to Pak New Alghani Travels & Tours</h1>
  `,
  styles: [`
    h1 { text-align: center; margin-top: 50px; color: #0A3D62; }
  `]
})
export class HomeComponent {}