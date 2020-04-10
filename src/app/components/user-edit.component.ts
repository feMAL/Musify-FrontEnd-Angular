import {Component, OnInit }from '@angular/core'

import { UserService } from '../services/user.service'
import { apiConfig } from '../services/config'

import { User } from '../models/user'

@Component({
    selector: 'user-edit',
    templateUrl:'../views/user-edit.component.html',
    providers: [UserService]
})
export class UserEditComponent implements OnInit {

    public titulo:string = 'Modificar mi Perfil';
    public user:User;
    public token;
    public identity;
    public url:string;
    public registerError;
    public registerMessage;

    constructor(private _userService:UserService){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = apiConfig.url;
    }

    ngOnInit(){}

    onSubmit(){
        this._userService.updateUser( this.user,this.token ).subscribe(
            res=>{
                if(!res.user._id){
                    this.registerError = 'Se produjo un error al actualizar el usuario';
                }else{
                    //this.user = res.user;
                    localStorage.setItem('Identity', JSON.stringify( this.user ));
                    document.getElementById("identity_name").innerHTML = this.user.name;
                    
                    if(!this.fileToUpload){
                        //Redireccion
                    }else{
                        this.makeFileRequest(this.url + 'upload-user-image/' + this.user._id,[],this.fileToUpload)
                            .then((result:any)=>{
                                this.user.image = result.image;
                                localStorage.setItem('Identity', JSON.stringify( this.user ));
                                
                                let image_path =this.url+ 'get-user-image/'+this.user.image;
                                document.getElementById("image-logged").setAttribute('src', image_path);
                            },err=>{
                                this.registerError = err;
                                this.registerMessage = null;
                            });
                    }
                    this.registerMessage = 'El usuario ha sido actualizado';
                }
            },err=>{
                this.registerError = err;
                if(this.registerError != null){
                //continue
                }
            });
        
    }

    public fileToUpload: Array<File>;

    fileChangeEvent(fileInput: any) {
        this.fileToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url:string, params:Array<string>,files:Array<File>){
        var token = this.token;
        return new Promise((resolve,reject)=>{
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i=0;i<files.length;i++){
                formData.append('image', files[i], files[i].name);
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