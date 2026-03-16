import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  email = '';
  runwayDashes = Array(30).fill(0);

  onSubmit() {
    if (this.email) {
      alert(`Thank you! We'll be in touch at ${this.email}`);
      this.email = '';
    }
  }
}