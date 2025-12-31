import { Component, input, output, signal } from '@angular/core';
import { STATUS_CONFIG, WorkOrderDocument } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'work-order-bar',
  imports: [CommonModule],
  templateUrl: './work-order-bar.html',
  styleUrl: './work-order-bar.scss',
})
export class WorkOrderBar {
  order = input.required<WorkOrderDocument>();
  position = input.required<{ left: number; width: number; }>();

  edit = output<WorkOrderDocument>();
  delete = output<string>();

  menuOpen = signal(false);

  statusClass(): string {
    const config = STATUS_CONFIG[this.order().data.status];
    return `${config.bgColor} ${config.textColor} ${config.borderColor}`;
  }

  statusLabel(): string {
    return STATUS_CONFIG[this.order().data.status].label;
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  onEdit(): void {
    this.edit.emit(this.order());
    this.menuOpen.set(false);
  }

  onDelete(): void {
    this.delete.emit(this.order().docId);
    this.menuOpen.set(false);
  }
}
