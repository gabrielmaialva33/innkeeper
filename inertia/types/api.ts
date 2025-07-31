// API Response Types

export interface User {
  id: number
  full_name: string
  email: string
  username?: string
  email_verified_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Role {
  id: number
  name: string
  display_name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Permission {
  id: number
  name: string
  display_name: string
  description?: string
  resource: string
  action: string
  created_at: string
  updated_at: string
}

export interface UserPermission extends Permission {
  granted: boolean
  expires_at?: string
}

export interface FileUploadResponse {
  url: string
  clientName: string
  fileCategory: string
  fileType: string
  size: number
  extname: string
}

export interface PaginationMeta {
  total: number
  per_page: number
  current_page: number
  last_page: number
  first_page: number
  first_page_url: string | null
  last_page_url: string | null
  next_page_url: string | null
  previous_page_url: string | null
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta
  data: T[]
}

export interface ApiError {
  message: string
  field?: string
  rule?: string
}

export interface ApiErrorResponse {
  errors: ApiError[]
}

export interface AuthTokens {
  token: string
  type: string
  expires_at?: string
}

export interface AuthResponse {
  user: User
  tokens?: AuthTokens
}

// Form Data Types
export interface LoginFormData {
  uid: string
  password: string
  [key: string]: any
}

export interface RegisterFormData {
  full_name: string
  email: string
  username?: string
  password: string
  password_confirmation: string
}

export interface UpdateUserFormData {
  full_name?: string
  email?: string
  username?: string
  password?: string
  password_confirmation?: string
}

export interface CreatePermissionFormData {
  name?: string
  description?: string
  resource: string
  action: string
}

export interface AttachRolesFormData {
  user_id: number
  role_ids: number[]
}

export interface SyncPermissionsFormData {
  role_id: number
  permission_ids: number[]
}

export interface UserPermissionSyncFormData {
  user_id: number
  permissions: Array<{
    permission_id: number
    granted?: boolean
    expires_at?: string
  }>
}

export interface CheckPermissionsFormData {
  permissions: string[]
  require_all?: boolean
}
