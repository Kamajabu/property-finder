import React, { useState, useEffect } from 'react';
import './App.css';
import MapView from './components/MapView';
import ListView from './components/ListView';
import PropertyForm from './components/PropertyForm';
import { getProperties, addProperty as addPropertyToFirebase, updateProperty as updatePropertyInFirebase, deleteProperty as deletePropertyFromFirebase } from './services/propertyService';
import propertiesData from './data/properties.json';

function App() {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastAddedProperty, setLastAddedProperty] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      
      // Sprawdź czy Firebase jest skonfigurowane
      if (!process.env.REACT_APP_FIREBASE_API_KEY) {
        console.warn('Firebase nie jest skonfigurowane, używam danych lokalnych');
        setProperties(propertiesData);
        setLoading(false);
        return;
      }
      
      const firebaseProperties = await getProperties();
      
      // Zawsze używaj danych z Firebase
      if (firebaseProperties.length === 0) {
        // Dodaj przykładowe dane do Firebase
        const addedProperties = [];
        for (const property of propertiesData) {
          const { id, ...propertyWithoutId } = property; // Usuń JSON ID
          const addedProperty = await addPropertyToFirebase(propertyWithoutId);
          addedProperties.push(addedProperty);
        }
        setProperties(addedProperties);
      } else {
        setProperties(firebaseProperties);
      }
    } catch (err) {
      console.error('Błąd ładowania danych:', err);
      setError('Nie można połączyć z bazą danych. Używam danych lokalnych.');
      setProperties(propertiesData);
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (property) => {
    try {
      const newProperty = {
        ...property,
        coordinates: [parseFloat(property.lat), parseFloat(property.lng)]
      };
      const savedProperty = await addPropertyToFirebase(newProperty);
      setProperties([...properties, savedProperty]);
      setLastAddedProperty(savedProperty);
      setShowForm(false);
      
      // Clear last added property after a short delay to reset map behavior
      setTimeout(() => setLastAddedProperty(null), 1000);
    } catch (err) {
      console.error('Błąd dodawania nieruchomości:', err);
      alert('Nie udało się dodać nieruchomości');
    }
  };

  const deleteProperty = async (id) => {
    const property = properties.find(p => p.id === id);
    console.log('Deleting property:', property);
    console.log('Property ID being deleted:', id);
    
    const confirmed = window.confirm(`Czy na pewno chcesz usunąć "${property?.name}"?`);
    
    if (!confirmed) return;
    
    try {
      // Usuń tylko lokalnie jeśli Firebase nie jest skonfigurowane
      if (!process.env.REACT_APP_FIREBASE_API_KEY) {
        setProperties(properties.filter(p => p.id !== id));
        return;
      }
      
      await deletePropertyFromFirebase(id);
      console.log('Firebase delete completed, updating local state');
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      console.error('Błąd usuwania nieruchomości:', err);
      alert('Nie udało się usunąć nieruchomości');
    }
  };

  const editProperty = async (property) => {
    try {
      if (!process.env.REACT_APP_FIREBASE_API_KEY) {
        const updatedProperties = properties.map(p => 
          p.id === property.id ? { ...property, coordinates: [parseFloat(property.lat), parseFloat(property.lng)] } : p
        );
        setProperties(updatedProperties);
        setEditingProperty(null);
        return;
      }
      
      const { lat, lng, id, ...propertyData } = property;
      
      // Filter out undefined values and ensure proper data structure
      const cleanPropertyData = Object.fromEntries(
        Object.entries(propertyData).filter(([key, value]) => value !== undefined)
      );
      
      const updatedProperty = {
        ...cleanPropertyData,
        coordinates: [parseFloat(lat), parseFloat(lng)]
      };
      
      console.log('Editing property with ID:', property.id, 'Clean data:', updatedProperty);
      
      await updatePropertyInFirebase(property.id, updatedProperty);
      const updatedProperties = properties.map(p => 
        p.id === property.id ? { ...updatedProperty, id: property.id } : p
      );
      setProperties(updatedProperties);
      setEditingProperty(null);
    } catch (err) {
      console.error('Błąd edycji nieruchomości:', err);
      alert('Nie udało się zaktualizować nieruchomości');
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Katalog Nieruchomości</h1>
        <div className="controls">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="add-property"
          >
            {showForm ? 'Anuluj' : 'Dodaj Nieruchomość'}
          </button>
        </div>
      </header>
      
      {showForm && (
        <PropertyForm 
          onSubmit={addProperty} 
          onCancel={() => setShowForm(false)} 
        />
      )}
      
      {editingProperty && (
        <PropertyForm 
          property={editingProperty}
          onSubmit={editProperty} 
          onCancel={() => setEditingProperty(null)} 
          isEditing={true}
        />
      )}
      
      <main className="main-content">
        {loading ? (
          <div className="loading">Ładowanie...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="combined-view">
            <div className="map-section">
              <MapView properties={properties} onDelete={deleteProperty} onEdit={setEditingProperty} lastAddedProperty={lastAddedProperty} />
            </div>
            <div className="list-section">
              <ListView properties={properties} onDelete={deleteProperty} onEdit={setEditingProperty} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
