import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';

import { Album } from '../models/album';
import { Artist } from '../models/artist';

@Component({
	selector: 'album-add',
	templateUrl: '../views/album-add.html',
	providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public album: Album;
	public identity;
	public token;
	public url:string;
	public alertRegister:string;
	

	constructor(private _route: ActivatedRoute,
				private _router: Router,
				private _userService: UserService,
				private _artistService: ArtistService,
				private _albumService: AlbumService){

		this.titulo = 'Crear album nuevo';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('', '', 2017, '','');
	}

	ngOnInit(){

	}

	onSubmit(){
		this._route.params.forEach((params:Params) => {

			let artist_id = params['artist'];
			this.album.artist = artist_id;

			this._albumService.addAlbum(this.token, this.album).subscribe(
					response=>{

						if (!response.data) {
							this.alertRegister = 'Error en el servidor';

						}else{
							this.alertRegister = 'El album se ha creado correctamente';
							this.album = response.data;
							console.log('Album: ', response.data._id);
							this._router.navigate(['/editar-album', response.data._id]);
						}

					},
					error=>{
						var errorMessage = <any>error;

						if (errorMessage != null) {
						
							var body = JSON.parse(error._body);
							this.alertRegister = body.message;
						}
					}
				);
		});
		console.log(this.album);
	}

	
}