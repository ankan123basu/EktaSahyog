export const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.name || 'ServerError'}: ${err.message}`);

    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.status || 500);

    res.status(statusCode).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
