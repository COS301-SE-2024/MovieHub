import express from 'express';
import logController from './log.controller';

const router = express.Router();

router.post('/add', logController.addLog); // adds log with movie and date

router.put('/edit', logController.editLog); // can update date and description

router.delete('/remove', logController.removeLog); // removes log

router.get('/:uid', logController.getLogsOfUser); // returns all logs of user

 
module.exports = router;