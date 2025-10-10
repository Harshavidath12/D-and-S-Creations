import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CinemaMap.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom cinema marker icon - Google Maps style red pin
const cinemaIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzOCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDM4IDUwIj48cGF0aCBmaWxsPSIjRUE0MzM1IiBkPSJNMTksMGMtNy40LDAtMTMuNCw2LTEzLjQsMTMuNGMwLDEuMSwwLjEsMi4yLDAuNCwzLjJjMCwwLDAsMCwwLDBjMS4zLDUuMiw2LDE2LjQsMTMsMjkuNGM3LTEzLDExLjctMjQuMiwxMy0yOS40YzAsMCwwLDAsMC0wYzAuMy0xLDAuNC0yLjEsMC40LTMuMkMzMi40LDYsMjYuNCwwLDE5LDB6Ii8+PGNpcmNsZSBmaWxsPSIjRkZGRkZGIiBjeD0iMTkiIGN5PSIxMy40IiByPSI1Ii8+PC9zdmc+',
  iconSize: [38, 50],
  iconAnchor: [19, 50],
  popupAnchor: [0, -50],
  className: 'cinema-marker'
});

// Component to fit map bounds to all markers
function MapBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [positions, map]);

  return null;
}

const CinemaMap = ({ cinemas, onCinemaSelect, selectedCinema }) => {
  const [cinemaLocations, setCinemaLocations] = useState([]);

  // Extract coordinates from Google Maps URLs
  const extractCoordinates = (googleMapsUrl) => {
    if (!googleMapsUrl) return null;

    try {
      // Pattern 1: @lat,lng format
      const coordMatch = googleMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        return {
          lat: parseFloat(coordMatch[1]),
          lng: parseFloat(coordMatch[2])
        };
      }

      // Pattern 2: q=lat,lng format
      const qMatch = googleMapsUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qMatch) {
        return {
          lat: parseFloat(qMatch[1]),
          lng: parseFloat(qMatch[2])
        };
      }

      // Pattern 3: ll=lat,lng format
      const llMatch = googleMapsUrl.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (llMatch) {
        return {
          lat: parseFloat(llMatch[1]),
          lng: parseFloat(llMatch[2])
        };
      }
    } catch (error) {
      console.error('Error extracting coordinates:', error);
    }

    return null;
  };

  useEffect(() => {
    if (cinemas && cinemas.length > 0) {
      const locations = cinemas
        .map(cinema => {
          const coords = extractCoordinates(cinema.google_maps_location);
          if (coords) {
            return {
              ...cinema,
              coordinates: coords
            };
          }
          return null;
        })
        .filter(location => location !== null);

      setCinemaLocations(locations);
    }
  }, [cinemas]);

  // Default center (Sri Lanka)
  const defaultCenter = [7.8731, 80.7718];
  const defaultZoom = 8;

  // Get positions for map bounds
  const positions = cinemaLocations.map(loc => [loc.coordinates.lat, loc.coordinates.lng]);

  return (
    <div className="cinema-map-container">
      <div className="map-header">
        <h3>
          <i className="fa fa-map-marker-alt"></i> Cinema Locations
        </h3>
        <p>{cinemaLocations.length} cinema{cinemaLocations.length !== 1 ? 's' : ''} on map</p>
      </div>
      
      <MapContainer
        center={positions.length > 0 ? positions[0] : defaultCenter}
        zoom={defaultZoom}
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {positions.length > 0 && <MapBounds positions={positions} />}

        {cinemaLocations.map((cinema) => (
          <Marker
            key={cinema._id}
            position={[cinema.coordinates.lat, cinema.coordinates.lng]}
            icon={cinemaIcon}
            eventHandlers={{
              click: () => {
                if (onCinemaSelect) {
                  onCinemaSelect(cinema);
                }
              }
            }}
          >
            <Popup>
              <div className="cinema-popup">
                <h4>{cinema.cinema_name}</h4>
                <p className="location">
                  <i className="fa fa-map-marker"></i> {cinema.cinema_location}
                </p>
                {cinema.contact_info?.phone && (
                  <p className="contact">
                    <i className="fa fa-phone"></i> {cinema.contact_info.phone}
                  </p>
                )}
                {cinema.contact_info?.email && (
                  <p className="contact">
                    <i className="fa fa-envelope"></i> {cinema.contact_info.email}
                  </p>
                )}
                {cinema.google_maps_location && (
                  <a
                    href={cinema.google_maps_location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-link"
                  >
                    <i className="fa fa-directions"></i> Get Directions
                  </a>
                )}
                {onCinemaSelect && (
                  <button
                    className="select-btn"
                    onClick={() => onCinemaSelect(cinema)}
                  >
                    Select Cinema
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {cinemaLocations.length === 0 && (
        <div className="no-locations-message">
          <i className="fa fa-info-circle"></i>
          <p>No cinema locations available. Please add Google Maps links to cinema records.</p>
        </div>
      )}
    </div>
  );
};

export default CinemaMap;
