'use strict'

var bcrypt = require('bcrypt-nodejs');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

function getArtist(req, res){

	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) => {

		if (err) {

			res.status(500).send({message: 'Error en la peticion'});		
		}else{

			if (!artist) {

				res.status(404).send({message: 'El artista no existe'});
			}else{

				res.status(200).send({data: artist});
			}
		}
	});

	
}

function saveArtist(req, res){

	var artist = new Artist();

	var params = req.body;

	artist.name = params.name;

	artist.description = params.description;

	artist.image = 'null';

	artist.save((err, artistStored) => {

		if (err) {

			res.status(500).send({message: 'Error al guardar el registro'});
		}else{

			if (!artistStored) {

				res.status(404).send({message: 'El registro no ha sido guardado'});	
			}else{

				res.status(200).send({data: artistStored});
			}
		}
	});
}

function getAllArtist(req, res){

	if (req.params.page) {

		var page = req.params.page;
	}else{

		var page = 1;
	}

	var itemsPerPage = 4;

	Artist.find().sort('name').paginate(page,itemsPerPage, function(err, artists, total){

		if (err) {

			res.status(500).send({message: 'Error en la peticion'});	
		}else{

			if (!artists) {

				res.status(404).send({message: 'No hay artistas'});	
			}else{

				return res.status(200).send({

					Totaltems:total,
					data: artists
				});
			}
		}
	});

}

function updateArtist(req, res){

	var artistId = req.params.id;
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {

		if (err) {

			res.status(500).send({message: 'Error al guardar el artista'});
		}else{
			if (!artistUpdated) {

				res.status(404).send({ message: 'El artista no ha sido actualizado'});
			}else{

				res.status(200).send({data: artistUpdated});
			}
		}
	});
}

function deleteArtist(req, res){

	var artistId = req.params.id;

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {

		if (err) {

			res.status(500).send({message: 'Error al guardar el artista'});
		}else{

			if (!artistRemoved) {

				res.status(404).send({message: 'El artista no ha sido eliminado'});
			}else{
				Album.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
					if (err) {

						res.status(500).send({message: 'Error al eliminar el album'});		
					}else{

						if (!albumRemoved) {

							res.status(404).send({message: 'El album no ha sido eliminado'});
						}else{
							Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{

								if (err) {

									res.status(500).send({message: 'Error al eliminar la cancion'});
								}	else {

									if (!albumRemoved) {

										res.status(404).send({message: 'La cancion no ha sido removida'});
									}else{

										res.status(200).send({data: artistRemoved});
									}
								}
							});
						}
					}
				});

				//res.status(200).send({data: artistRemoved});
			}
		}
	});
}

function uploadImage(req, res){

	var artistId = req.params.id;

	var file_name = 'No subido...';

	if (req.files) {

		var file_path = req.files.image.path;

		var file_split = file_path.split('\\');

		var file_name = file_split[2];

		var ext_split = file_name.split('\.');

		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

			Artist.findByIdAndUpdate(artistId, {image: file_name},(err, artistUpdated) => {

				if (!artistUpdated) {

					res.status(404).send({message: 'No se ha podido actualizar el artista'});	
				}else{

					res.status(200).send({ data: artistUpdated});
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
	var path_file = './uploads/artist/' + imageFile;

	fs.exists(path_file, function(exists){

		if (exists) {

			res.sendFile(path.resolve(path_file));
		}else{

			res.status(200).send({message: 'No existe la image...'});
		}
	});
}

module.exports = {

	getArtist,
	saveArtist,
	getAllArtist,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};