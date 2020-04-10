import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpErrorResponse } from '@angular/common/http'
import { throwError, Observable } from 'rxjs'
import { retry, catchError, tap, map } from 'rxjs/operators'
import { Artist } from '../models/artist'
import { apiConfig } from './config'

@Injectable({
    providedIn :'root'
})
export class UploadService{

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

    makeFileRequest(url:string, params:Array<string>,files:Array<File>, token:string, name:string){

        console.log(url);
        return new Promise((resolve,reject)=>{
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i=0;i<files.length;i++){
                formData.append(name, files[i], files[i].name);
            }
            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response))
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true );
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        })
    }
}   