export type Permission = {
  id: string;
  name: string;
  description?: string;
  module?: string;
  created_at: string | null;
  updated_at: string | null;
};

export interface UserPermissions {
  permissions: Permission[];
}

export interface AssignPermissionRequest {
  permissions: string[];
}
