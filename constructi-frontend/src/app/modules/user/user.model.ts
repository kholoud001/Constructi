export interface User {
  id?: number;
  fname: string;
  lname: string;
  cell: string;
  email: string;
  password?: string;
  contratType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'FREELANCE';
  roleId: number;
  active: boolean;

}
