import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, Params, Route } from '@angular/router'

import { apiConfig } from '../services/config'
import { UserService } from '../services/user.service'

import { Artist } from '../models/artist';

@Component({
  selector:  'home',
  templateUrl: '../views/home.html',
  providers: [UserService]
})
export class HomeComponent implements OnInit {

    public titulo:string;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
    ){
        this.titulo= 'Artistas'
    }
    
    ngOnInit(){
        console.log('home.component it\'s ready')
        //Conseguir listado de artistas
    }
}
