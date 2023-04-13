export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserData extends UserCredentials {
  email: string;
}

export interface UserRegisterCredentials {
  email: string;
  username: string;
  password: string;
}
