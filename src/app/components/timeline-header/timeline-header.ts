import { Component, output, input } from '@angular/core';
import { ZoomLevel } from '../../services/date-utils.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'timeline-header',
  standalone: true,
  imports: [
    FormsModule,
    NgSelectModule,
  ],
  templateUrl: './timeline-header.html',
  styleUrl: './timeline-header.scss',
})
export class TimelineHeader {
  currentZoom = input.required<ZoomLevel>();
  zoomChange = output<ZoomLevel>()

  zoomLevels: ZoomLevel[] = ['day', 'week', 'month'];

  selectZoom(level: ZoomLevel){
    this.zoomChange.emit(level);
  }
}
