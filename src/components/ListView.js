import React, { useState } from 'react';
import PropertyDetails from './PropertyDetails';
import { formatPrice } from '../utils/formatPrice';
import { getPriceColor, getPriceLightColor } from '../utils/colorUtils';

function ListView({ properties, onDelete, onEdit }) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredProperties = properties.filter(property => {
    const typeMatch = typeFilter === 'all' || property.type === typeFilter;
    const transactionMatch = transactionFilter === 'all' || property.transactionType === transactionFilter;
    return typeMatch && transactionMatch;
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
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">Wszystkie Typy</option>
          <option value="mieszkanie">Mieszkania</option>
          <option value="dom">Domy</option>
        </select>
        
        <select value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)}>
          <option value="all">Wszystkie Transakcje</option>
          <option value="wynajem">Wynajem</option>
          <option value="sprzedaż">Sprzedaż</option>
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
            <div className="property-image">
              {property.imageUrl ? (
                <img src={property.imageUrl} alt={property.name} className="property-thumbnail" />
              ) : (
                <div 
                  className="property-placeholder"
                  style={{
                    backgroundColor: getPriceColor(property.price),
                    borderColor: getPriceLightColor(property.price)
                  }}
                >
                  <span className="placeholder-text">🏠</span>
                </div>
              )}
            </div>
            <div className="property-content">
              <div className="property-header">
                <h3>{property.name}</h3>
                <div className="card-actions">
                  <button 
                    onClick={() => onEdit(property)}
                    className="edit-btn-small"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDelete(property.id)}
                    className="delete-btn"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            
            <div className="property-details">
              <div className="price">
                <strong>{formatPrice(property.price)} PLN</strong>
              </div>
              
              <div className="metrics">
                <span className="transaction-type" data-type={property.transactionType}>na {property.transactionType}</span>
                <span className="type-badge" data-type={property.type}>{property.type}</span>
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
        onEdit={onEdit}
      />
    </div>
  );
}

export default ListView;