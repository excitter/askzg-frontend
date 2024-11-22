import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {UserDataService} from '../service/user-data.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  constructor(private router: Router, private userDataService: UserDataService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('askzg-token');
    if (token === null) {
      token = '';
    }
    const authReq = req.clone({
      url: environment.apiHost + req.url,
      headers: req.headers.set('Authorization', 'Bearer ' + token)
      // .set('Access-Control-Allow-Origin', '*').set('Access-Control-Expose-Headers', 'Authorization')
    });

    return next.handle(authReq).pipe(catchError(err => {
      if (err.status === 401) {
        this.userDataService.updateData({loggedIn: false, page: '', role: ''});
        this.router.navigate(['login']);
      } else if (err.status === 0) {
        this.userDataService.updateData({loggedIn: false, page: '', role: ''});
        this.router.navigate(['']);
      }
      return throwError(err);
    }));
  }
}
