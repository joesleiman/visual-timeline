import { DocumentType } from "./document-type.enum";

export interface WorkCenterDocument {
  docId: string;
  docType: DocumentType.WorkCenter;
  data: {
    name: string;
  };
}