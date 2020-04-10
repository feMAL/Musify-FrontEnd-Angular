import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component'
import { HomeComponent } from './components/home.component';
//imports de User Component
import { UserEditComponent } from './components/user-edit.component'
//imports de Artist components
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistAddComponent } from './components/artist-add.component';
//imports de Album components
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
//imports de Songs components
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

const routes: Routes = [
  //{path:'', redirectTo:'home', pathMatch:'full'},
  {path:'', component: HomeComponent},
  {path: 'artist/new', component: ArtistAddComponent },
  {path: 'artist/edit/:id', component: ArtistEditComponent },
  {path: 'artist/detail/:id', component: ArtistDetailComponent },
  {path: 'artists/:page', component: ArtistListComponent },
  {path: 'album/new/:artist', component: AlbumAddComponent },
  {path: 'album/edit/:id', component: AlbumEditComponent },
  {path: 'album/detail/:id', component: AlbumDetailComponent },
  {path: 'song/new/:album', component: SongAddComponent },
  {path: 'song/edit/:id', component: SongEditComponent },
  {path: 'profile', component: UserEditComponent },
  {path: 'home', component: HomeComponent },
  {path: '**', component: ArtistListComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
