
import { Lake } from './types';

export const LAKES: Lake[] = [
    { id: '1', name: "Dal Lake", location: "Kashmir", lat: 34.0837, lon: 74.8379, type: "fresh" },
    { id: '2', name: "Vembanad Lake", location: "Kerala", lat: 9.5916, lon: 76.4044, type: "fresh" },
    { id: '3', name: "Chilika Lake", location: "Odisha", lat: 19.7158, lon: 85.3210, type: "normal" },
    { id: '4', name: "Wular Lake", location: "Kashmir", lat: 34.3675, lon: 74.6042, type: "fresh" },
    { id: '5', name: "Sambhar Lake", location: "Rajasthan", lat: 26.9088, lon: 75.0817, type: "normal" },
    { id: '6', name: "Pulicat Lake", location: "Tamil Nadu", lat: 13.6113, lon: 80.0463, type: "normal" },
    { id: '7', name: "Loktak Lake", location: "Manipur", lat: 24.5569, lon: 93.7981, type: "fresh" },
    { id: '8', name: "Nainital Lake", location: "Uttarakhand", lat: 29.3919, lon: 79.4542, type: "fresh" },
    { id: '9', name: "Kolleru Lake", location: "Andhra Pradesh", lat: 16.7167, lon: 81.3167, type: "normal" },
    { id: '10', name: "Upper Lake", location: "Bhopal", lat: 23.2599, lon: 77.3910, type: "fresh" },
    { id: '11', name: "Powai Lake", location: "Mumbai", lat: 19.1280, lon: 72.9050, type: "hazardous" },
    { id: '12', name: "Bellandur Lake", location: "Bangalore", lat: 12.9260, lon: 77.6810, type: "hazardous" },
    { id: '13', name: "Hussain Sagar", location: "Hyderabad", lat: 17.4239, lon: 78.4738, type: "normal" },
    { id: '14', name: "Pangong Lake", location: "Ladakh", lat: 33.7782, lon: 78.9025, type: "fresh" },
    { id: '15', name: "Fateh Sagar Lake", location: "Udaipur", lat: 24.5906, lon: 73.6784, type: "fresh" },
    { id: '16', name: "Lonar Lake", location: "Maharashtra", lat: 19.9757, lon: 76.5050, type: "normal" },
    { id: '17', name: "Hebbal Lake", location: "Bangalore", lat: 13.0450, lon: 77.5910, type: "hazardous" },
    { id: '18', name: "Pushkar Lake", location: "Rajasthan", lat: 26.4880, lon: 74.5530, type: "fresh" }
];

export const QUALITY_COLORS = {
  fresh: '#22c55e', // green-500
  normal: '#f59e0b', // amber-500
  hazardous: '#ef4444', // red-500
};

export const INITIAL_CENTER: [number, number] = [20.5937, 78.9629];
export const INITIAL_ZOOM = 5;
