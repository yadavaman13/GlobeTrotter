import { useContext } from 'react';
import { TripContext } from '../context/TripContext';

export function useTrips() {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrips must be used within a TripProvider');
    }
    return context;
}

export default useTrips;
