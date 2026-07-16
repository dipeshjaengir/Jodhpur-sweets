import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', '..', 'data', 'database.json');
const productsPath = path.join(__dirname, '..', '..', 'data', 'products.json');

export const readDB = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialData = { users: [], orders: [], bookings: [], catering: [], reviews: [] };
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], orders: [], bookings: [], catering: [], reviews: [] };
  }
};

export const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};

export const readProducts = () => {
  try {
    if (!fs.existsSync(productsPath)) {
      return [];
    }
    const data = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

export const writeProducts = (products) => {
  try {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};
