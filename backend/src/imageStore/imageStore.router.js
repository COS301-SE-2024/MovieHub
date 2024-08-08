import express from 'express';
import imageHandeling from './imageStore.controller';

const router = express.Router();

router.post('/saveImage', imageHandeling.uploadImage); // adds log with movie and date

module.exports = router;