const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// Suscribirse
router.post('/subscribe', newsletterController.subscribe);
router.get('/verify', newsletterController.verify);
router.post('/unsubscribe', newsletterController.unsubscribe);
router.get('/subscribers', newsletterController.getSubscribers);
router.delete('/subscriber/:id', newsletterController.deleteSubscriber);
router.post('/send', newsletterController.sendNewsletter);


module.exports = router;
