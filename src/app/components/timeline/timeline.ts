import { Component, signal } from '@angular/core';
import { TimelineGrid } from '../timeline-grid/timeline-grid';
import { TimelineHeader } from '../timeline-header/timeline-header';
import { ZoomLevel } from '../../services/date-utils.service';

@Component({
  selector: 'timeline',
  imports: [TimelineGrid, TimelineHeader],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  // State
  zoomLevel = signal<ZoomLevel>('day');

  onZoomChange(level: ZoomLevel): void {
    this.zoomLevel.set(level);
  }
}
