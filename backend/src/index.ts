import http from 'http'
import { app } from './app.js'
import { env } from './config/env.js'
import { prisma } from './lib/prisma.js'
import { runStartupHealthChecks } from './lib/startupHealth.js'
import { attachSpeakingSignaling } from './realtime/speakingSignaling.js'

async function bootstrap() {
  await runStartupHealthChecks()

  const httpServer = http.createServer(app)
  // Live-partner speaking matchmaking + WebRTC signaling at ws://<host>/ws/speaking
  attachSpeakingSignaling(httpServer)

  const server = httpServer.listen(env.PORT, () => {
    console.log(`ProfAI API running on http://localhost:${env.PORT}`)
    console.log('Speaking signaling WebSocket ready at /ws/speaking')
  })

  const shutdown = async () => {
    console.log('Shutting down server...')
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

bootstrap().catch(async (error) => {
  console.error('Fatal startup error:', error)
  await prisma.$disconnect().catch(() => {
    // best-effort disconnect
  })
  process.exit(1)
})
