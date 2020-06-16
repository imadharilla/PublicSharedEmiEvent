import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


const BACKEND_URL = environment.apiUrl + '/checkin/'


@Injectable()
export class CheckinService {
    constructor(private http: HttpClient) {}

    verifyPicture( image: File) {  
        const postData = new FormData();
        postData.append('image', image);
        return this.http.post(BACKEND_URL  , postData).subscribe();
      }
    
    
}