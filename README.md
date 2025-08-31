# Property Finder / Wyszukiwarka Nieruchomości

Lokalna aplikacja do wyszukiwania i wizualizacji nieruchomości z mapą i listą.

## Funkcje
- 🗺️ Widok mapy z pinami nieruchomości (OpenStreetMap)
- 📋 Widok listy z filtrowaniem i sortowaniem  
- ➕ Dodawanie nieruchomości z automatycznym wyszukiwaniem adresu
- 🔥 Przechowywanie danych w Firebase Firestore
- 📱 Responsywny design

## Uruchomienie lokalnie

1. Zainstaluj zależności:
```bash
npm install
```

2. Skopiuj `.env.example` do `.env` i uzupełnij klucze Firebase
3. Uruchom aplikację:
```bash
npm start
```

## Deployment na GitHub Pages

1. Zmień `yourusername` w `package.json` na swoją nazwę użytkownika GitHub
2. Utwórz repo na GitHub i wypchnij kod
3. W Settings → Secrets dodaj Firebase environment variables:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN` 
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`

4. GitHub Actions automatycznie zdeployuje na push do main

## Firebase Setup

1. Idź na https://console.firebase.google.com/
2. Utwórz nowy projekt
3. Włącz Firestore Database  
4. Skopiuj konfigurację z Project Settings → General do `.env`

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production

### `npm run deploy`  
Deploys to GitHub Pages
