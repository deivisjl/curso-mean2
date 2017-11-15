import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';

import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { Song } from '../models/song';

@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit{
	public titulo: string;
	public song: Song;
	public identity;
	public token;
	public url:string;
	public alertRegister:string;
	

	constructor(private _route: ActivatedRoute,
				private _router: Router,
				private _userService: UserService,
				private _songService: SongService){

		this.titulo = 'Crear nueva cancion';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song('','','','','');
	
	}

	ngOnInit(){
			console.log('song add cargado');
	}

	onSubmit(){

		

		this._route.params.forEach((params:Params) =>{

			let album_id = params['id'];
			
			this.song.album = album_id;

				this._songService.addSong(this.token, this.song).subscribe(

						response => {

								if (!response.data) {
									
									this.alertRegister = 'Error en el servidor';
								}else{

									this.alertRegister = 'La cancion fue guardada exitosamente';

									this.song = response.data;

									this._router.navigate(['/editar-tema',response.data._id]);

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

}