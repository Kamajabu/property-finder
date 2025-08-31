import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'properties';

export const addProperty = async (property) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), property);
    return { id: docRef.id, ...property };
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
};

export const getProperties = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });
    return properties;
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};