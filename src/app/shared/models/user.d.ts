declare namespace User {
  export interface EmailAndPasswordModel {
    email: string;
    password: string;
  }

  export interface UserInfoModel {
    id: string;
    name: string;
    surname: string;
    fullName: string;
    email: string;
    roles: string[];

    // extra
    displayRoles?: string;
  }

  export interface AllUserModel {
    credential: EmailAndPasswordModel;
    info: UserInfoModel;
  }
}
