import { Component, OnInit} from '@angular/core'

import { UserService } from '../services/user.service'
import { apiConfig } from '../services/config'

import { Song } from '../models/song'

@Component({
    selector: 'player',
    templateUrl:  '../views/player.html'
})

export class PlayerComponent implements OnInit{

    public url:string
    public song:Song

    constructor(){
        this.url=apiConfig.url
        this.song = new Song(1,'','','','')
    }

    ngOnInit(){
        console.log('Player Loaded')
        var song = JSON.parse(localStorage.getItem('sound_song'))
        if(song){
            this.song= song
        }else{
            this.song = new Song(1,'','','','');
        }
    }
}