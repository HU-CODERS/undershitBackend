const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

router.post('/subscribe', newsletterController.subscribe);
router.get('/subscribers', newsletterController.getSubscribers);
router.delete('/:id', newsletterController.deleteSubscriber);
router.post('/send', newsletterController.sendNewsletter);

module.exports = router;
