import mongoose, { Schema, Document } from 'mongoose';


export interface IBookModel extends Document {
    isbn: string;
    title: string;
    desc: string;
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
        }
    },
    {
        timestamps: true
    }
);

const BookModel = mongoose.model<IBookModel>('book', BookSchema);

export default BookModel;
