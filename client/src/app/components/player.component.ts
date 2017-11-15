import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
	selector: 'player',
	templateUrl: '../views/player.html'
})

export class PlayerComponent implements OnInit{

	public url: string;
	public song;

	constructor(){

		this.url = GLOBAL.url;
		this.song = new Song('','','','','');
	}

	ngOnInit(){
			console.log('player cargado');
	}
}