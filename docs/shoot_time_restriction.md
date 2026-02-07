# Shoots Booking Time Restriction

## Objective
Restrict shoot bookings to be strictly between 9:00 AM and 6:00 PM (inclusive of 6:00 PM exactly, but typically nothing after 6:00:00).

## Changes
Modified `onTimeChange` in `slides/shootsBooking.js`:
- Added validation logic to check `selectedTime`.
- `hours` must be >= 9.
- `hours` must be <= 18.
- If `hours` is 18, `minutes` must be 0.
- Added `Alert` to notify user if they select an invalid time.
- Prevent state update if time is invalid.

## Verification
- Select 8:59 AM -> Should show alert "Invalid Time".
- Select 9:00 AM -> Should be accepted.
- Select 6:00 PM -> Should be accepted.
- Select 6:01 PM -> Should show alert "Invalid Time".
