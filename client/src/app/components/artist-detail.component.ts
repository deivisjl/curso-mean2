import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.html',
	providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url:string;
	public alertRegister:string;
	public albums: Album[];

	constructor(private _route: ActivatedRoute,
				private _router: Router,
				private _userService: UserService,
				private _artistService: ArtistService,
				private _albumService: AlbumService){

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;

	}

	ngOnInit(){

		this.getArtist();
	}

	getArtist(){

		this._route.params.forEach((params: Params) => {

			let id = params['id'];

			this._artistService.getArtist(this.token,id).subscribe(
					response => {

						if(!response.data){

							this._router.navigate(['/']);
						}else{

							this.artist = response.data;

							this._albumService.getAlbums(this.token, response.data._id).subscribe(

									response => {


										if (!response.data) {

											this.alertRegister = 'No hay albums';
										}else{

											this.albums = response.data;

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
		});
	}

	public confirmado;

	onDeleteConfirm(id){

		this.confirmado = id;

	}

	onCancelAlbum(){

		this.confirmado = null;
	}

	onDeleteAlbum(id){

		this._albumService.deleteAlbum(this.token, id)
				.subscribe(
					response => {


						if (!response) {

							this.alertRegister = 'Hubo un error en el servidor';
						}else{

							this.getArtist();

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