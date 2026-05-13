import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { runStartupHealthChecks } from './lib/startupHealth.js';
async function bootstrap() {
    await runStartupHealthChecks();
    const server = app.listen(env.PORT, () => {
        console.log(`Smart Test Pro API running on http://localhost:${env.PORT}`);
    });
    const shutdown = async () => {
        console.log('Shutting down server...');
        server.close(async () => {
            await prisma.$disconnect();
            process.exit(0);
        });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}
bootstrap().catch(async (error) => {
    console.error('Fatal startup error:', error);
    await prisma.$disconnect().catch(() => {
        // best-effort disconnect
    });
    process.exit(1);
});
