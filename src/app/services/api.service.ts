
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, CsvData } from '../shared/shared';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  
  constructor(private http: HttpClient) { }

  get(){
    return this.http.get(API_URL);
  }
  getOne(_id: any){
    return this.http.get(API_URL+_id);
  }
  post(data:any){
    return this.http.post(API_URL,data);
  }
  patch(data :any ,_id: any){
    return this.http.patch(API_URL+_id, data)
  }
  delete(_id: any){
    return this.http.delete(API_URL+_id);
  }

}
