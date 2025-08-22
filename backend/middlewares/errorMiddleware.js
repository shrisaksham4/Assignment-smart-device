const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalURL}`);
    res.status(404);
    next(error);
}

const errorHandler = (req, res, next) => {
    const statusCode = res.status === 200 ? 500 : res.status;
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}

module.exports = {notFound, errorHandler}