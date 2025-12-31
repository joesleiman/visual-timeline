import { Injectable, signal } from '@angular/core';
import { WorkCenterDocument } from '../models';
import { SAMPLE_WORK_CENTERS } from '../data/sample-data';

@Injectable({
  providedIn: 'root'
})
export class WorkCenterService {
  // Use signals for reactive state
  private workCentersSignal = signal<WorkCenterDocument[]>(SAMPLE_WORK_CENTERS);
  
  // Readonly computed signal
  workCenters = this.workCentersSignal.asReadonly();
  
  getWorkCenterById(id: string): WorkCenterDocument | undefined {
    return this.workCentersSignal().find(wc => wc.docId === id);
  }
}