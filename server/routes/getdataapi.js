
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ 'start-message': 'Start your react project1' });
});

module.exports = router;  
