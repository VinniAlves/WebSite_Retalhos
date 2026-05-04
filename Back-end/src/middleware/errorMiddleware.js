const errorHandler = (err, req, res, next) => {
    
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error occurred:`);
    console.error(`- Method: ${req.method}`);
    console.error(`- URL: ${req.originalUrl}`);
    console.error(`- Message: ${err.message}`);
    console.error(`- Stack: ${err.stack}`);

    if (res.headersSent) {
        return next(err);
    }

    const isProduction = process.env.NODE_ENV === 'production';
    
    res.status(err.status || 500).json({
        message: isProduction ? 'Ocorreu um erro interno no servidor.' : err.message,
        ...(isProduction ? {} : { stack: err.stack })
    });
};

module.exports = { errorHandler };
