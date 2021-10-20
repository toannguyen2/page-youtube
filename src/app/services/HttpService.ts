import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CookieService} from "./CookieService";

@Injectable({providedIn: 'root'})
export class HttpService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService) {
  }

  public post(api: string, data: any): Observable<any> {
    const options: any = {
      headers: {"content-type": "application/json"},
      observe: 'response' as 'response'
    }

    const key_red = this.cookieService.getCookie('key_red')
    if (key_red) {
      options.headers.key_red = key_red
    }

    return this.http.post<any>(api, data, options);
  }

  public get(api: string): Observable<any> {
    const options = {
      headers: {}
    }

    return this.http.get<any>(api, options);
  }
}
