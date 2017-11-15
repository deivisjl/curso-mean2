import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-edit',
	templateUrl: '../views/artist-add.html',
	providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url:string;
	public alertRegister:string;
	public is_edit;

	constructor(private _route: ActivatedRoute,
				private _router: Router,
				private _userService: UserService,
				private _uploadService: UploadService,
				private _artistService: ArtistService){

		this.titulo = 'Editar artista';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('','','');
		this.is_edit = true;

	}

	ngOnInit(){

		this.getArtist();
	}

	getArtist(){

		console.log('get artist cargado');

		this._route.params.forEach((params: Params) => {

			let id = params['id'];

			this._artistService.getArtist(this.token,id).subscribe(
					response => {

						if(!response.data){

							this._router.navigate(['/']);
						}else{

							this.artist = response.data;
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

	onSubmit(){

		console.log('en Onsubmit');

		this._route.params.forEach((params: Params) => {

			let id = params['id'];

		
		this._artistService.editArtist(this.token, id, this.artist)
					.subscribe(
							response => {

								this.artist = response.data;

								if (!response.data) {
									
									this.alertRegister = 'Error en el servidor';

								}else{

									this.alertRegister = 'El artista se ha actualizado correctamente';

										if (!this.filesToUpload) {
											
											this._router.navigate(['/artista', response.artist._id ]);

										}else{

											//this.artist = response.data;
									this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + id,
											[], this.filesToUpload, this.token, 'image')
												.then(
													(result) => {

														this._router.navigate(['/artista', response.artist._id ]);
													},
													(error) =>{
														console.log(error);
													}
												);	
										}
									

									//this._router.navigate(['/editar-artista'], response.artist._id);

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

	public filesToUpload:Array<File>;

	fileChangeEvent(fileInput: any){

			this.filesToUpload = <Array<File>>fileInput.target.files;

	}
}