# PawInn frontend demo

The frontend is a browser-local prototype. Backend, PostgreSQL, Jenkins and image publishing are not connected yet. The existing root Compose and CI/CD files remain placeholders.

## Customer journey

1. Start the frontend following the root README and choose **Customer demo** on the sign-in page.
2. Visit **My pets**. Edit Mochi or add a dog/cat profile. Profiles with active bookings cannot be removed.
3. Visit **Our rooms**. Select dates, pet type and room. Invalid dates and fully reserved room types prevent booking.
4. Choose a compatible pet and continue to checkout. A reservation holds a room for 15 minutes.
5. Acknowledge the simulated payment. Choose **Declined payment** to exercise a retry, then choose **Successful payment** to confirm.
6. Visit **My bookings**, open details and submit a cancellation reason for an upcoming confirmed stay. History and timeline entries remain visible.

## Staff journey

1. Sign out and choose **Staff demo** on the sign-in page in the same browser/origin.
2. Open **Cancellation requests**, review the customer reason, add a note and approve or decline.
3. Approval releases the room and records a full simulated refund. Declining keeps the stay confirmed.
4. **All bookings** shows all demo accounts' stays. Confirmed stays can be marked completed only once their check-out date has arrived.
5. Switch back to the customer demo and inspect the updated booking details.

## Additional checks

- Create a separate demo account: its pet list and booking list start empty.
- Try direct checkout without a valid owned booking: the page offers a route back to rooms.
- Test mobile navigation, room filters, booking search and the past-stays tab.
- Modal dialogs support Escape, focus trapping and background scroll locking.
- Reservations use inclusive check-in / exclusive check-out dates. A new stay may start on the previous stay's check-out date.
- To reset, remove `pawinn.demo.v1` and `pawinn.session.v1` in browser site storage, then reload. No real user accounts exist.

## Implementation limits

The account, room and booking adapters are explicitly local demo adapters. Authentication does not verify passwords; staff access is simulated; storage is per browser; simultaneous edits from different tabs are not transactional. Availability, monetary values, expiry, cancellation policy and care amenities are illustrative. The backend must become the source of truth before this is used for real customers.

The local development server binds to 127.0.0.1. Stop it with Ctrl+C. Generated `frontend/dist/`, `node_modules/` and real environment files are ignored by Git.
