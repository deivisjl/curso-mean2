import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';

import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:  [UserService]
})

export class AppComponent implements OnInit{
	  public title = 'MYMUSIFY';
	  public user: User;
	  public user_register: User;
	  public identity;
	  public token;
	  public errorMessage;
	  public registerMessage;
	  public url;

	  constructor(private _route: ActivatedRoute, private _router: Router, private _userService:UserService){

	  	this.user = new User('','','','','','ROLE_USER','');
	  	this.user_register = new User('','','','','','ROLE_USER','');
	  	this.url = GLOBAL.url;
	  }

	  public onSubmit(){

	  		this._userService.signIn(this.user).subscribe(
	  		response => {

	  			console.log(response);
	  			let identity = response.data;
	  			this.identity = identity;

	  			if(!this.identity._id){

	  				alert("El usuario no se identifico correctamente");
	  			}else{

	  				localStorage.setItem('identity',JSON.stringify(identity));

				  			this._userService.signIn(this.user,'true').subscribe(
						  		response => {

						  			let token = response.token;
						  			this.token = token;

						  			if(this.token.length <= 0){

						  				alert("El token no se generó correctamente");
						  			}else{

						  				localStorage.setItem('token',token);
						  				this.user = new User('','','','','','ROLE_USER','');	
						  			}

						  		},
						  		error =>{

						  			var errorMessage = <any>error;

						  			if(errorMessage != null){

						  				var body = JSON.parse(error._body);

						  				this.errorMessage = body.message;
						  			}

						  		});

	  				
	  			}

	  		},
	  		error =>{

	  			var errorMessage = <any>error;

	  			if(errorMessage != null){

	  				var body = JSON.parse(error._body);

	  				this.errorMessage = body.message;
	  			}

	  		});
	  }

	  ngOnInit(){

	  		this.identity = this._userService.getIdentity();
	  		this.token = this._userService.getToken();
	  }


	  logout(){

	  	localStorage.clear();
	  	this.identity = null;
	  	this.token = null;

	  	this._router.navigate(['/']);
	  	
	  }

	  onSubmitRegister(){

	  		this._userService.register(this.user_register).subscribe(
	  			
	  			response =>{

	  				let user = response.data;
	  				this.user_register = user;

	  				if (!user._id) {
	  					
	  					this.registerMessage = 'Error al registrarse';
	  				}else{

	  					this.registerMessage = 'El registro se ha realizado correctamente';
	  					this.user_register = new User('','','','','','ROLE_USER','');
	  				}
	  			},

	  			error => {

	  			}
	  			);
	  }
}
