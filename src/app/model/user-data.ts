export class UserData {

  constructor(loggedIn: boolean, role: string) {
    this.loggedIn = loggedIn;
    this.role = role;
  }

  loggedIn: boolean;
  role: string;
  page: string;
}

export class User {
  username: string;
  lastActivity: string;
  password: string;
}
