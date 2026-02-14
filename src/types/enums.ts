// MongoDB Enum Types
// Since MongoDB doesn't support Prisma enums, we define them as TypeScript types

export enum UserRole {
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum InscriptionType {
  SOUTIEN = 'SOUTIEN',
  FORMATION = 'FORMATION',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum TeacherStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}

export enum PaymentType {
  HOURLY = 'HOURLY',
  FIXED = 'FIXED',
  COMMISSION = 'COMMISSION',
}

// Type helpers
export type UserRoleType = 'ADMIN' | 'SECRETARY' | 'SUPER_ADMIN';
export type InscriptionTypeType = 'SOUTIEN' | 'FORMATION';
export type TransactionTypeType = 'INCOME' | 'EXPENSE';
export type TeacherStatusType = 'Active' | 'Inactive' | 'Suspended';
export type PaymentTypeType = 'HOURLY' | 'FIXED' | 'COMMISSION';
