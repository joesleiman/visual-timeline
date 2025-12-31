import { Injectable, inject } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { OrderPanel } from '../components/order-panel/order-panel';
import { Observable, Subject } from 'rxjs';
import { WorkOrderDocument, WorkOrderStatus } from '../models';

export interface OrderPanelData {
    mode: 'create' | 'edit';
    workCenterId?: string;
    clickDate?: Date;
    order?: WorkOrderDocument;
}

export interface OrderFormResult {
    name: string;
    status: WorkOrderStatus;
    startDate: string;
    endDate: string;
    workCenterId: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderPanelService {
    private offcanvasService = inject(NgbOffcanvas);

    /**
     * Opens the order offcanvas and returns an Observable that emits when saved
     */
    open(data: OrderPanelData): Observable<OrderFormResult | null> {
        const orderPanelRef = this.offcanvasService.open(OrderPanel, {
            position: 'end',
            backdrop: 'static', // Prevent closing by clicking outside
            keyboard: true, // Allow ESC to close
            panelClass: 'order-panel' // Custom CSS class
        });

        // Pass data to the offcanvas component
        orderPanelRef.componentInstance.data = data;

        // Create subject to emit result
        const resultSubject = new Subject<OrderFormResult | null>();

        // Listen for close/dismiss
        orderPanelRef.result.then(
            (result) => {
                // Closed with result (user clicked Save)
                resultSubject.next(result);
                resultSubject.complete();
            },
            () => {
                // Dismissed (user clicked Cancel or ESC)
                resultSubject.next(null);
                resultSubject.complete();
            }
        );

        return resultSubject.asObservable();
    }
}