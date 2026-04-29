 if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./src/app');
const db = require('./src/config/database');

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`[${process.env.NODE_ENV || 'development'}] API executando na porta ${port}`);
});


const gracefulShutdown = () => {
  console.log('Iniciando encerramento da aplicação (Graceful Shutdown)...');
  
  server.close(async () => {
    console.log('Servidor HTTP fechado. Não aceitando mais requisições.');
    try {
      if (db.pool) {
        await db.pool.end();
        console.log('Pool de conexões com o banco de dados encerrado.');
      }
      process.exit(0);
    } catch (err) {
      console.error('Erro ao encerrar conexões com o banco:', err);
      process.exit(1);
    }
  });


  setTimeout(() => {
    console.error('Encerramento forçado por tempo limite.');
    process.exit(1);
  }, 10000);
};


process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);