// src/utils/responseHandler.js
const responseHandler = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        message,
        data
    });
};

export default responseHandler;
