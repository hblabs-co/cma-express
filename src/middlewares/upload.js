import * as uuid from 'uuid'
import * as _ from 'lodash';
import * as gpHelper from "../helpers/gp.js"
import { PhotosRepository } from "../repositories/photos.js"


const getPhotos = async (req, res) => {
    try {
        const photos = await PhotosRepository.getPhotos(req.user)
        res.send(photos);
    } catch (error) {
        res.status(400)
        res.send({ error: error.message });
    }
}

const getPhotoByID = async (req, res) => {
    try {
        const photo = await PhotosRepository.getPhotoByID(req.user, req.params.id)
        if (!photo || !photo._id) return gpHelper.sendNotFound(res)
        res.send(photo);
    } catch (error) {
        res.status(400)
        res.send({ error: error.message });
    }
};


const createPhoto = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            const photo = await PhotosRepository.createPhoto(req.user, req.file)

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: photo
            });
        }
    } catch (err) {
        res.status(500).send({ error: err.messsage });
    }
}

// DELETE Request Handler
const deletePhotoByID = async (req, res) => {
    try {
        const deleted = await PhotosRepository.deletePhotoByID(req.user, req.params.id)
        res.status(200)
        res.send({ ...deleted, deleted: true });
    } catch (error) {
        res.status(400)
        res.send({ error: error.message });
    }
};

// const uploadPhotos = async (req, res) => {
//     try {
//         if (!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             let data = [];

//             //loop all files
//             _.forEach(_.keysIn(req.files.photos), (key) => {
//                 const id = uuid.v4()
//                 let photo = req.files.photos[key];

//                 //move photo to uploads directory
//                 photo.mv('../uploads/' + id);

//                 //push file details
//                 data.push({
//                     id,
//                     name: photo.name,
//                     mimetype: photo.mimetype,
//                     size: photo.size
//                 });
//             });

//             //return response
//             res.send({
//                 status: true,
//                 message: 'Files are uploaded',
//                 data: data
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// };

export const UploadMiddlewares = {
    getPhotos,
    getPhotoByID,
    createPhoto,
    deletePhotoByID,
    // uploadPhotos
}