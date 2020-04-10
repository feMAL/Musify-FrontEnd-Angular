import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http'
import { throwError, Observable } from 'rxjs'
import { retry, catchError, tap, map } from 'rxjs/operators'
import { Artist } from '../models/artist'
import { apiConfig } from './config'

@Injectable({
    providedIn :'root'
})
export class ArtistService{

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

    getArtists(token,page):Observable<any>{
        var uri= this.endPoint + 'artists/' +page
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization' : token
        });
        
        return this._http.get(uri,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    getArtist(token,id:string):Observable<any>{
        var uri= this.endPoint + 'artist/' + id
        
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization' : token
        });
        
        return this._http.get(uri,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    addArtist(token,artist:Artist): Observable<any>{
        var uri= this.endPoint + 'artist/'
        let param = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        // Sending Request;
        return this._http.post<any>(uri,param,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    editArtist(token, id:string ,artist:Artist): Observable<any>{
        var uri= this.endPoint + 'artist-update/' + id
        let param = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        
        return this._http.put<any>(uri,param,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    deleteArtist(token, id:string): Observable<any>{
        var uri= this.endPoint + 'artist-delete/' + id
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        
        return this._http.delete<any>(uri,{headers:headers})
            .pipe(catchError(this.handleError));
    }
}