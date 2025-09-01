# Property Catalog

A modern web application for managing and visualizing real estate properties with interactive maps and detailed property information.

## Features

🗺️ **Interactive Map View**
- OpenStreetMap integration with property markers
- Satellite/map view toggle
- Auto-zoom to fit all properties
- Click markers for property details

📋 **List View with Filtering**
- Separate filters for property type (house/apartment) and transaction type (rent/sale)
- Sort by name, price, or area
- Property cards with images and key metrics

🏠 **Property Management**
- Add new properties with form validation
- Edit existing properties
- Delete properties with confirmation
- Image support with price-based color placeholders

🔍 **Smart Address Search**
- Automatic geocoding using Nominatim API
- Live map preview in forms
- Manual coordinate input option

🔐 **Access Control**
- Password protection for admin functions
- View-only mode for unauthorized users

🔥 **Cloud Storage**
- Firebase Firestore integration
- Real-time data synchronization
- Offline fallback to local data

## Tech Stack

- **Frontend**: React.js with Create React App
- **Maps**: Leaflet with react-leaflet
- **Database**: Firebase Firestore
- **Styling**: Custom CSS with responsive design
- **Deployment**: GitHub Pages with GitHub Actions

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Firestore Database
   - Copy configuration to `.env` file:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_ADMIN_PASSWORD=your_admin_password
```

3. **Run locally:**
```bash
npm start
```

## Deployment

The app is configured for GitHub Pages deployment:

1. Update `homepage` in `package.json` with your GitHub username
2. Add Firebase environment variables to GitHub Secrets
3. Push to main branch - GitHub Actions will automatically deploy

## Usage

- **Viewing Properties**: No authentication required
- **Managing Properties**: Requires admin password
- **Adding Properties**: Use address search or manual coordinates
- **Editing**: Click edit buttons on cards, map popups, or detail views
- **Filtering**: Use type and transaction filters independently

## License

MIT