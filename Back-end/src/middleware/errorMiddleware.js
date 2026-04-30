const errorHandler = (err, req, res, next) => {
    // Log do erro no servidor (para o desenvolvedor ver no terminal/logs do VPS)
    console.error(`[Error] ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    // Se os cabeçalhos já foram enviados, delegamos para o handler padrão do Express
    if (res.headersSent) {
        return next(err);
    }

    // Resposta genérica para o cliente
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.status(err.status || 500).json({
        error: true,
        message: isProduction ? 'Ocorreu um erro interno no servidor.' : err.message,
        // Só envia o stack em desenvolvimento
        ...(isProduction ? {} : { stack: err.stack })
    });
};

module.exports = { errorHandler };
