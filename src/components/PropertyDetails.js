import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { formatPrice } from '../utils/formatPrice';
import { getPriceColor, getPriceLightColor } from '../utils/colorUtils';

function PropertyDetails({ property, isOpen, onClose, onEdit }) {
  if (!isOpen || !property) return null;

  return (
    <div className="property-details-overlay" onClick={onClose}>
      <div className="property-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{property.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="modal-image-section">
            {property.imageUrl ? (
              <img src={property.imageUrl} alt={property.name} className="modal-image" />
            ) : (
              <div 
                className="modal-placeholder"
                style={{
                  backgroundColor: getPriceColor(property.price),
                  borderColor: getPriceLightColor(property.price)
                }}
              >
                <span className="placeholder-text-large">🏠</span>
              </div>
            )}
          </div>
          
          <div className="price-section">
            <div className="main-price">{formatPrice(property.price)} PLN</div>
            <div className="badges-container">
              <div className="transaction-type" data-type={property.transactionType}>
                {property.transactionType === 'wynajem' ? 'Wynajem' : 
                 property.transactionType === 'sprzedaż' ? 'Sprzedaż' : property.transactionType}
              </div>
              <div className="type-badge" data-type={property.type}>
                {property.type === 'mieszkanie' ? 'Mieszkanie' : 
                 property.type === 'dom' ? 'Dom' : property.type}
              </div>
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
            <div className="location-map">
              <MapContainer 
                center={property.coordinates} 
                zoom={15} 
                style={{ height: '250px', width: '100%', borderRadius: '10px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={property.coordinates} />
              </MapContainer>
            </div>
            <p>Współrzędne: {property.coordinates[0]}, {property.coordinates[1]}</p>
          </div>

          <div className="action-buttons">
            <button className="edit-btn" onClick={() => {
              onEdit(property);
              onClose();
            }}>
              Edytuj
            </button>
            {property.link && (
              <a 
                href={property.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link-btn"
              >
                Otwórz Oryginalną Ofertę →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;