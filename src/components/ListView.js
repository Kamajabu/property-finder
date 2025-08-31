import React, { useState } from 'react';
import PropertyDetails from './PropertyDetails';
import { formatPrice } from '../utils/formatPrice';

function ListView({ properties, onDelete }) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    if (filter === 'wynajem') return property.transactionType === 'wynajem';
    if (filter === 'sprzedaż') return property.transactionType === 'sprzedaż';
    if (filter === 'mieszkanie') return property.type === 'mieszkanie';
    if (filter === 'dom') return property.type === 'dom';
    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'area':
        return a.metrics.area - b.metrics.area;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="list-container">
      <div className="list-controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Wszystkie Nieruchomości</option>
          <option value="wynajem">Wynajem</option>
          <option value="sprzedaż">Sprzedaż</option>
          <option value="mieszkanie">Mieszkania</option>
          <option value="dom">Domy</option>
        </select>
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sortuj po Nazwie</option>
          <option value="price">Sortuj po Cenie</option>
          <option value="area">Sortuj po Powierzchni</option>
        </select>
      </div>

      <div className="properties-list">
        {sortedProperties.map((property) => (
          <div key={property.id} className="property-card">
            <div className="property-header">
              <h3>{property.name}</h3>
              <button 
                onClick={() => onDelete(property.id)}
                className="delete-btn"
              >
                ✕
              </button>
            </div>
            
            <div className="property-details">
              <div className="price">
                <strong>{formatPrice(property.price)} PLN</strong>
                <span className="transaction-type">na {property.transactionType}</span>
              </div>
              
              <div className="type-badge">{property.type}</div>
              
              <div className="metrics">
                <span>{property.metrics.area}m²</span>
                <span>{property.metrics.rooms} pokoi</span>
                {property.metrics.floor && <span>Piętro {property.metrics.floor}</span>}
              </div>
              
              {property.details.description && (
                <p className="description">{property.details.description}</p>
              )}
              
              {property.details.amenities && property.details.amenities.length > 0 && (
                <div className="amenities">
                  <strong>Udogodnienia:</strong> {property.details.amenities.join(', ')}
                </div>
              )}
              
              <button 
                onClick={() => {
                  setSelectedProperty(property);
                  setShowDetails(true);
                }}
                className="details-btn"
              >
                Zobacz Szczegóły →
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {sortedProperties.length === 0 && (
        <div className="empty-state">
          <p>Brak nieruchomości spełniających kryteria.</p>
        </div>
      )}
      
      <PropertyDetails 
        property={selectedProperty}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </div>
  );
}

export default ListView;