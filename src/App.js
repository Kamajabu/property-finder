import React, { useState, useEffect } from 'react';
import './App.css';
import MapView from './components/MapView';
import ListView from './components/ListView';
import PropertyForm from './components/PropertyForm';
import { getProperties, addProperty as addPropertyToFirebase, deleteProperty as deletePropertyFromFirebase } from './services/propertyService';
import propertiesData from './data/properties.json';

function App() {
  const [properties, setProperties] = useState([]);
  const [view, setView] = useState('map');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const firebaseProperties = await getProperties();
      
      // Jeśli brak danych w Firebase, użyj danych z JSON jako początkowych
      if (firebaseProperties.length === 0) {
        // Dodaj przykładowe dane do Firebase
        for (const property of propertiesData) {
          await addPropertyToFirebase(property);
        }
        setProperties(propertiesData);
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
      setShowForm(false);
    } catch (err) {
      console.error('Błąd dodawania nieruchomości:', err);
      alert('Nie udało się dodać nieruchomości');
    }
  };

  const deleteProperty = async (id) => {
    try {
      await deletePropertyFromFirebase(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      console.error('Błąd usuwania nieruchomości:', err);
      alert('Nie udało się usunąć nieruchomości');
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Wyszukiwarka Nieruchomości</h1>
        <div className="controls">
          <button 
            onClick={() => setView(view === 'map' ? 'list' : 'map')}
            className="view-toggle"
          >
            {view === 'map' ? 'Widok Lista' : 'Widok Mapa'}
          </button>
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
      
      <main className="main-content">
        {loading ? (
          <div className="loading">Ładowanie...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : view === 'map' ? (
          <MapView properties={properties} onDelete={deleteProperty} />
        ) : (
          <ListView properties={properties} onDelete={deleteProperty} />
        )}
      </main>
    </div>
  );
}

export default App;
