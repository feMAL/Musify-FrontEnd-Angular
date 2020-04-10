import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { throwError, Observable } from 'rxjs'
import { retry, catchError, tap, map } from 'rxjs/operators'
import { User } from '../models/user'
import { apiConfig } from './config'

@Injectable({
    providedIn :'root'
})
export class UserService{
    public identity;
    public token;
    private endPoint:string;

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

    getIdentity = () => {
        let identity = JSON.parse(localStorage.getItem('Identity'));
        if(identity != "undefined"){
            this.identity = identity;
        }else{
            this.identity =null;
        }
        return this.identity
    }

    getToken = () => {
        let token = localStorage.getItem('Token')
        if(token !="undefined"){
            this.token = token 
        }else{
            this.token=null;
        }
        return this.token;
    }

    singUp(loginUser, getHash = null): Observable<any> {
        let param = loginUser           // Data to send
        let endPoint = this.endPoint    //API End point.
        endPoint+='singup';
        param.gethash = getHash;  

        let headers = new HttpHeaders({'Content-Type': 'application/json'}); //Setting Headers for Request

        return this._http.post<User>(endPoint,param,{headers:headers}).pipe(catchError(this.handleError)); // Sending Request
    }

    updateUser(userUpdate, getHash = null): Observable<any> {
        let param = userUpdate           // Data to send
        let endPoint = this.endPoint    //API End point.
        endPoint+='update-user/';
        param.gethash = getHash;  

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()
        }); //Setting Headers for Request

        return this._http.put<User>(endPoint+userUpdate._id,param,{headers:headers}).pipe(catchError(this.handleError)); // Sending Request
    }

    registerUser(registerUser):Observable<any> {
        let endPoint=this.endPoint
        let param = registerUser
        endPoint+='register';
        let headers = new HttpHeaders({'Content-Type': 'application/json'});

        return this._http.post<User>(endPoint,param,{headers:headers}).pipe(catchError(this.handleError));
    }
}
