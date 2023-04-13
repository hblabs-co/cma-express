import mongoose from 'mongoose';
import { DB } from '../db/index.js';
import { APILogger } from '../logger/index.js';

const booksCollection = "books"
const boooksSchema = new mongoose.Schema({
    title: 'string'
}, {
    versionKey: false
});

const BooksModel = mongoose.model(booksCollection, boooksSchema);

class BooksRepositoryClass {

    constructor() {
        DB.connect("BooksRepositoryClass");
    }

    async getBooks() {
        const books = await BooksModel.find({});
        APILogger.info('books::: found ', books.length);
        return books;
    }

    async getBookByID(bookId) {
        let data = {};
        try {
            data = await BooksModel.findById({ _id: bookId });
        } catch (err) {
            APILogger.error('Error::' + err);
        }
        return data;
    }

    async createBook(book) {
        let data = {};
        try {
            data = await BooksModel.create(book);
        } catch (err) {
            APILogger.error('Error::' + err);
        }
        return data;
    }

    async updateBookByID(bookId, book) {
        let updatedBook = {};
        try {
            delete book._id
            updatedBook = await BooksModel.findOneAndUpdate({ _id: bookId }, book, { upsert: true, returnDocument: 'after' });
        } catch (err) {
            APILogger.error('Error::' + err);
        }
        return updatedBook;
    }

    async deleteBookByID(bookId) {
        let data = {};
        try {
            data = await BooksModel.deleteOne({ _id: bookId });
        } catch (err) {
            APILogger.error('Error::' + err);
        }
        return { status: `${data.deletedCount > 0 ? true : false}` };
    }

}

export const BooksRepository = new BooksRepositoryClass();

// const taskSchema = new mongoose.Schema({
//     name: 'string',
//     description: 'string',
//     createDate: 'date',
//     updatedDate: 'date',
//     createdBy: 'string',
//     updatedBy: 'string'
// },
//     { timestamps: { createDate: 'created_at', updatedDate: 'updated_at' } });