import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http'
import { throwError, Observable } from 'rxjs'
import { retry, catchError, tap, map } from 'rxjs/operators'
import { Album } from '../models/album'
import { apiConfig } from './config'

@Injectable({
    providedIn :'root'
})
export class AlbumService{

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

    getAlbums(token,artistId=null):Observable<any>{
        var uri= this.endPoint + 'albums'
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization' : token
        });
        
        if(artistId==null){
            return this._http.get(uri,{headers:headers})
                .pipe(catchError(this.handleError));
        }else{
            return this._http.get(uri+'/'+artistId,{headers:headers})
            .pipe(catchError(this.handleError));
        }
    }

    getAlbum(token,id:string):Observable<any>{
        var uri= this.endPoint + 'album/' + id
        
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization' : token
        });
        
        return this._http.get(uri,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    addAlbum(token,album:Album): Observable<any>{
        var uri= this.endPoint + 'album/'
        let param = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });

        // Sending Request;
        return this._http.post<any>(uri,param,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    editAlbum(token, id:string ,album:Album): Observable<any>{
        var uri= this.endPoint + 'album/' + id
        let param = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        
        return this._http.put<any>(uri,param,{headers:headers})
            .pipe(catchError(this.handleError));
    }

    deleteAlbum(token, id:string): Observable<any>{
        var uri= this.endPoint + 'album/' + id
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': token
        });
        
        return this._http.delete<any>(uri,{headers:headers})
            .pipe(catchError(this.handleError));
    }
}