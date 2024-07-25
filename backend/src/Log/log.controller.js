import logService from './log.services';
import responseHandler from '../utils/responseHandler';

exports.addLog = async (req, res) => {
    const { uid, movieId, date } = req.body;
    try {
        const log = await logService.addLog(uid, movieId, date);
        if (log) {
            responseHandler(res, 201, 'Log added successfully', log);
        } else {
            res.status(400).json({ message: 'Error adding log' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error', error: e.message });
    }
} // adds log with movie and date

exports.editLog = async (req, res) => {
    const { uid, movieId, date, desc } = req.body;
    try {
        const log = await logService.editLog(uid, movieId, date, desc);
        if (log) {
            responseHandler(res, 200, 'Log updated successfully', log);
        } else {
            res.status(400).json({ message: 'Error updating log' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error', error: e.message });
    }
} // can update date and description

exports.removeLog = async (req, res) => {
    const { uid, movieId, date, desc } = req.body;
    try {
        const log = await logService.removeLog(uid, movieId, date, desc);
        if (log) {
            responseHandler(res, 200, 'Log removed successfully');
        } else {
            res.status(400).json({ message: 'Error removing log' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error', error: e.message });
    }
} // removes log

exports.getLogsOfUser = async (req, res) => {
    const uid = req.params.uid;
    try {
        const logs = await logService.getLogsOfUser(uid);
        if (logs) {
            responseHandler(res, 200, 'Logs fetched successfully', logs);
        } else {
            res.status(400).json({ message: 'Error fetching logs' });
        }

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error', error: e.message });
    }
} // returns all logs of user

 