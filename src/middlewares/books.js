import Joi from 'joi';
import * as gpHelper from "../helpers/gp.js"
import { BooksRepository } from "../repositories/books.js"


const getBooks = async (req, res) => {
    try {
        const books = await BooksRepository.getBooks()
        res.send(books);
    } catch (error) {
        res.status(400)
        res.send({ error: error.message });
    }
};

const getBookByID = async (req, res) => {
    try {
        const book = await BooksRepository.getBookByID(req.params.id)
        if (!book || !book._id) return gpHelper.sendNotFound(res)
        res.send(book);
    } catch (error) {
        res.status(400)
        res.send({ error: error.message });
    }
};

// CREATE Request Handler
const createBook = async (req, res) => {

    const { error } = validateBook(req.body);

    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }

    try {
        const book = await BooksRepository.createBook({ title: req.body.title })
        res.status(201)
        res.send(book);
    } catch (error) {
        res.status(400)
        res.send({ error: error.message });
    }
};

// UPDATE Request Handler
const updateBookByID = async (req, res) => {
    try {
        const { error } = validateBook(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        let book = await BooksRepository.getBookByID(req.params.id)
        if (!book || !book._id) return gpHelper.sendNotFound(res)
        book = await BooksRepository.updateBookByID(book._id, { title: req.body.title })
        res.send(book);
    } catch (error) {
        res.status(400)
        res.send({ error: error.message });
    }
};

// DELETE Request Handler
const deleteBookByID = async (req, res) => {
    try {
        const deleted = await BooksRepository.deleteBookByID(req.params.id)
        res.status(200)
        res.send({ ...deleted, deleted: true });
    } catch (error) {
        res.status(400)
        res.send({ error: error.message });
    }
};

function validateBook(book = {}) {
    const schema = Joi.object({ title: Joi.string().min(3).required() })
    return schema.validate(book)
}

export const BooksMiddlewares = {
    getBooks,
    getBookByID,
    createBook,
    updateBookByID,
    deleteBookByID
}