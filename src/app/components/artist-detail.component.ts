import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params, Route } from '@angular/router'

import { apiConfig } from '../services/config'
import { UserService } from '../services/user.service'
import { ArtistService } from '../services/artist.service'
import { AlbumService } from '../services/album.service'

import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
  selector:  'artist-detail',
  templateUrl: '../views/artist-detail.html',
  providers: [UserService, ArtistService, AlbumService]
})
export class ArtistDetailComponent implements OnInit {
    public artist:Artist;
    public albums:Album[];
    public identity;
    public token;
    public registerError;
    public registerMessage;
    public url:string;
    public confirmed;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumServices: AlbumService
    ){
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.url = apiConfig.url
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

                        // Obtener los Albunes del artista
                        this._albumServices.getAlbums(this.token,res.artist._id).subscribe(
                            res=>{
                                
                                
                                if(!res.albums){
                                    this.registerMessage = 'Este artista no tiene Albums'
                                }else{
                                    this.albums = res.albums
                                }
                            },err=>{
                                this.registerError = err;
                                if(this.registerError != null){
                                //continue
                                }
                            }
                        )
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

    onDeleteConfirm(id){
        this.confirmed = id;
    }

    onCancelDelete(){
        this.confirmed =null;
    }

    onDeleteAlbum(id){
        this._albumServices.deleteAlbum(this.token,id).subscribe(
            response=>{
                console.log(response.albumRemoved)
                if(!response.albumRemoved){
                    alert('error en el servidor')
                }else{
                    this.getArtist()
                }
            },err=>{
                console.log(err)
            }
        )

    }    

}
