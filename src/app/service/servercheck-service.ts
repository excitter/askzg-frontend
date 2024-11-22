import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Injectable()
export class ServerCheckService {

  constructor(private http: HttpClient) {
  }

  isServerRunning(): Promise<void> {
    return lastValueFrom(this.http.get('/check'))
      .then(
        () => Promise.resolve(),
        (error) => Promise.reject(error.message)
      );
  }

}
