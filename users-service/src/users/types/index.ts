export interface CreatedUserResponse {
  id: number;
  email: string;
}

export interface GetUserResponse {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
}
