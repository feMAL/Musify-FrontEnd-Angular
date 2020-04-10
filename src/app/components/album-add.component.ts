import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params, Route } from '@angular/router'

import { apiConfig } from '../services/config'
import { UserService } from '../services/user.service'
import { ArtistService } from '../services/artist.service'
import { AlbumService } from '../services/album.service'

import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
  selector:  'album-add',
  templateUrl: '../views/album-add.html',
  providers: [UserService, ArtistService, AlbumService]
})
export class AlbumAddComponent implements OnInit {

    public titulo:string;
    public artist:Artist;
    public album:Album;
    public identity;
    public token;
    public registerError;
    public registerMessage;
    public url:string;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _artistService: ArtistService
    ){
        this.titulo= 'Crear nuevo Album'
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.album = new Album('','',2020,'','');
        this.url = apiConfig.url     
    }

    ngOnInit(){
        
    }

    onSubmit(){
        this._route.params.forEach((params:Params)=>{
            let artist_id = params['artist'];
            this.album.artist= artist_id;
        })
        this._albumService.addAlbum(this.token,this.album).subscribe(
            res=>{
                if(!res.album){
                    this.registerError = 'Error en el servidor'
                }else{
                    this.album = res.album;
                    this.registerMessage = 'Nuevo Album Cargado!'
                    this._router.navigate(['/album/edit', res.album._id] );
                }
            },err=>{
                this.registerError = err;
            }
        )
    }
}