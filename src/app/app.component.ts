import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Route } from '@angular/router'

import { UserService } from './services/user.service'
import { apiConfig } from './services/config'

import { User } from './models/user'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{

  public title = 'Musify';
  public user : User;
  public registreUser:User;
  public identity;
  public token;
  public registerError;
  public registerMessage;
  public identifyError;
  public url;

  constructor(
    private _route:ActivatedRoute,
    private _router: Router,
    private _userService:UserService
  ){
    this.user = new User('','','','','','','ROLE_USER');
    this.registreUser = new User('','','','','','','ROLE_USER');
    this.url = apiConfig.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.registerError =null;
    this.identifyError=null;
    this.registerMessage =null;
    
  }

  public onRegisterMe(){
    this.registerError=null;
    this.registerMessage=null;
    this._userService.registerUser(this.registreUser).subscribe(
      data=>{
        this.registreUser = data.users;
        if(typeof data.message === "undefined"){
          if(!data.users._id){
            this.registerError='El usuario no fue correctamente registrado';
          }else{
            this.registerMessage=`El usuario se creado correctamente. Accedé a la cuenta con tu E-mail ${this.registreUser.email} y tu contraseña`
            this.registreUser= new User('','','','','','','ROLE_USER');
          }
        }else{

          this.registerError=data.message;
          this.registreUser= new User('','','','','','','ROLE_USER');
        }
      }, err=>{
        this.registerError = err;
        if(this.registerError != null){
          //continue
        }
      })
  }

  /**
   * Function LogOut() -> Cierro la session existente en el navegador.
   */
  public logOut(){
    localStorage.removeItem('Identity');
    localStorage.removeItem('Token');
    localStorage.clear();
    this.token=null
    this.identity=null
    this.registerError =null;
    this.identifyError=null;
    this.registerMessage =null;
    this._router.navigate(['/']);
  }

  public onSubmit(){

    // Limpiamos Variable de Error
    this.identifyError=null;

    //Obtengo Datos del Usuario Identificados
    this._userService.singUp(this.user).subscribe(
      data=>{
        let identity = data.user;
        this.identity = identity;
        console.log(data)
        //Verifico que obtenga una respuesta correcta.
        if(!this.identity._id){
          this.identifyError='El usuario no fue correctamente identificado';
        }else{
          //Guardo datos del usuario en LocalStorage

          localStorage.setItem('Identity',JSON.stringify(identity))

          //Obtengo nuevamente los datos del usuario + el hash de sesion
          this._userService.singUp(this.user,true).subscribe(
            data2=>{
              let token = data2.token;
              this.token = token;
              if(this.token.length <= 0){
                this.identifyError='Token de sesion no valido';
              }else{
                //Guardo token del usuario en LocalStorage
                localStorage.setItem('Token',token);
                this.user = new User('','','','','','','ROLE_USER');
              }
            },err=>{
              this.identifyError = err;
              console.log(err)
              if(this.identifyError != null){
                //continue
              }
            }
          );
        }
        
        //continue
      },err=>{
        this.identifyError = err;
        console.log(err)
        if(this.identifyError != null){
          //continue
        }
      }
    );
  }

}
