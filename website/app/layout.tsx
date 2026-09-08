import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Singapore Cinema Geography',
  description: 'Working scrollytelling prototype for documented Singapore cinema geographies.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v3.19.1/mapbox-gl.css" /><script src="https://api.mapbox.com/mapbox-gl-js/v3.19.1/mapbox-gl.js" defer /></head><body>{children}</body></html>;
}
