/**
 * Deep Linking Configuration for React Navigation
 * 
 * Prefixes: myapp:// and https://myapp.com
 * Routes:
 *   - booking/:id -> BookingDetailsScreen
 *   - event/:id -> EventDetails
 */

const linking = {
    prefixes: ['myapp://', 'https://myapp.com'],
    config: {
        screens: {
            // Booking deep link: myapp://booking/123 or https://myapp.com/booking/123
            BookingDetailsScreen: {
                path: 'booking/:id',
                parse: {
                    id: (id) => String(id),
                },
            },
            // Event deep link: myapp://event/456 or https://myapp.com/event/456
            EventDetails: {
                path: 'event/:id',
                parse: {
                    id: (id) => String(id),
                },
            },
        },
    },
};

export default linking;
