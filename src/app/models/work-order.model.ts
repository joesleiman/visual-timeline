import { DocumentType } from "./document-type.enum";

export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

export interface WorkOrderDocument {
    docId: string;
    docType: DocumentType.WorkOrder;
    data: {
        name: string;
        workCenterId: string;
        status: WorkOrderStatus;
        startDate: string; // ISO format: "2025-01-15"
        endDate: string;
    };
}

export interface WorkOrderStatusConfig {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
}

export const STATUS_CONFIG: Record<WorkOrderStatus, WorkOrderStatusConfig> = {
    'open': {
        label: 'Open',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-300'
    },
    'in-progress': {
        label: 'In Progress',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-300'
    },
    'complete': {
        label: 'Complete',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-300'
    },
    'blocked': {
        label: 'Blocked',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-300'
    }
};