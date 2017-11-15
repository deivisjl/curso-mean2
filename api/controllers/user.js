'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res){

	var query = User.find({});

	// execute the query at a later time
	query.exec(function (err, users) {
	  if (err) return handleError(err);

	  	return res.status(200).send({

		data: users
	});
	  
	})

	
}


function saveUser(req, res){

	var user = new User();

	var params = req.body;

	user.name = params.name;

	user.surname = params.surname;

	user.email = params.email;

	user.role = params.role;

	user.image = 'null';

	if (params.password) {

		bcrypt.hash(params.password, null, null, function(err, hash){

			user.password = hash;

			if (user.name != null && user.surname != null && user.email != null) {

				user.save((err, userStored) => {
					if (err) {

						res.status(500).send({message: 'Error al guardar registro'});
					}else{

						if (!userStored) {

							res.status(404).send({message: 'No se registro el usuario'});
						}else{

							res.status(200).send({data : userStored});
						}
					}
				});

			}else{

				res.status(200).send({message: 'Todos los campos son obligatorios'});
			}
		});

	}else{

		res.status(200).send({message: 'Introduce la contraseña'});
	}
}

function loginUser(req, res){

	var params = req.body;

	var email = params.email;

	var password = params.password;

	User.findOne({ email: email.toLowerCase() }, (err, user) => {

		if (err) {

			res.status(500).send({message: 'Error en la peticion'});
		}else{

			if (!user) {

				res.status(404).send({message: 'El usuario no existe'});	
			}else{

				bcrypt.compare(password, user.password, function(err, check){

					if (check) {

						if (params.gethash) {

							res.status(200).send({

								token: jwt.createToken(user)
							});
						}else{
							
							res.status(200).send({data: user});	
						}
					}else{

						res.status(404).send({message: 'Usuario no identificado'});
					}
				});
			}
		}
	});
}

function updateUser(req, res){

	var userId = req.params.id;

	var update = req.body;

	if (userId != req.user.sub) {
		
		return res.status(500).send({message: 'NO tienes permisos para actualizar este registro'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {

		if (err) {

			res.status(500).send({message: 'Error al actualizar el registro'});
		}else{

			if (!userUpdated) {

				res.status(404).send({message: 'No se ha podido actualizar el usuario'});	
			}else{

				res.status(200).send({ data: userUpdated});
			}
		}
	});
}

function uploadImage(req, res){

	var userId = req.params.id;

	var file_name = 'No subido...';

	if (req.files) {

		var file_path = req.files.image.path;

		var file_split = file_path.split('\\');

		var file_name = file_split[2];

		var ext_split = file_name.split('\.');

		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

			User.findByIdAndUpdate(userId, {image: file_name},(err, userUpdated) => {

				if (!userUpdated) {

					res.status(404).send({message: 'No se ha podido actualizar el usuario'});	
				}else{

					res.status(200).send({ image: file_name, data: userUpdated});
				}
				
			});

		}else{

			res.status(200).send({ message: 'Extension del archivo no valido'});
		}
	}else{

		res.status(200).send({ message: 'No has subido ninguna image...'});
	}
}

function getImageFile(req, res){

	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/' + imageFile;

	fs.exists(path_file, function(exists){

		if (exists) {

			res.sendFile(path.resolve(path_file));
		}else{

			res.status(200).send({message: 'No existe la image...'});
		}
	});
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};