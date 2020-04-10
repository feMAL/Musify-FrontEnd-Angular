import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params, Route } from '@angular/router'

import { apiConfig } from '../services/config'

import { UserService } from '../services/user.service'
import { AlbumService } from '../services/album.service'
import { UploadService } from '../services/upload.service'

import { Album } from '../models/album';

@Component({
  selector:  'album-edit',
  templateUrl: '../views/album-add.html',
  providers: [UserService, AlbumService]
})
export class AlbumEditComponent implements OnInit {

    public titulo:string;
    public album:Album;
    public identity;
    public token;
    public registerError;
    public registerMessage;
    public url:string;
    public is_edit;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _uploadService: UploadService,
        private _userService: UserService,
        private _albumService: AlbumService,
    ){
        this.titulo= 'Editar Album'
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.album = new Album('','',2020,'','');
        this.url = apiConfig.url
        this.is_edit = true
    }

    ngOnInit(){
        //cargo los datos del album a editar
        this.getAlbum();
    }

    getAlbum(){
        this._route.params.forEach((params:Params)=>{
            let id = params['id'];
            
            this._albumService.getAlbum(this.token, id).subscribe(
                resp=>{
                    if(!resp.album){
                        this._router.navigate(['/artists/1'])
                    }else{
                        this.registerMessage = 'El album se cargo correctamente!'
                        this.album = resp.album
                    }
                },
                err=>{
                    this.registerError = err
                })
        })
    }

    onSubmit(){
        this._route.params.forEach((params:Params)=>{
            let album_id = params['id'];
            // Servicio editar album
            this._albumService.editAlbum(this.token,album_id,this.album).subscribe(
                res=>{
                    let artist_id = res.album.artist
                    if(!res.album){
                        this.registerError = 'Error en el servidor'
                    }else{
                        if(!this.filetoUpload){
                            console.log(this.album.artist)
                            this._router.navigate(['/artist/detail',artist_id])
                        }else{
                            this._uploadService.makeFileRequest( apiConfig.url +'album-image-update/' + res.album._id ,[],this.filetoUpload,this.token,'image')
                            .then(
                                res=>{
                                    console.log(this.album.artist)
                                    this._router.navigate(['/artist/detail',artist_id])
                                },err=>{console.log(err)}
                            )
                        }
                    }
                },err=>{
                    this.registerError = err;
                }
            )
        })

        
    }
    
    public filetoUpload: Array<File>;

    fileChangeEvent(fileInput:any){
        this.filetoUpload = <Array<File>>fileInput.target.files;
    }
}    