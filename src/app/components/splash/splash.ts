import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash.html',
  styleUrls: ['./splash.scss']
})
export class SplashComponent {
  // Parent (AppComponent) controls the hiding state
  @Input() hiding = false;
}