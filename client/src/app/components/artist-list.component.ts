import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-list',
	templateUrl: '../views/artist-list.html',
	providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit{
	public titulo: string;
	public artist: Artist[];
	public identity;
	public token;
	public url:string;
	public page;
	public next_page;
	public last_page;


	constructor(private _route: ActivatedRoute,
				private _router: Router,
				private _userService: UserService,
				private _artistService: ArtistService){

		this.titulo = 'Artistas';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.next_page = 1;
		this.last_page = 1;
	}

	ngOnInit(){

		//console.log(this.identity);
		this.getArtists();
	}

	getArtists(){

		this._route.params.forEach((params: Params) => {

			  this.page = + params['page'];

			 if (!this.page) {

			 	this.page = 1;
			 }else{

			 	this.next_page = this.page + 1;
			 	this.last_page = this.page - 1;

			 		if (this.last_page == 0) {
			 			
			 			this.last_page = 1;
			 		}
			 }

			 //console.log(this.page);
			 this._artistService.getArtists(this.token, this.page).subscribe(
			 		response => {

			 			if (!response.data) {

			 				this._router.navigate(['/']);
			 			}else{

			 				this.artist = response.data;
			 			}
			 		},
			 		error => {
			 			var errorMessage = <any>error;
			 			 if (errorMessage != null) {
			 			 	
			 			 	var body = JSON.parse(error._body);

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

	onCancelArtist(){

		this.confirmado = null;
	}

	onDeleteArtist(id){

		this._artistService.deleteArtist(this.token, id).subscribe(
				response=>{

					if (!response.data) {

						alert('Error en el servidor');

					}else{

						this.getArtists();
					}
				},

				error=>{

					var errorMessage = <any>error;

					if (errorMessage != null) {
						
						var body = JSON.parse(error._body);

						console.log(error);
					}
				}
			);
	}
}