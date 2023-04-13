import mongoose from 'mongoose';
import { DB } from '../db/index.js';
import { APILogger } from '../logger/index.js';
import fs from 'fs'
import path from 'path'

const photosCollection = "photos"
const photosSchema = new mongoose.Schema({
    createdBy: "string",
    fieldname: 'string',
    originalname: 'string',
    encoding: 'string',
    mimetype: 'string',
    destination: 'string',
    filename: 'string',
    path: 'string',
    size: "number"
}, {
    versionKey: false
});

const UploadPath = "/root/api-rest/uploads/photos/"
const PhotosModel = mongoose.model(photosCollection, photosSchema);

class PhotosRepositoryClass {

    constructor() {
        DB.connect("PhotosRepositoryClass");
    }

    async getPhotos(createdBy) {
        const photos = await PhotosModel.find({ createdBy });
        APILogger.info(`photos::: for user ${createdBy} found ${photos.length}`);
        return photos;
    }

    async getPhotoByID(createdBy, photoId) {
        let data = {};
        try {
            data = await PhotosModel.findOne({ _id: photoId, createdBy });
        } catch (err) {
            APILogger.error('Error::' + err);
            throw err
        }
        return data;
    }

    async createPhoto(createdBy, photo) {
        let data = {};
        try {
            data = await PhotosModel.create({ createdBy, ...photo });
        } catch (err) {
            APILogger.error('Error::' + err);
            throw err
        }
        return data;
    }

    async updatePhotoByID(createdBy, photoId, photo) {
        let updatedPhoto = {};
        try {
            delete photo._id
            updatedPhoto = await PhotosModel.findOneAndUpdate({ _id: photoId, createdBy }, photo, { upsert: true, returnDocument: 'after' });
        } catch (err) {
            APILogger.error('Error::' + err);
            throw err
        }
        return updatedPhoto;
    }

    async deletePhotoByID(createdBy, photoId) {
        try {
            const photo = await this.getPhotoByID(createdBy, photoId)
            if (!photo || !photo._id) throw new Error(`id ${photoId} not found`)
            const data = await PhotosModel.findByIdAndDelete({ _id: photoId });
            const fileToDelete = path.join(UploadPath, data.filename)
            APILogger.info("deleting ", fileToDelete)
            fs.unlink(fileToDelete, (err) => {
                if (err) {
                    APILogger.error('Error::' + err);
                }
            })

        } catch (err) {
            APILogger.error('Error::' + err);
            throw err
        }
        // return { status: `${data.deletedCount > 0 ? true : false}` };
        return { status: "deleted" }
    }

}

export const PhotosRepository = new PhotosRepositoryClass();

// const taskSchema = new mongoose.Schema({
//     name: 'string',
//     description: 'string',
//     createDate: 'date',
//     updatedDate: 'date',
//     createdBy: 'string',
//     updatedBy: 'string'
// },
//     { timestamps: { createDate: 'created_at', updatedDate: 'updated_at' } });