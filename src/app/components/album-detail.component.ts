import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params, Route } from '@angular/router'

import { apiConfig } from '../services/config'
import { UserService } from '../services/user.service'

import { AlbumService } from '../services/album.service'
import { SongService } from '../services/song.service'


import { Album } from '../models/album';
import { Song } from '../models/song';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'

@Component({
  selector:  'album-detail',
  templateUrl: '../views/album-detail.html',
  providers: [UserService, AlbumService, SongService]
})
export class AlbumDetailComponent implements OnInit {
    public album:Album;
    public songs:Song[];
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
        private _albumServices: AlbumService,
        private _songServices: SongService
    ){
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.url = apiConfig.url
    }

    
    ngOnInit(){
        //Conseguir Album a mostrar
        this.getFullAlbum()
    }

    getFullAlbum(){
        /*  obtenemos id del album harcodeado en la URL del componente */
        this._route.params.forEach((params: Params)=>{
            let id=params['id'];
            /* Solicitamos el artista a la DB con el id obtenido de la URL*/ 
            this._albumServices.getAlbum(this.token,id).subscribe(
                res=>{ 
                    if(!res.album){
                        this._router.navigate(['/'])
                    }else{
                        // llenamos el objeto artista con el artista recibido
                        this.album = res.album

                        // Obtener Canciones del album
                        console.log(res.album._id)
                        this._songServices.getSongs(this.token,res.album._id).subscribe(
                            res=>{
                                console.log(res)
                                if(!res.song){
                                    this.registerMessage = 'Este Album no tiene canciones'
                                }else{
                                    this.songs = res.song
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
        this.confirmed = id
    }

    onDeleteSong(id){
        this._songServices.deleteSong(this.token,id).subscribe(
            res=>{
                if(!id==res.songRemoved._id){
                    this.registerError = 'La canción no ha sido eliminada correctamente.';
                }else{
                    this.getFullAlbum();
                }
            },
            err=>{
                this.registerError = err;
            })

    }

    onCancelDelete(){
        this.confirmed = null
    }

    startPlayer(song){
        let song_player = JSON.stringify(song);
        let file_path = this.url + 'song-file/' + song.file;
        let image_path = this.url + 'album-image/'+ song.album.image;

        console.log(image_path)

        localStorage.setItem('sound_song',song_player);
        document.getElementById("mp3-source").setAttribute('src',file_path);
        (document.getElementById("player") as any).load();
        (document.getElementById("player") as any).play();

        document.getElementById("play-song-title").innerHTML = song.name;
        document.getElementById("play-song-artist").innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src',image_path);
    }

}