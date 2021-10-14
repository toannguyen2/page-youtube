import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class HomeService {
  items: Array<any> = []
  afterCursor: string | number = ''
}
