// backend/routes/serviceRoutes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ msg: "Services route working" }]);
});

export default router;