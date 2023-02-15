export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export enum UserRoleForSendLinkAdmin {
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export enum UserProjectsRole {
  WORKER = 'WORKER',
  MANAGER = 'MANAGER',
  VENDOR = 'VENDOR',
}

export interface IRedisOwner {
  email: string;
  name: string;
  role: UserRole;
}

export interface IRedisAdmin {
  email: string;
  name: string;
  role: UserRoleForSendLinkAdmin;
}
export enum PersonStatus {
  ACTIVE = 'Active',
  ARCHIVED = 'Archived',
}
