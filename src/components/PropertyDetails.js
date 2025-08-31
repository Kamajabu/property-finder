import React from 'react';

function PropertyDetails({ property, isOpen, onClose }) {
  if (!isOpen || !property) return null;

  return (
    <div className="property-details-overlay" onClick={onClose}>
      <div className="property-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{property.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="price-section">
            <div className="main-price">{property.price} PLN</div>
            <div className="transaction-badge">
              {property.transactionType === 'wynajem' ? 'Wynajem' : 
               property.transactionType === 'sprzedaż' ? 'Sprzedaż' : property.transactionType}
            </div>
            <div className="type-badge">
              {property.type === 'mieszkanie' ? 'Mieszkanie' : 
               property.type === 'dom' ? 'Dom' : property.type}
            </div>
          </div>

          <div className="metrics-section">
            <h3>Parametry</h3>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Powierzchnia</span>
                <span className="metric-value">{property.metrics.area}m²</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Pokoje</span>
                <span className="metric-value">{property.metrics.rooms}</span>
              </div>
              {property.metrics.floor && (
                <div className="metric-item">
                  <span className="metric-label">Piętro</span>
                  <span className="metric-value">{property.metrics.floor}</span>
                </div>
              )}
              {property.details.yearBuilt && (
                <div className="metric-item">
                  <span className="metric-label">Rok budowy</span>
                  <span className="metric-value">{property.details.yearBuilt}</span>
                </div>
              )}
            </div>
          </div>

          {property.details.description && (
            <div className="description-section">
              <h3>Opis</h3>
              <p>{property.details.description}</p>
            </div>
          )}

          {property.details.amenities && property.details.amenities.length > 0 && (
            <div className="amenities-section">
              <h3>Udogodnienia</h3>
              <div className="amenities-list">
                {property.details.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">{amenity}</span>
                ))}
              </div>
            </div>
          )}

          <div className="coordinates-section">
            <h3>Lokalizacja</h3>
            <p>Szerokość: {property.coordinates[0]}</p>
            <p>Długość: {property.coordinates[1]}</p>
          </div>

          {property.link && (
            <div className="external-link-section">
              <a 
                href={property.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link-btn"
              >
                Otwórz Oryginalną Ofertę →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;