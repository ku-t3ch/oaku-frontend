export interface User {
  id: string;
  email: string;
  name: string;
  image: string; 
  campus?: {
    id: string;
    name: string;
  };
}