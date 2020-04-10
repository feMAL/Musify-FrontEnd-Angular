import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'

import { apiConfig } from '../services/config'
import { UserService } from '../services/user.service'
import { SongService } from '../services/song.service'
import { UploadService } from '../services/upload.service'

import { Song } from '../models/song';

@Component({
  selector:  'song-edit',
  templateUrl: '../views/song-add.html',
  providers: [UserService, SongService, UploadService]
})
export class SongEditComponent implements OnInit {

    public titulo:string;
    public song:Song;
    public identity;
    public token;
    public registerError;
    public registerMessage;
    public url:string;
    public is_edit;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService:UploadService
    ){
        this.titulo= 'Editar canción'
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.song = new Song(1,'','','','')
        this.url = apiConfig.url     
        this.is_edit= true
    }

    ngOnInit(){
        console.log('Song edit component loaded correctly')
        //sacar la cancion a edita
        this.getSong();
    }

    getSong(){
        this._route.params.forEach((params:Params)=>{
            let idSong = params['id'];
            console.log(idSong)
            this._songService.getSong(this.token,idSong).subscribe(
                res=>{
                    if(!res.song){
                        this.registerError = 'Error al obtener datos de la canción a editar'    
                    }else{
                        this.song=res.song
                    }
                },
                err=>{
                    this.registerError = err;
                }
            )
        })
    }

    onSubmit(){
        this._route.params.forEach((params:Params)=>{
            let song_id = params['id'];
            
            this._songService.editSong(this.token,song_id,this.song).subscribe(
                res=>{
                    if(!res.song){
                        this.registerError = 'Error en el servidor'
                    }else{
                        this.registerMessage = 'Canción modificada!'
                        //this._router.navigate(['/album/detail', album_id] );
                        if(!this.filetoUpload){
                            this._router.navigate(['/album/detail', res.song.album])
                        }else{
                            this._uploadService.makeFileRequest( apiConfig.url +'song-file/' + song_id ,[],this.filetoUpload,this.token,'file')
                            .then(
                                res=>{
                                    console.log(res)
                                    /*this._router.navigate(['/artist/detail',artist_id])*/
                                },err=>{
                                    this.registerError = err;                
                                }
                            )
                        }
                    }
                },err=>{
                    this.registerError = err;
            })
        })
    }
    
    public filetoUpload: Array<File>;

    fileChangeEvent(fileInput:any){
        this.filetoUpload = <Array<File>>fileInput.target.files;
    }
}