# ProtestWatch

ProtestWatch is a React + Vite web application for tracking protest activity, reporting incidents, and viewing real-time statistics. The app features a dashboard with protest stats, recent events, trending hashtags, and allows users to report new incidents. 

## Features

- **Dashboard:** View a quick overview of protest activity, including total protests, recent arrests, active events, and total reports.
- **Recent Events:** See a list of recent protest events and their statuses.
- **Trending Hashtags:** Discover trending hashtags related to protest activity.
- **Report an Incident:** Users can submit new protest reports (authentication currently disabled).
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
- `src/App.jsx` – Main app component and routing

## License

This project is licensed under the MIT License.
