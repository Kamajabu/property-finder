import React, { useState } from 'react';

function PropertyForm({ onSubmit, onCancel, property, isEditing }) {
  const [formData, setFormData] = useState(property ? {
    name: property.name,
    link: property.link || '',
    imageUrl: property.imageUrl || '',
    price: property.price.toString(),
    currency: 'PLN',
    type: property.type,
    transactionType: property.transactionType,
    address: '',
    lat: property.coordinates[0].toString(),
    lng: property.coordinates[1].toString(),
    area: property.metrics.area.toString(),
    rooms: property.metrics.rooms.toString(),
    floor: property.metrics.floor?.toString() || '',
    description: property.details.description || '',
    amenities: property.details.amenities?.join(', ') || '',
    yearBuilt: property.details.yearBuilt?.toString() || ''
  } : {
    name: '',
    link: '',
    imageUrl: '',
    price: '',
    currency: 'PLN',
    type: 'mieszkanie',
    transactionType: 'wynajem',
    address: '',
    lat: '',
    lng: '',
    area: '',
    rooms: '',
    floor: '',
    description: '',
    amenities: '',
    yearBuilt: ''
  });

  const searchAddress = async () => {
    if (!formData.address) {
      alert('Wprowadź adres do wyszukania');
      return;
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        setFormData({
          ...formData,
          lat: data[0].lat,
          lng: data[0].lon
        });
      } else {
        alert('Nie znaleziono adresu');
      }
    } catch (error) {
      alert('Błąd podczas wyszukiwania adresu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Proszę wypełnić wszystkie wymagane pola (nazwa, cena)');
      return;
    }
    
    let coordinates = [parseFloat(formData.lat), parseFloat(formData.lng)];
    
    if (formData.address && (!formData.lat || !formData.lng)) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}&limit=1`
        );
        const data = await response.json();
        if (data.length > 0) {
          coordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        } else {
          alert('Nie znaleziono adresu. Proszę wprowadzić współrzędne ręcznie.');
          return;
        }
      } catch (error) {
        alert('Błąd podczas wyszukiwania adresu. Proszę wprowadzić współrzędne ręcznie.');
        return;
      }
    }
    
    if (!coordinates[0] || !coordinates[1]) {
      alert('Wprowadź adres lub współrzędne');
      return;
    }

    const propertyToSubmit = {
      name: formData.name,
      link: formData.link,
      imageUrl: formData.imageUrl,
      price: parseFloat(formData.price),
      currency: 'PLN',
      type: formData.type,
      transactionType: formData.transactionType,
      lat: coordinates[0],
      lng: coordinates[1],
      metrics: {
        area: formData.area && formData.area.trim() !== '' ? parseFloat(formData.area) : 0,
        rooms: formData.rooms && formData.rooms.trim() !== '' ? parseInt(formData.rooms) : 0,
        floor: formData.type === 'mieszkanie' && formData.floor && formData.floor.trim() !== '' ? parseInt(formData.floor) : null
      },
      details: {
        description: formData.description,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
        yearBuilt: formData.yearBuilt && formData.yearBuilt.trim() !== '' ? parseInt(formData.yearBuilt) : null
      }
    };

    // If we're editing, preserve the original property ID
    if (property && property.id) {
      propertyToSubmit.id = property.id;
    }

    onSubmit(propertyToSubmit);
    setFormData({
      name: '',
      link: '',
      imageUrl: '',
      price: '',
      currency: 'PLN',
      type: 'mieszkanie',
      transactionType: 'wynajem',
      address: '',
      lat: '',
      lng: '',
      area: '',
      rooms: '',
      floor: '',
      description: '',
      amenities: '',
      yearBuilt: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="property-form-overlay">
      <form className="property-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Edytuj Nieruchomość' : 'Dodaj Nową Nieruchomość'}</h2>
        
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Nazwa Nieruchomości *"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="url"
            name="link"
            placeholder="Link do Nieruchomości"
            value={formData.link}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="url"
            name="imageUrl"
            placeholder="Link do Zdjęcia"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="price"
            placeholder="Cena *"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input type="text" value="PLN" disabled style={{background: '#f8f9fa', color: '#6c757d'}} />
        </div>

        <div className="form-row">
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="mieszkanie">Mieszkanie</option>
            <option value="dom">Dom</option>
          </select>
          <select name="transactionType" value={formData.transactionType} onChange={handleChange}>
            <option value="wynajem">Wynajem</option>
            <option value="sprzedaż">Sprzedaż</option>
          </select>
        </div>

        <div className="form-row">
          <input
            type="text"
            name="address"
            placeholder="Adres (np. Warszawa, Krakowskie Przedmieście 1)"
            value={formData.address}
            onChange={handleChange}
          />
          <button 
            type="button" 
            onClick={searchAddress}
            className="search-address-btn"
          >
            Wyszukaj
          </button>
        </div>

        <div className="form-row">
          <input
            type="number"
            step="any"
            name="lat"
            placeholder="Szerokość geograficzna (opcjonalne)"
            value={formData.lat}
            onChange={handleChange}
          />
          <input
            type="number"
            step="any"
            name="lng"
            placeholder="Długość geograficzna (opcjonalne)"
            value={formData.lng}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="area"
            placeholder="Powierzchnia (m²)"
            value={formData.area}
            onChange={handleChange}
          />
          <input
            type="number"
            name="rooms"
            placeholder="Pokoje"
            value={formData.rooms}
            onChange={handleChange}
          />
          {formData.type === 'mieszkanie' && (
            <input
              type="number"
              name="floor"
              placeholder="Piętro"
              value={formData.floor}
              onChange={handleChange}
            />
          )}
        </div>

        <div className="form-row">
          <textarea
            name="description"
            placeholder="Opis"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="amenities"
            placeholder="Udogodnienia (oddzielone przecinkami)"
            value={formData.amenities}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="yearBuilt"
            placeholder="Rok Budowy"
            value={formData.yearBuilt}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">
            Anuluj
          </button>
          <button type="submit" className="submit-btn">
            {isEditing ? 'Zapisz Zmiany' : 'Dodaj Nieruchomość'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PropertyForm;