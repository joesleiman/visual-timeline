import { Component, input } from '@angular/core';
import { WorkCenterDocument } from '../../models';

@Component({
  selector: 'work-center-panel',
  imports: [],
  templateUrl: './work-center-panel.html',
  styleUrl: './work-center-panel.scss',
})
export class WorkCenterPanel {
  workCenters = input.required<WorkCenterDocument[]>();
}
