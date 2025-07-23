# ProtestWatch

ProtestWatch is a React + Vite web application for tracking protest activity, reporting incidents, and viewing real-time statistics. The app features a dashboard with protest stats, recent events, trending hashtags, and allows users to report new incidents. Authentication is handled via Firebase, and users must log in or register to report an event.

## Features

- **Dashboard:** View a quick overview of protest activity, including total protests, recent arrests, active events, and total reports.
- **Recent Events:** See a list of recent protest events and their statuses.
- **Trending Hashtags:** Discover trending hashtags related to protest activity.
- **Report an Incident:** Authenticated users can submit new protest reports.
- **Authentication:** Secure login and registration using Firebase Authentication.
- **Modern UI:** Built with React, Vite, Tailwind CSS, and React Router.

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd my-new-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Email/Password authentication.
   - Copy your Firebase config and add the following variables to a `.env` file in the project root:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

### Running the App

Start the development server:
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Linting

```bash
npm run lint
```

## Project Structure

- `src/components/` – React components (Dashboard, Navbar, Login, Register, Report, etc.)
- `src/firebase.js` – Firebase configuration and initialization
- `src/App.jsx` – Main app component and routing

## License

This project is licensed under the MIT License.
# ProtestMatch
