import { Component, output, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { AppConstant } from '../../../../core/constants/constant';
import { Dictionary } from '../../../../shared/models/dictionary.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DateRange } from '../../../../shared/models/filter/date-range.modal';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-filter-dropdown',
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './filter-dropdown.component.html',
  styleUrl: './filter-dropdown.component.scss',
  providers: [provideNativeDateAdapter()],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          display: 'block',
          opacity: 1
        }),
      ),
      state(
        'closed',
        style({
          display: 'none',
          opacity: 0
        }),
      ),
      transition('open => closed', [animate('.1s')]),
      transition('closed => open', [animate('.3s')])
    ]),
    trigger('backdrop', [
      state(
        'open',
        style({
          display: 'block',
        }),
      ),
      state(
        'closed',
        style({
          display: 'none',
        }),
      ),
    ])
  ]
})
export class FilterDropdownComponent {
  priorityStoredKey = AppConstant.PRIORITY_STORING_KEY;

  isOpenned = signal<boolean>(false);

  //PRIORITY FILTER
  priorities: Dictionary[] = [];
  selectedPriorities!: FormControl;
  selectedPrio = output<string[]>();

  //CREATED DATE RANGE
  createdDateRangeForm!: FormGroup;
  selectedCreatedRange = output<DateRange | undefined>();

  //EXPIRED DATE RANGE
  expiredDateRangeForm!: FormGroup;
  selectedExpiredRange = output<DateRange | undefined>();

  constructor() {
    this.getPriorities();
    this.initFormValue();
  }

  initFormValue() {
    this.selectedPriorities = new FormControl('');
    this.createdDateRangeForm = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null)
    });
    this.expiredDateRangeForm = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null)
    });
  }

  handleChangePrioritySelection(e: MatSelectChange) {
    this.selectedPrio.emit(e.value);
  }

  handleCreatedDateChange() {
    if (this.createdDateRangeForm.valid) {
      const rangeValue = this.createdDateRangeForm.value;
      this.selectedCreatedRange.emit({ start: rangeValue.start!, end: rangeValue.end! });
    }
  }

  handleExpiredDateChange() {
    if (this.expiredDateRangeForm.valid) {
      const rangeValue = this.expiredDateRangeForm.value;
      this.selectedExpiredRange.emit({ start: rangeValue.start!, end: rangeValue.end! });
    }
  }

  getPriorities(): void {
    const prioJson = localStorage.getItem(this.priorityStoredKey);
    if (prioJson) {
      const priorities = JSON.parse(prioJson);
      this.priorities = priorities;
    }
  }

  //DROPDOWN FEATURE
  toggleDropdown() {
    this.isOpenned.set(!this.isOpenned());
  }

  handleClearFilter() {
    this.initFormValue();
    this.selectedPrio.emit([]);
    this.selectedCreatedRange.emit(undefined);
    this.selectedExpiredRange.emit(undefined);
  }
}
