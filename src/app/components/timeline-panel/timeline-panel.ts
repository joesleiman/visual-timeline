import { Component, inject, input, output } from '@angular/core';
import { DateRange, TimelineColumn, ZoomLevel } from '../../services/date-utils.service';
import { WorkCenterDocument, WorkOrderDocument } from '../../models';
import { WorkOrderBar } from '../work-order-bar/work-order-bar';
import { DateUtilsService } from '../../services/date-utils.service';

export interface CellClickEvent {
  workCenterId: string;
  date: Date;
}

@Component({
  selector: 'timeline-panel',
  imports: [WorkOrderBar],
  templateUrl: './timeline-panel.html',
  styleUrl: './timeline-panel.scss',
})
export class TimelinePanel {
  columns = input.required<TimelineColumn[]>();
  dateRange = input.required<DateRange>();
  workCenters = input.required<WorkCenterDocument[]>();
  workOrders = input.required<WorkOrderDocument[]>();
  zoomLevel = input.required<ZoomLevel>();
  cellClick = output<CellClickEvent>();
  orderEdit = output<WorkOrderDocument>();
  orderDelete = output<string>();
  
  dateUtils = inject(DateUtilsService);

  isToday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() === today.getTime();
  }

  onCellClick(workCenterId: string, date: Date): void {
    this.cellClick.emit({ workCenterId, date });
  }


  getVisibleOrdersForWorkCenter(workCenterId: string): Array<{ order: WorkOrderDocument, position: { left: number, width: number } }> {
    return this.workOrders()
      .filter(o => o.data.workCenterId === workCenterId)
      .map(order => ({
        order,
        position: this.calculatePosition(order)
      }))
      .filter(item => item.position.visible);
  }

  calculatePosition(order: WorkOrderDocument): { left: number; width: number, visible: boolean } {
    //we can have this a global const 
    const cellWidth = 100;
    return this.dateUtils.calculateBarPosition(
      order.data.startDate,
      order.data.endDate,
      this.dateRange().start,
      this.dateRange().end,
      cellWidth,
      this.zoomLevel()
    );
  }
}
