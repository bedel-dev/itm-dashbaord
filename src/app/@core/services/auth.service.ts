import { Injectable } from '@angular/core';
import { throwError, of } from 'rxjs';
import { User } from 'src/app/@shared/models/user';
import { GlobalConstants } from 'src/app/common/global-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const USERS = [
  {
    account: 'Admin',
    gender: 'male',
    userName: 'Admin',
    password: 'DevUI.admin',
    phoneNumber: '19999996666',
    email: 'admin@devui.com',
    userId: '100',
  },
  {
    account: 'User',
    gender: 'female',
    userName: 'User',
    password: 'DevUI.user',
    phoneNumber: '19900000000',
    email: 'user@devui.com',
    userId: '200',
  },
  {
    account: 'admin@devui.com',
    gender: 'male',
    userName: 'Admin',
    password: 'devuiadmin',
    phoneNumber: '19988888888',
    email: 'admin@devui.com',
    userId: '300',
  },
];

@Injectable()
export class AuthService {
  constructor(private http: HttpClient,) {}

  login(account: string, password: string) {
    var body= {
        "username":account,
        "pass":password
    }
    var connexion = this.http.post(GlobalConstants.apiURL+'users/login.php',body);
    if(connexion){
      return connexion;
    }else{
      return throwError('Please make sure you have input correct account and password');
    }
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('userinfo');
  }

  setSession(userInfo: any) {
    localStorage.setItem('id_token', '123456');
    localStorage.setItem('userinfo', JSON.stringify(userInfo));
    localStorage.setItem('expires_at', '120');
  }

  isUserLoggedIn() {
    if (localStorage.getItem('userinfo')) {
      return true;
    } else {
      return false;
    }
  }
}
