import { Component, input } from '@angular/core';
import { ProgressSpinnerMode, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-progress-bar',
  imports: [MatProgressSpinnerModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  mode: ProgressSpinnerMode = 'determinate';
  value = input<number>(100);
  color = input<string>('#000');
  strokeWidth = input<number>();
  diameter = input<number>();
  customColor = input<string>();
}
