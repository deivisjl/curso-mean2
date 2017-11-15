import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';

import { Album } from '../models/album';
import { Artist } from '../models/artist';

@Component({
	selector: 'album-edit',
	templateUrl: '../views/album-add.html',
	providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit{
	public titulo: string;
	public album: Album;
	public identity;
	public token;
	public url:string;
	public alertRegister:string;
	public is_edit;
	

	constructor(private _route: ActivatedRoute,
				private _router: Router,
				private _userService: UserService,
				private _albumService: AlbumService,
				private _uploadService: UploadService){

		this.titulo = 'Editar album';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('', '', 2017, '','');
		this.is_edit = true;
	}

	ngOnInit(){

		this.getAlbum();
	}

	getAlbum(){
		this._route.params.forEach((params:Params) => {

			let id = params['id'];

			console.log()

			this._albumService.getAlbum(this.token, id).subscribe(
					response =>{

						if (!response.data) {
							
							this._router.navigate(['/']);
						}else{

							//this.alertRegister = 'El album se ha editado correctamente';

							this.album = response.data;
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
		this._route.params.forEach((params:Params) => {

			let id = params['id'];

			this._albumService.editAlbum(this.token, id, this.album).subscribe(
					response=>{

						if (!response.data) {
							this.alertRegister = 'Error en el servidor';

						}else{
							this.alertRegister = 'El album se ha actualizado correctament';
							this.album = response.data;

							//upload image
							if (!this.filesToUpload) {
								
								this._router.navigate(['/artista', response.data.artist ]);

							}else{

								this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id,
											[], this.filesToUpload, this.token, 'image')
												.then(
													(result) => {

														this._router.navigate(['/artista', response.data.artist ]);
													},
													(error) =>{
														console.log(error);
													}
												);	
							}
							
							
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
	}

public filesToUpload:Array<File>;

	fileChangeEvent(fileInput: any){

			this.filesToUpload = <Array<File>>fileInput.target.files;

	}
	
}