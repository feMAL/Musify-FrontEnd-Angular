import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params, Route } from '@angular/router'

import { apiConfig } from '../services/config'
import { UserService } from '../services/user.service'
import { ArtistService } from '../services/artist.service'

import { Artist } from '../models/artist';

@Component({
  selector:  'artist-list',
  templateUrl: '../views/artist-list.html',
  providers: [UserService]
})
export class ArtistListComponent implements OnInit {

    public titulo:string;
    public artists:Artist[]
    public identity;
    public token;
    public url:string;
    public next_page:number;
    public prev_page:number;
    public registerError;
    public confirmed;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo= 'Artistas'
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.url = apiConfig.url
        this.next_page = 1
        this.prev_page = 1
    }
    
    ngOnInit(){
        //Conseguir listado de artistas
        this.getArtists();
    }

    getArtists() {
        this._route.params.forEach((params:Params)=>{
            let page = +params['page']
            if(!page){
                page = 1;
            }else{
                this.next_page = page +1
                this.prev_page = page -1
                if(this.prev_page == 0 )
                {
                    this.prev_page = 1
                }
            }
            this._artistService.getArtists(this.token,page).subscribe(
                res=>{ 
                    if(!res.artists){
                        this._router.navigate(['/'])
                    }else{
                        // llenamos el objeto artista con el artista recibido
                        this.artists = res.artists
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

    onDeleteArtist(id){
        this._artistService.deleteArtist(this.token,id).subscribe(
            response=>{
                if(!response.artistRemoved){
                    alert('error en el servidor')
                }else{
                    this.getArtists()
                }
            },err=>{
                console.log(err)
            }
        )

    }    
}
