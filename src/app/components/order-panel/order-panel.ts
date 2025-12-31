import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderPanelData, OrderFormResult } from '../../services/order-panel.service';
import { DateUtilsService } from '../../services/date-utils.service';
import { WorkOrderStatus } from '../../models';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WorkOrderService } from '../../services/work-order.service';

interface StatusOptions {
    value: WorkOrderStatus;
    label: string;
}

@Component({
    selector: 'app-order-offcanvas',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgSelectModule, NgbDatepickerModule],
    templateUrl: './order-panel.html',
    styleUrl: './order-panel.scss',
})
export class OrderPanel implements OnInit {
    @Input() data!: OrderPanelData;

    private workOrderService = inject(WorkOrderService);
    private activeOffcanvas = inject(NgbActiveOffcanvas);
    private fb = inject(FormBuilder);
    private dateUtils = inject(DateUtilsService);

    orderForm!: FormGroup;
    errorMessage = '';

    statusOptions: StatusOptions[] = [
        { value: 'open', label: 'Open' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'complete', label: 'Complete' },
        { value: 'blocked', label: 'Blocked' }
    ];

    // Convert Date to NgbDateStruct
    private dateToNgbDateStruct(date: Date): NgbDateStruct {
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,  // JS months are 0-11, NgbDateStruct uses 1-12
            day: date.getDate()
        };
    }

    // Convert ISO string "2025-01-15" to NgbDateStruct
    private stringToNgbDateStruct(dateStr: string): NgbDateStruct {
        const date = new Date(dateStr + 'T00:00:00');  // Add time to avoid timezone issues
        return this.dateToNgbDateStruct(date);
    }

    // Convert NgbDateStruct to ISO string "2025-01-15"
    private ngbDateStructToString(date: NgbDateStruct): string {
        const year = date.year;
        const month = String(date.month).padStart(2, '0'); // '01 -> 12' cause NgbDateStruct
        const day = String(date.day).padStart(2, '0'); // '01 -> 31'
        return `${year}-${month}-${day}`; // "2025-03-07"
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    private initializeForm(): void {
        if (this.data.mode === 'create') {
            // Convert Date to NgbDateStruct
            const startDate = this.data.clickDate
                ? this.dateToNgbDateStruct(this.data.clickDate)
                : this.dateToNgbDateStruct(new Date());

            // Calculate end date (7 days later) and convert to NgbDateStruct
            const endDateObj = this.data.clickDate
                ? this.dateUtils.addDays(this.data.clickDate, 7)
                : this.dateUtils.addDays(new Date(), 7);
            const endDate = this.dateToNgbDateStruct(endDateObj);


            this.orderForm = this.fb.group({
                name: ['', Validators.required],
                status: ['open', Validators.required],
                startDate: [startDate, Validators.required], // Now NgbDateStruct
                endDate: [endDate, Validators.required], // Now NgbDateStruct
                workCenterId: [this.data.workCenterId, Validators.required]
            });
        } else if (this.data.mode === 'edit' && this.data.order) {
            this.orderForm = this.fb.group({
                name: [this.data.order.data.name, Validators.required],
                status: [this.data.order.data.status, Validators.required],
                startDate: [this.stringToNgbDateStruct(this.data.order.data.startDate), Validators.required],
                endDate: [this.stringToNgbDateStruct(this.data.order.data.endDate), Validators.required],
                workCenterId: [this.data.order.data.workCenterId, Validators.required]
            });
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.orderForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    dateRangeError(): boolean {
        const startDate = this.orderForm.get('startDate')?.value;
        const endDate = this.orderForm.get('endDate')?.value;

        if (!startDate || !endDate) return false;

        // Convert NgbDateStruct to strings for comparison
        const startStr = this.ngbDateStructToString(startDate);
        const endStr = this.ngbDateStructToString(endDate);

        return this.dateUtils.parseDate(endStr) <= this.dateUtils.parseDate(startStr);
    }

    save(): void {
        this.errorMessage = '';

        // Mark all fields as touched
        Object.keys(this.orderForm.controls).forEach(key => {
            this.orderForm.get(key)?.markAsTouched();
        });

        if (this.orderForm.invalid) {
            this.errorMessage = 'Please fill in all required fields';
            return;
        }

        if (this.dateRangeError()) {
            this.errorMessage = 'End date must be after start date';
            return;
        }

        const formValue = this.orderForm.value;
        const result: OrderFormResult = {
            name: formValue.name,
            status: formValue.status,
            startDate: this.ngbDateStructToString(formValue.startDate),   // ✅ "2025-01-15"
            endDate: this.ngbDateStructToString(formValue.endDate),       // ✅ "2025-01-22"
            workCenterId: formValue.workCenterId
        };
        // Check for overlaps
        const excludeId = this.data.mode === 'edit' ? this.data.order?.docId : undefined;
        const hasOverlap = this.workOrderService.checkOverlap(
            result.workCenterId,
            result.startDate,   // ✅ Now a string
            result.endDate,     // ✅ Now a string
            excludeId
        );

        if (hasOverlap) {
            this.errorMessage = 'This work order overlaps with an existing order on the same work center';
            return;
        }

        // Close with result
        this.activeOffcanvas.close(result as OrderFormResult);
    }

    dismiss(): void {
        this.activeOffcanvas.dismiss();
    }
}