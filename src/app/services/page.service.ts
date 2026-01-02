import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private apiUrl = environment.apiUrl + '/pages';

  constructor(private http: HttpClient) {}

  getPageBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${slug}`);
  }
}
