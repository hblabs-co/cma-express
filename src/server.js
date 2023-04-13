import express from 'express';
import * as dotenv from 'dotenv'
import multer from 'multer';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose'
import path from 'path'

import cors from 'cors';

import { AuthMiddlewares } from './middlewares/auth.js'
import { BooksMiddlewares } from './middlewares/books.js'
import { UploadMiddlewares } from './middlewares/upload.js'
// import { RandomMiddlewares } from './middlewares/random.js'
import { UsersMiddlewares } from './middlewares/users.js'
import { APILogger } from './logger/index.js';

dotenv.config()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/photos')
    },
    filename: function (req, file, cb) {
        const name = mongoose.Types.ObjectId()
        cb(null, name + path.extname(file.originalname)) // Appending extension
    }
})

const upload = multer({
    dest: 'uploads/photos',
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024 // 10MB max file(s) size 
    }
})

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (_, res) => res.send('Welcome to REST API for HB Labs SAS'));

// app.get('/ping', RandomMiddlewares.ping);
// app.get('/simulate/codes', RandomMiddlewares.simulateCodes);

app.post("/oauth2/token", AuthMiddlewares.authenticateUser, AuthMiddlewares.issueToken)
app.get("/oauth2/token/validate", AuthMiddlewares.validateToken, AuthMiddlewares.afterTokenValidation)
app.post("/collections/users", AuthMiddlewares.authenticateAdmin, UsersMiddlewares.createUser)


// Unprotected Routes - Books Collections
app.get('/collections/books', BooksMiddlewares.getBooks);
app.get('/collections/books/:id', BooksMiddlewares.getBookByID);
app.post('/collections/books', BooksMiddlewares.createBook);
app.put('/collections/books/:id', BooksMiddlewares.updateBookByID);
app.delete('/collections/books/:id', BooksMiddlewares.deleteBookByID);

// Protected Routes - Photos collections
app.get('/collections/photos', AuthMiddlewares.validateToken, UploadMiddlewares.getPhotos)
app.get('/collections/photos', AuthMiddlewares.validateToken, UploadMiddlewares.getPhotos)
app.get('/collections/photos/:id', AuthMiddlewares.validateToken, UploadMiddlewares.getPhotoByID)
app.post('/collections/photos', AuthMiddlewares.validateToken, upload.single('photo'), UploadMiddlewares.createPhoto)
app.delete('/collections/photos/:id', AuthMiddlewares.validateToken, UploadMiddlewares.deletePhotoByID)
// app.post('/upload-photos', UploadMiddlewares.uploadPhotos)

// PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 3000;
app.listen(port, () => APILogger.info(`Listening on http port ${port}`));