'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var md_auth =require('../middlewares/authenticated');


var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/album'});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload],AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);
/*
api.get('/artistAll/:page?', md_auth.ensureAuth, AlbumController.getAllArtist);
api.put('/artistUpdate/:id', md_auth.ensureAuth, AlbumController.updateArtist);
api.delete('/artistDelete/:id', md_auth.ensureAuth, AlbumController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload],AlbumController.uploadImage);
api.get('/get-image-artist/:imageFile', AlbumController.getImageFile);*/

module.exports = api;