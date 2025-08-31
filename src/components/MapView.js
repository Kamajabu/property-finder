import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropertyDetails from './PropertyDetails';
import { formatPrice } from '../utils/formatPrice';
import { getPriceColor, getPriceLightColor } from '../utils/colorUtils';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function FitBounds({ properties, lastAddedProperty }) {
  const map = useMap();
  
  useEffect(() => {
    if (lastAddedProperty) {
      // Center on the newly added property
      map.setView(lastAddedProperty.coordinates, 15);
    } else if (properties.length > 0) {
      // Fit all properties on initial load
      const group = new L.featureGroup(
        properties.map(property => L.marker(property.coordinates))
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, properties, lastAddedProperty]);
  
  return null;
}

function MapView({ properties, onDelete, onEdit, lastAddedProperty }) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const defaultCenter = properties.length > 0 
    ? properties[0].coordinates 
    : [52.2297, 21.0122];

  return (
    <div className="map-container">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '500px', width: '100%' }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Mapa">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelita">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <FitBounds properties={properties} lastAddedProperty={lastAddedProperty} />
        {properties.map((property) => (
          <Marker key={property.id} position={property.coordinates}>
            <Popup>
              <div className="popup-content">
                {property.imageUrl ? (
                  <img src={property.imageUrl} alt={property.name} className="popup-image" />
                ) : (
                  <div 
                    className="popup-placeholder"
                    style={{
                      backgroundColor: getPriceColor(property.price),
                      borderColor: getPriceLightColor(property.price)
                    }}
                  >
                    <span className="placeholder-text">🏠</span>
                  </div>
                )}
                <h3>{property.name}</h3>
                <p><strong>Cena:</strong> {formatPrice(property.price)} PLN</p>
                <p><strong>Typ:</strong> {property.type} na {property.transactionType}</p>
                <p><strong>Powierzchnia:</strong> {property.metrics.area}m²</p>
                <p><strong>Pokoje:</strong> {property.metrics.rooms}</p>
                <div className="popup-buttons">
                  <button 
                    onClick={() => onEdit(property)}
                    className="edit-btn-small"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProperty(property);
                      setShowDetails(true);
                    }}
                    className="details-btn-small"
                  >
                    Zobacz Szczegóły
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <PropertyDetails 
        property={selectedProperty}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onEdit={onEdit}
      />
    </div>
  );
}

export default MapView;