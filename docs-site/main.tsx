import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App';
import './src/styles/input.css';

export const createRoot = ViteReactSSG(
  // react-router-dom data routes
  { routes },
  // function to have custom setups
  ({ router, routes, isClient, initialState }) => {
    // Custom setup if needed for client-side hydration
    if (isClient) {
      // Client-side only initialization
      console.log('Client-side initialization');
    }
  },
);