export const EnumApplicationStatus = {
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ApplicationStatus =
  (typeof EnumApplicationStatus)[keyof typeof EnumApplicationStatus];

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
