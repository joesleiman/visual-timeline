import { Injectable, signal, computed } from '@angular/core';
import { WorkOrderDocument } from '../models';
import { SAMPLE_WORK_ORDERS } from '../data/sample-data';
import { DateUtilsService } from './date-utils.service';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private workOrdersSignal = signal<WorkOrderDocument[]>(SAMPLE_WORK_ORDERS);
  
  workOrders = this.workOrdersSignal.asReadonly();
  
  constructor(private dateUtils: DateUtilsService) {}
  
  getOrdersForWorkCenter(workCenterId: string) {
    return computed(() => 
      this.workOrdersSignal().filter(wo => wo.data.workCenterId === workCenterId)
    );
  }
  
  addWorkOrder(order: WorkOrderDocument): void {
    this.workOrdersSignal.update(orders => [...orders, order]);
  }
  
  updateWorkOrder(docId: string, data: WorkOrderDocument['data']): void {
    this.workOrdersSignal.update(orders => 
      orders.map(o => o.docId === docId ? { ...o, data } : o)
    );
  }
  
  deleteWorkOrder(docId: string): void {
    this.workOrdersSignal.update(orders => 
      orders.filter(o => o.docId !== docId)
    );
  }

  checkOverlap(
    workCenterId: string, 
    startDate: string, 
    endDate: string, 
    excludeId?: string
  ): boolean {
    const start = this.dateUtils.parseDate(startDate);
    const end = this.dateUtils.parseDate(endDate);
    
    return this.workOrdersSignal()
      .filter(o => o.data.workCenterId === workCenterId && o.docId !== excludeId)
      .some(order => {
        const orderStart = this.dateUtils.parseDate(order.data.startDate);
        const orderEnd = this.dateUtils.parseDate(order.data.endDate);
        return start < orderEnd && end > orderStart;
      });
  }
}