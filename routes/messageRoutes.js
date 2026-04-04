const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markRead, deleteMessage } = require('../controllers/messageController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', sendMessage);
router.get('/', protect, adminOnly, getMessages);
router.put('/:id/read', protect, adminOnly, markRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;
