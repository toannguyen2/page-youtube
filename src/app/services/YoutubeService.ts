import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpService} from "./HttpService";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class YoutubeService {
	key_red: string = ''

	constructor(private httpService: HttpService) {
	}

	public getSuggest(query: string): Observable<any> {
		const data = {q: query}
		return this.httpService.post(`${environment.API_HOST}${environment.API_SUGGEST}`, JSON.stringify(data));
	}

	public search(data: any): Observable<any> {
		return this.httpService.post(`${environment.API_HOST}${environment.API_SEARCH}`, JSON.stringify(data));
	}

	public getListRelated(data: any): Observable<any> {
		return this.httpService.post(`${environment.API_HOST}${environment.API_LIST_RELATED}`, JSON.stringify(data));
	}

	public watch(id: any): Observable<any> {
		const data = {id}
		return this.httpService.post(`${environment.API_HOST}${environment.API_WATCH}`, JSON.stringify(data));
	}

	// public getTableUsers(event?: PageEvent) {
	//   let data = {
	//     limit: event === void 0 ? 10 : event?.pageSize,
	//     page: event === void 0 ? 0 : event?.pageIndex
	//   }
	//   return this.http.post<any>(`${environment.API.HOST}${environment.API.LIST_USER}`, data, {withCredentials: true});
	// }
}
