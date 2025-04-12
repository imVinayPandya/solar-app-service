export enum ApplicationStatus {
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Application {
  id: string;
  name: string;
  description: string;
  status?: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationPayload = Omit<
  Application,
  'id' | 'createdAt' | 'updatedAt'
>;
