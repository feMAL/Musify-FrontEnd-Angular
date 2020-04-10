import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';
//imports de User components
import { UserEditComponent } from './components/user-edit.component';
//imports de Artist components
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { ArtistEditComponent } from './components/artist-edit.component';
//imports de Album components
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
//imports de Songs components
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
//Import Player
import { PlayerComponent } from './components/player.component'

import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service'

@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistEditComponent,
    ArtistAddComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    HomeComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
