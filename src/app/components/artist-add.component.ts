import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params, Route } from '@angular/router'

import { apiConfig } from '../services/config'
import { UserService } from '../services/user.service'
import { ArtistService } from '../services/artist.service'

import { Artist } from '../models/artist';

@Component({
  selector:  'artist-add',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService]
})
export class ArtistAddComponent implements OnInit {

    public titulo:string;
    public artist:Artist;
    public identity;
    public token;
    public registerError;
    public registerMessage;
    public url:string;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo= 'Crear nuevo Artista'
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.artist = new Artist('','','');
        this.url = apiConfig.url
    }

    
    ngOnInit(){
        //Conseguir listado de artistas
    }

    onSubmit() {
        // Al enviar los datos cargados llamamos al servicio de artistas para enviar un nuevo artista.
        this._artistService.addArtist(this.token,this.artist).subscribe(
            res=>{   
                if(!res.artist){
                    this.registerError = 'Error en el servidor'
                }else{
                    this.artist = res.artist;
                    this.registerMessage = 'Artista Nuevo Cargado!'
                    this._router.navigate(['/artist/edit', res.artist._id] );
                }
            },err=>{
                this.registerError = err;
        })
    }
}
