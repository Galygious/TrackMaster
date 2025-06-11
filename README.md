# TrackMaster Vue 3

A Vue 3 application for bulk package tracking, converted from React and designed to work with Wails v2.

## Project Structure

```
TrackMaster/
├── src/
│   ├── components/
│   │   ├── icons/
│   │   │   └── index.ts           # SVG icon components
│   │   ├── TrackMasterApp.vue     # Main application component
│   │   └── SettingsSheet.vue      # Settings modal component
│   ├── styles/
│   │   └── globals.css            # Global styles and Tailwind CSS
│   ├── App.vue                    # Root Vue component
│   └── main.ts                    # Application entry point
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
├── env.d.ts                       # Type declarations
└── README.md                      # This file
```

## Features

- **Vue 3 Composition API**: Modern reactive state management
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Dark Theme**: Beautiful dark theme with custom color palette
- **Responsive Design**: Works on desktop and mobile devices
- **File Import**: CSV file import for bulk tracking numbers
- **Real-time Updates**: Simulated package tracking updates
- **Settings Panel**: Configurable application preferences
- **Wails Ready**: Prepared for integration with Wails v2 backend

## Key Components

### TrackMasterApp.vue
The main application component featuring:
- Tracking number input area
- CSV file import functionality
- Results table with status indicators
- Settings panel integration
- Dummy data simulation (ready for backend integration)

### SettingsSheet.vue
A slide-out settings panel with:
- Headless mode toggle
- Output format selection (CSV/JSON)
- Dark theme styling

### Icons
Custom SVG icon components that replace Lucide React icons:
- PackageSearchIcon
- UploadCloudIcon
- PlayIcon
- SettingsIcon
- Status icons (CheckCircle2, AlertTriangle, Truck, Clock, Info)

## Installation & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Wails Integration

This application is designed to work with Wails v2. To integrate with your Go backend:

1. **Replace mock functions** in `TrackMasterApp.vue`:
   ```typescript
   // Replace this mock implementation:
   const handleTrackAll = async () => {
     // ... mock code
   }
   
   // With actual Wails calls:
   const handleTrackAll = async () => {
     const numbersToTrack = trackingNumbersInput.value
       .split('\n')
       .map((num) => num.trim())
       .filter(Boolean)
     
     if (numbersToTrack.length === 0) {
       showToast('Please enter or import tracking numbers.', 'warning')
       return
     }
   
     isLoading.value = true
     
     try {
       const results = await window.backend?.Track?.(numbersToTrack)
       packages.value = results || []
       showToast('Tracking complete!', 'success')
     } catch (error) {
       showToast('Tracking failed', 'error')
     } finally {
       isLoading.value = false
     }
   }
   ```

2. **Update settings handler:**
   ```typescript
   const handleSettingsChange = async (newSettings: Settings) => {
     try {
       await window.backend?.UpdateSettings?.(newSettings)
       Object.assign(settings, newSettings)
       showToast('Settings saved!', 'success')
     } catch (error) {
       showToast('Failed to save settings', 'error')
     }
   }
   ```

## Usage

1. **Adding Tracking Numbers:**
   - Type tracking numbers in the textarea (one per line)
   - Or import a CSV file using the "Import CSV" button

2. **Tracking Packages:**
   - Click "Track All" to start tracking
   - View results in the table with status indicators

3. **Settings:**
   - Click the settings icon to open preferences
   - Toggle headless mode for scraping operations
   - Choose output format (CSV or JSON)

## Styling

The application uses Tailwind CSS with a custom dark theme. Key features:
- Slate color palette for dark theme
- Sky blue accents for interactive elements
- Smooth transitions and hover effects
- Responsive design breakpoints
- Custom CSS variables for theme colors

## Status Icons & Colors

- **Delivered**: Green with checkmark icon
- **In Transit**: Yellow with truck icon
- **Out for Delivery**: Blue with truck icon
- **Exception**: Red with warning triangle
- **Error**: Dark red with warning triangle
- **Info**: Blue with info icon
- **Pending**: Gray with clock icon

## Customization

The application is highly customizable:
- Edit `tailwind.config.js` for theme customization
- Modify `src/styles/globals.css` for global styles
- Update icon components in `src/components/icons/`
- Customize package statuses in `TrackMasterApp.vue`

## Migration from React

This Vue 3 application maintains the same functionality as the original React version while adapting to Vue patterns:
- `useState` → `ref()` and `reactive()`
- `useEffect` → `watch()` and `watchEffect()`
- `onClick` → `@click`
- `className` → `class`
- Component props → `defineProps()`
- Component events → `defineEmits()`

The application is ready to be integrated into your Wails v2 project by copying the entire directory structure into your frontend folder. 