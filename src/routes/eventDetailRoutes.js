// routes/eventRoutes.js
const express = require('express');
const router = express.Router();

const eventDetailController = require('../controllers/EventDetailController');

const multer = require('multer');
const upload = multer(); // Configure multer as needed
// Route to create a new event detail

//for service provider
router.post('/event-details', upload.any(), eventDetailController.createEvent);

router.get('/event-details/service-provider/:serviceProviderId', eventDetailController.getEventByServiceProviderId);

router.put('/event-details/:eventId/edit', upload.any(), eventDetailController.updateEvent);

router.put('/event/cancel/:id', eventDetailController.cancelEvent);

router.delete('/event-details/:id', eventDetailController.deleteEvent);

// Blast tab update route
router.put('/event-details/:id/blast', eventDetailController.updateEventDetails);

//get bookings with event id

// router.get('/event-details/:id/bookings', eventDetailController.getBookingsByEventId);

//get booking with event id and service provider id
router.get('/booking-detail/:eventId/service-provider/:serviceProviderId', eventDetailController.getBookingByEventIdServiceProviderId);


// for admin
router.get('/event-details/admin', eventDetailController.listEvents);



// for startup
router.get('/event-details/:id', eventDetailController.getEvents);

router.get('/event-details', eventDetailController.listEvents);

// routes/eventRoutes.js (Add to your existing routes)

// Homepage filtering routes
router.get('/events/featured', eventDetailController.getFeaturedEvents);
router.get('/events/filter', eventDetailController.getEventsWithFilters);
// Event search route with pagination
router.get('/events/search', eventDetailController.searchEvents);
// Keep all your existing routes unchanged...

router.post("/events/export", eventDetailController.exportAllBookings);


//pricing route

router.post('/event-details/pricing' ,eventDetailController.pricingDetail )

// place booking

router.post('/event/place_order' ,eventDetailController.bookTickets)

//verify payment



router.post('/event/verify_payment' ,eventDetailController.verifyPayment)

// New free booking route
router.post('/event/book-free-tickets', eventDetailController.bookFreeTickets);


router.post("/event-feedback", eventDetailController.createFeedback);
router.get(
  "/event-feedback/:eventId/service-provider/:serviceProviderId",
  eventDetailController.getFeedbackByEventAndServiceProvider
);


// NEW: Bulk event invitation route

// Bulk invitation route WITHOUT multer middleware
router.post('/events/send-bulk-invitations', eventDetailController.sendBulkEventInvitations);

module.exports = router;