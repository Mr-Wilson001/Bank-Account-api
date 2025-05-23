import { Schema, model, Document } from 'mongoose';
import { IAccount } from '../interface/account.interface';

const accountSchema = new Schema<IAccount & Document>({
    firstName: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },    // Encrypted
    dateOfBirth: { type: String, required: true, trim: true },                  // Encrypted 
    accountNumber: { type: String, required: true, unique: true, trim: true },
    cardNumber: { type: String, required: true, unique: true, trim: true },     // Encrypted 
    cvv: { type: String, required: true, trim: true },                          // Encrypted 
    expiryDate: { type: String, required: true, trim: true },                   // Encrypted 
}, { timestamps: true, versionKey: false });

const AccountModel = model<IAccount & Document>('Account', accountSchema);
export default AccountModel;