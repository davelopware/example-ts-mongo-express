import mongoose, { Schema } from 'mongoose';
import { IModel } from './IModel';


export interface IBookModel extends IModel {
    isbn: string;
    title: string;
    desc: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}

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

const BookModel = mongoose.model<IBookModel>('book', BookSchema);

export default BookModel;
