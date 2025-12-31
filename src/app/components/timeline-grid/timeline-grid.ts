import { Component, input, computed, inject, signal } from '@angular/core';
import { WorkCenterPanel } from "../work-center-panel/work-center-panel";
import { CellClickEvent, TimelinePanel } from "../timeline-panel/timeline-panel";
import { DateUtilsService, ZoomLevel } from '../../services/date-utils.service';
import { WorkCenterService } from '../../services/work-center.service';
import { OrderPanelService } from '../../services/order-panel.service';
import { WorkOrderDocument } from '../../models';
import { DocumentType } from '../../models/document-type.enum';
import { WorkOrderService } from '../../services/work-order.service';

@Component({
  selector: 'timeline-grid',
  imports: [WorkCenterPanel, TimelinePanel],
  templateUrl: './timeline-grid.html',
  styleUrl: './timeline-grid.scss',
})
export class TimelineGrid {
  private dateUtils = inject(DateUtilsService);
  private workCenterService = inject(WorkCenterService);
  private workOrderService = inject(WorkOrderService);
  private orderPanelService = inject(OrderPanelService);

  zoomLevel = input.required<ZoomLevel>();
  workCenters = this.workCenterService.workCenters;
  workOrders = this.workOrderService.workOrders;
  
  //computed values based on zoomLevel
  dateRange = computed(() => this.dateUtils.getDateRange(this.zoomLevel()));
  columns = computed(() => this.dateUtils.generateColumns(this.zoomLevel(), this.dateRange()));

  onCellClick(event: CellClickEvent): void {
    this.orderPanelService.open({
      mode: 'create',
      workCenterId: event.workCenterId,
      clickDate: event.date
    }).subscribe(result => {
      // Handle result (only called if user clicked Save)
      if (result) {
        const newOrder: WorkOrderDocument = {
          docId: `wo-${Date.now()}`,
          docType: DocumentType.WorkOrder,
          data: result
        };
        this.workOrderService.addWorkOrder(newOrder);
      }
    });
  }

  onOrderEdit(order: WorkOrderDocument): void {
    // Open offcanvas for editing
    this.orderPanelService.open({
      mode: 'edit',
      order
    }).subscribe(result => {
      if (result) {
        this.workOrderService.updateWorkOrder(order.docId, result);
      }
    });
  }

  onOrderDelete(orderId: string): void {
    if (confirm('Are you sure you want to delete this work order?')) {
      this.workOrderService.deleteWorkOrder(orderId);
    }
  }

}
