import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class CookieService {
	public getCookie(name: string) {
		let ca: Array<string> = document.cookie.split(';');
		let caLen: number = ca.length;
		let cookieName = `${name}=`;
		let c: string;

		for (let i: number = 0; i < caLen; i += 1) {
			c = ca[i].replace(/^\s+/g, '');
			if (c.indexOf(cookieName) == 0) {
				return c.substring(cookieName.length, c.length);
			}
		}
		return '';
	}

	public deleteCookie(name: string) {
		this.setCookie(name, '', -1);
	}

	public setCookie(name: string, value: string, expireHours: number, path: string = '') {
		let d: Date = new Date();
		d.setTime(d.getTime() + expireHours * 60 * 60 * 1000);
		let expires: string = `expires=${d.toUTCString()}`;
		path = path ? `; path=${path}` : '';
		document.cookie = `${name}=${value}; ${expires}${path}`;
	}
}
