import mongoose, { Schema } from 'mongoose';
import { IModel } from './IModel';

/**
 * Interface for the model - field names and types
 */
export interface IBookModel extends IModel {
    isbn: string;
    title: string;
    desc: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Schema for the MongoDB collection
 */
const BookSchema:Schema = new Schema(
    {
        isbn: {
            type: String,
            required: true,
            unique: true,
        },
        title: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        authorId: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true
    }
);

/**
 * The actual Model type used for making model instances to interact with the database
 */
const BookModel = mongoose.model<IBookModel>('book', BookSchema);
export default BookModel;
