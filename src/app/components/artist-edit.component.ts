import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params, Route } from '@angular/router'

import { apiConfig } from '../services/config'
import { UserService } from '../services/user.service'
import { UploadService } from '../services/upload.service'
import { ArtistService } from '../services/artist.service'

import { Artist } from '../models/artist';

@Component({
  selector:  'artist-edit',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService, UploadService]
})
export class ArtistEditComponent implements OnInit {
    public titulo:string;
    public artist:Artist;
    public artistUpdating;
    public identity;
    public token;
    public registerError;
    public registerMessage;
    public url:string;
    public is_edit;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _uploadService:UploadService,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo= 'Modificar Artista'
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.artist = new Artist('','','');
        this.url = apiConfig.url
        this.is_edit = true
    }

    
    ngOnInit(){
        //Conseguir Artista a modificar
        this.getArtist();
    }


    getArtist(){
        /*  obtenemos id del artista harcodeado en la URL del componente */
        this._route.params.forEach((params: Params)=>{
            let id=params['id'];
            /* Solicitamos el artista a la DB con el id obtenido de la URL*/ 
            this._artistService.getArtist(this.token,id).subscribe(
                res=>{ 
                    if(!res.artist){
                        this._router.navigate(['/'])
                    }else{
                        // llenamos el objeto artista con el artista recibido
                        this.artist = res.artist
                    }
                },err=>{
                    this.registerError = err;
                    if(this.registerError != null){
                    //continue
                    }
                }
            )
        })
    }

    onSubmit() {
        this._route.params.forEach((params: Params)=>{
            let id=params['id'];
            this._artistService.editArtist(this.token,id,this.artist).subscribe(
                res=>{   
                    if(!res.artist){
                        this.registerError = 'Error en el servidor'
                    }else{
                        this.registerMessage = 'Artista actualizado!'
                        //Subir imagen del Artista
                        if(!this.filetoUpload){
                            this._router.navigate(['/artist/detail',id])
                        }else{
                            this._uploadService.makeFileRequest( apiConfig.url +'artist-image-update/' + id ,[],this.filetoUpload,this.token,'image')
                                .then(
                                    res=>{
                                        this._router.navigate(['/artist/detail',id])
                                    },err=>{console.log(err)}
                                )
                        }
                    }
                },err=>{
                    this.registerError = err;
                    if(this.registerError != null){
                    //continue
                }
            })
        })
    }

    public filetoUpload: Array<File>;

    fileChangeEvent(fileInput:any){
        this.filetoUpload = <Array<File>>fileInput.target.files;
    }
}
