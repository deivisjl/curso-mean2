import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-add',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url:string;
	public alertRegister:string;

	constructor(private _route: ActivatedRoute,
				private _router: Router,
				private _userService: UserService,
				private _artistService: ArtistService){

		this.titulo = 'Crear nuevo artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('','','');

	}

	ngOnInit(){

		//console.log(this._artistService.addArtist());
	}

	onSubmit(){
		
		this._artistService.addArtist(this.token, this.artist)
					.subscribe(
							response => {

								this.artist = response.data;

								if (!response.data) {
									
									this.alertRegister = 'Error en el servidor';

								}else{

									this.alertRegister = 'El artista se ha creado correctamente';

									this.artist = response.data;

									console.log(this.artist);

									this._router.navigate(['/artistas',1]);

								}

							},
							error => {

								var errorMessage = <any>error;

								if (errorMessage != null) {
									
									var body = JSON.parse(error._body);

									this.alertRegister = body.message;

									console.log(error);
								}
							}
						);	
	}
}