import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http'
import { throwError, Observable } from 'rxjs'
import { retry, catchError, tap, map } from 'rxjs/operators'
import { Song } from '../models/song'
import { apiConfig } from './config'

@Injectable({
    providedIn :'root'
})
export class SongService{

    public endPoint:string;

    constructor(private _http:HttpClient){
        this.endPoint = apiConfig.url;
    }

    handleError(error:HttpErrorResponse){
        let errorMessage = 'Unknow Error!';

        if(error.error instanceof ErrorEvent){
            //Errores del Cliente
            errorMessage= `Error: ${error.error.message}`;
        }else{
            //Errores del Servidor
            errorMessage= `Error Code: ${error.status}\n Message: ${error.message}`;
        }
        
        return throwError(errorMessage);
    }

    getSongs(token,albumId=null):Observable<any>{
        var uri= this.endPoint + 'songs'
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization' : token
        });
        
        if(albumId==null){
            return this._http.get(uri,{headers:headers})
                .pipe(catchError(this.handleError));
        }else{
            return this._http.get(uri+'/'+albumId,{headers:headers})
            .pipe(catchError(this.handleError));
        }
    }

    getSong(token,id:string):Observable<any>{
        var uri= this.endPoint + 'song/' + id
        
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization' : token
        });
        
        return this._http.get(uri,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    addSong(token,song:Song): Observable<any>{
        var uri= this.endPoint + 'song/'
        let param = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        // Sending Request;
        return this._http.post<any>(uri,param,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    editSong(token, id:string ,song:Song): Observable<any>{
        var uri= this.endPoint + 'song/' + id
        let param = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        
        return this._http.put<any>(uri,param,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    deleteSong(token, id:string): Observable<any>{
        var uri= this.endPoint + 'song/' + id
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        
        return this._http.delete<any>(uri,{headers:headers})
            .pipe(catchError(this.handleError));
    }
}