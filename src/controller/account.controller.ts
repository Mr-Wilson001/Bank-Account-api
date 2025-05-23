import { Request, Response } from "express";
import Account from "../models/account.model";
import { encrypt, decrypt } from "../services/encryption.service";
import { accountValidationSchema } from "../middleware/joiSchema";


// Helper to generate random numbers as strings
function generateRandomNumber(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

// Helper to generate expiry date (MM/YY) at least 3 years in the future
function generateExpiryDate(): string {
  const now = new Date();
  const year = now.getFullYear() + 3;
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${month}/${year.toString().slice(-2)}`;
}

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { firstName, surname, email, phoneNumber, dateOfBirth } = req.body;

    // Generate unique numbers
    const accountNumber = "20" + generateRandomNumber(8); // Ensure starts with 20
    const cardNumber = "51" + generateRandomNumber(14);   // Ensure starts with 51
    const cvv = generateRandomNumber(3);
    const expiryDate = generateExpiryDate();

    // Validate generated numbers
    const { error } = accountValidationSchema.validate({ accountNumber, cardNumber });
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    }

    // Encrypt sensitive fields
    const encryptedAccount = {
      firstName,
      surname,
      email,
      phoneNumber: encrypt(phoneNumber),
      dateOfBirth: encrypt(dateOfBirth),
      accountNumber,
      cardNumber: encrypt(cardNumber),
      cvv: encrypt(cvv),
      expiryDate: encrypt(expiryDate),
    };

    // Save to DB
    const savedAccount = await Account.create(encryptedAccount);

    res.status(201).json({
      message: "Account created successfully",
      account: {
        ...savedAccount.toObject(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// List all accounts with encrypted and decrypted fields
export const listAccounts = async (_req: Request, res: Response) => {
  try {
    const accounts = await Account.find();
    const result = accounts.map(accounts => ({
      fullName: `${accounts.surname} ${accounts.firstName}`,
      accountNumber: accounts.accountNumber,
      encrypted: {
        cardNumber: accounts.cardNumber,
        cvv: accounts.cvv,
        expiryDate: accounts.expiryDate,
        phoneNumber: accounts.phoneNumber,
        dateOfBirth: accounts.dateOfBirth,
      }
    }));

    res.json({ accounts: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to list accounts" });
  }
};

// Accepts encrypted data and returns decrypted data
export const decryptData = (req: Request, res: Response) => {
  try {
    const { cardNumber, cvv, expiryDate, phoneNumber, dateOfBirth } = req.body;
    res.json({
      cardNumber: cardNumber ? decrypt(cardNumber) : undefined,
      cvv: cvv ? decrypt(cvv) : undefined,
      expiryDate: expiryDate ? decrypt(expiryDate) : undefined,
      phoneNumber: phoneNumber ? decrypt(phoneNumber) : undefined,
      dateOfBirth: dateOfBirth ? decrypt(dateOfBirth) : undefined,
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to decrypt data" });
  }
};