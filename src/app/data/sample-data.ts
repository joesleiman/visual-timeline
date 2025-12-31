import { WorkCenterDocument, WorkOrderDocument } from '../models';
import { DocumentType } from '../models/document-type.enum';

export const SAMPLE_WORK_CENTERS: WorkCenterDocument[] = [
    { docId: 'wc-1', docType: DocumentType.WorkCenter, data: { name: 'Extrusion Line A' } },
    { docId: 'wc-2', docType: DocumentType.WorkCenter, data: { name: 'CNC Machine 1' } },
    { docId: 'wc-3', docType: DocumentType.WorkCenter, data: { name: 'Assembly Station' } },
    { docId: 'wc-4', docType: DocumentType.WorkCenter, data: { name: 'Quality Control' } },
    { docId: 'wc-5', docType: DocumentType.WorkCenter, data: { name: 'Packaging Line' } }
];

export const SAMPLE_WORK_ORDERS: WorkOrderDocument[] = [
    // ===== ORDERS FOR DAY VIEW (Today -14 to +28 days) =====
    // Today = Dec 30, 2025
    // Range: Dec 16, 2025 - Jan 27, 2026
    
    // 1. Complete order on wc-1 - visible in day view
    {
        docId: 'wo-1',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order A-100',
            workCenterId: 'wc-1',
            status: 'complete',
            startDate: '2025-12-18',
            endDate: '2025-12-24'
        }
    },
    
    // 2. In-progress order on wc-2 spanning across today - visible in day view
    {
        docId: 'wo-2',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order B-200',
            workCenterId: 'wc-2',
            status: 'in-progress',
            startDate: '2025-12-28',
            endDate: '2026-01-05'
        }
    },
    
    // 3. Blocked order on wc-3 - visible in day view
    {
        docId: 'wo-3',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order C-300',
            workCenterId: 'wc-3',
            status: 'blocked',
            startDate: '2026-01-10',
            endDate: '2026-01-20'
        }
    },
    
    // 4. Open order on wc-4 - visible in day view
    {
        docId: 'wo-4',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order D-400',
            workCenterId: 'wc-4',
            status: 'open',
            startDate: '2026-01-15',
            endDate: '2026-01-25'
        }
    },
    
    // 5. First order on wc-5 (non-overlapping) - visible in day view
    {
        docId: 'wo-5',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order E-500',
            workCenterId: 'wc-5',
            status: 'complete',
            startDate: '2025-12-20',
            endDate: '2025-12-27'
        }
    },
    
    // 6. Second order on wc-5 (non-overlapping) - visible in day view
    {
        docId: 'wo-6',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order F-600',
            workCenterId: 'wc-5',
            status: 'in-progress',
            startDate: '2025-12-28',
            endDate: '2026-01-06'
        }
    },
    
    // 7. Third order on wc-5 (non-overlapping) - visible in day view
    {
        docId: 'wo-7',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order G-700',
            workCenterId: 'wc-5',
            status: 'open',
            startDate: '2026-01-08',
            endDate: '2026-01-14'
        }
    },
    
    // 8. Fourth order on wc-5 (non-overlapping) - visible in day view
    {
        docId: 'wo-8',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order H-800',
            workCenterId: 'wc-5',
            status: 'blocked',
            startDate: '2026-01-16',
            endDate: '2026-01-22'
        }
    },
    
    // ===== ORDERS FOR WEEK VIEW (Today -56 to +56 days) =====
    // Range: Nov 4, 2025 - Feb 24, 2026
    
    // 9. NOT visible in week view (too old)
    {
        docId: 'wo-9',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order I-900',
            workCenterId: 'wc-1',
            status: 'complete',
            startDate: '2025-10-15',
            endDate: '2025-10-25'
        }
    },
    
    // 10. Close to today - visible in week view
    {
        docId: 'wo-10',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order J-1000',
            workCenterId: 'wc-2',
            status: 'in-progress',
            startDate: '2025-11-10',
            endDate: '2025-11-25'
        }
    },
    
    // ===== ORDERS FOR MONTH VIEW (Today -180 to +180 days) =====
    // Range: Jul 1, 2025 - Jun 30, 2026
    
    // 11. NOT visible in month view (too old)
    {
        docId: 'wo-11',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order K-1100',
            workCenterId: 'wc-3',
            status: 'complete',
            startDate: '2025-05-01',
            endDate: '2025-05-30'
        }
    },
    
    // 12. NOT visible in month view (too far in future)
    {
        docId: 'wo-12',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order L-1200',
            workCenterId: 'wc-4',
            status: 'open',
            startDate: '2026-08-01',
            endDate: '2026-08-31'
        }
    },
    
    // 13. Visible in month view - early in range
    {
        docId: 'wo-13',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order M-1300',
            workCenterId: 'wc-1',
            status: 'in-progress',
            startDate: '2025-07-15',
            endDate: '2025-08-20'
        }
    },
    
    // 14. Spanning multiple months - visible in month view
    {
        docId: 'wo-14',
        docType: DocumentType.WorkOrder,
        data: {
            name: 'Order N-1400',
            workCenterId: 'wc-3',
            status: 'in-progress',
            startDate: '2025-09-01',
            endDate: '2025-11-30'
        }
    }
];


// Summary of Sample Data:
// Work Centers: 5 total

// Extrusion Line A (wc-1)
// CNC Machine 1 (wc-2)
// Assembly Station (wc-3)
// Quality Control (wc-4)
// Packaging Line (wc-5)

// Work Orders: 14 total

// wc-1 (Extrusion Line A):

// ✅ wo-1: Dec 18-24, 2025
// ✅ wo-9: Oct 15-25, 2025 (NOT visible in day view)
// ✅ wo-13: Jul 15 - Aug 20, 2025 (month view only)

// wc-2 (CNC Machine 1):

// ✅ wo-2: Dec 28, 2025 - Jan 5, 2026
// ✅ wo-10: Nov 10-25, 2025 (week/month view)

// wc-3 (Assembly Station):

// ✅ wo-3: Jan 10-20, 2026
// ✅ wo-11: May 1-30, 2025 (NOT visible in month view)
// ✅ wo-14: Sep 1 - Nov 30, 2025 (month view)

// wc-4 (Quality Control):

// ✅ wo-4: Jan 15-25, 2026
// ✅ wo-12: Aug 1-31, 2026 (NOT visible in month view)

// wc-5 (Packaging Line) - 4 non-overlapping orders:

// ✅ wo-5: Dec 20-27, 2025
// ✅ wo-6: Dec 28, 2025 - Jan 6, 2026
// ✅ wo-7: Jan 8-14, 2026
// ✅ wo-8: Jan 16-22, 2026