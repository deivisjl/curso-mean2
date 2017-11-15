import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';

import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { Song } from '../models/song';

@Component({
	selector: 'song-edit',
	templateUrl: '../views/song-add.html',
	providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit{
	public titulo: string;
	public song: Song;
	public identity;
	public token;
	public url:string;
	public alertRegister:string;
	public is_edit;
	

	constructor(private _route: ActivatedRoute,
				private _router: Router,
				private _userService: UserService,
				private _songService: SongService,
				private _uploadService: UploadService){

		this.titulo = 'Editar cancion';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song('','','','','');
		this.is_edit = true;
	
	}

	ngOnInit(){
			console.log('song edit cargado');

			this.getSong();
	}

	getSong(){

		this._route.params.forEach((params: Params) =>{

			let id = params['id'];

			this._songService.getSong(this.token,id).subscribe(

					response => {

						if (!response.data) {
							
							this._router.navigate(['/']);

						}else{

							this.song = response.data;
							
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

	onSubmit(){

		

		this._route.params.forEach((params:Params) =>{

			let id = params['id'];

				this._songService.updateSong(this.token, id, this.song).subscribe(

						response => {

								if (!response.data) {
									
									this.alertRegister = 'Error en el servidor';
								}else{

									this.alertRegister = 'La cancion fue actualizada exitosamente';

									//subir fichero

									if (!this.filesToUpload) {
								
											this._router.navigate(['/album', response.data.album ]);

										}else{

											this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id,
														[], this.filesToUpload, this.token, 'file')
															.then(
																(result) => {

																	this._router.navigate(['/album', response.data.album ]);
																},
																(error) =>{
																	console.log(error);
																}
															);	
										}

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

	public filesToUpload:Array<File>;

	fileChangeEvent(fileInput: any){

			this.filesToUpload = <Array<File>>fileInput.target.files;

	}
	

}