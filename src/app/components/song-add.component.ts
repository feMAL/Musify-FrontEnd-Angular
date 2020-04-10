import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'

import { apiConfig } from '../services/config'
import { UserService } from '../services/user.service'
import { SongService } from '../services/song.service'

import { Song } from '../models/song';

@Component({
  selector:  'song-add',
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService]
})
export class SongAddComponent implements OnInit {

    public titulo:string;
    public song:Song;
    public identity;
    public token;
    public registerError;
    public registerMessage;
    public url:string;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService
    ){
        this.titulo= 'Añadir una canción'
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.song = new Song(1,'','','','')
        this.url = apiConfig.url     
    }

    ngOnInit(){
        console.log('Song add component loaded correctly')
    }

    onSubmit(){
        this._route.params.forEach((params:Params)=>{
            let album_id = params['album'];
            this.song.album= album_id;

            this._songService.addSong(this.token,this.song).subscribe(
                res=>{
                    if(!res.song){
                        this.registerError = 'Error en el servidor'
                    }else{
                        this.song = res.song;
                        console.log(this.song)
                        this.registerMessage = 'Nuevo Album Cargado!'
                        this._router.navigate(['/song/edit', res.song._id] );
                    }
                },err=>{
                    this.registerError = err;
            })
        })
    }
}