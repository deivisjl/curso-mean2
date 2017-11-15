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
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService, AlbumService, SongService]
})

export class AlbumDetailComponent implements OnInit{
	public titulo: string;
	public album: Album;
	public identity;
	public token;
	public url:string;
	public alertRegister:string;
	public songs:Song[];

	constructor(private _route: ActivatedRoute,
				private _router: Router,
				private _userService: UserService,
				private _albumService: AlbumService,
				private _songService: SongService){

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.titulo = "album detail";
		//this.album = new Album('','',2017,'','');
		//this.album.title = "album detail";
	}

	ngOnInit(){

		this.getAlbum();
	}

	getAlbum(){
		this._route.params.forEach((params: Params) => {

			let id = params['id'];

			this._albumService.getAlbum(this.token,id).subscribe(

					response => {

						if (!response.data) {

							this._router.navigate(['/']);
						}else{

							this.album = response.data;

							this._songService.getSongs(this.token, response.data._id).subscribe(
									
									response => {

										if (!response.data) {
										
											this.alertRegister = 'Este album no tiene canciones';
										}else{

											this.songs = response.data;
										}
									},
									error => {

										var errorMessage = <any>error;

										if (errorMessage != null) {
											
											var body = JSON.parse(error._body);

										}
									}
								);

						}
					},
					error => {

						var errorMessage = <any>error;
						 if (errorMessage != null) {
						 	
						 	var body = JSON.parse(error._body);

						 	this.alertRegister = body.message;
						 }
					}
				);
		});
	}

	public confirmado;

	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onSongCancel(){
		this.confirmado = null;
	}

	onDeleteSong(id){
		this._songService.deleteSong(this.token, id).subscribe(

				response => {

						if (!response.data) {
							this.alertRegister = 'Error en el servidor';
						}else{

							this.getAlbum();
						}

				},
				error => {

					var errorMessage = <any>error;
					if (errorMessage != null) {
						
						this.alertRegister = JSON.parse(error._boyd);
					}
				}
			);
	}

	startPlayer(song){
		let song_player = JSON.stringify(song);
		let file_path = this.url + 'get-file-song/' + song.file;
		let image_path = this.url + 'get-image-album/' + song.album.image;

		localStorage.setItem('sound_song',song_player);		

		document.getElementById("mp3-source").setAttribute("src", file_path);
		(document.getElementById("player") as any).load();
		(document.getElementById("player") as any).play();
	}
}