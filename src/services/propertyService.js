import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc,
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

export const updateProperty = async (id, property) => {
  try {
    console.log('Updating property with ID:', id, 'Data:', property);
    const propertyRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(propertyRef, property);
    console.log('Property updated successfully in Firebase');
    return { id, ...property };
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const getProperties = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const properties = [];
    querySnapshot.forEach((doc) => {
      console.log('Firebase document:', { id: doc.id, data: doc.data() });
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
    console.log('Trying to delete property with ID:', id);
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    console.log('Property deleted successfully from Firebase');
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};