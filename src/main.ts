// NestJS 애플리케이션 시작점
// import { config } from 'dotenv'
//
// config({ path: '.env.staging' })

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  console.log(`📌 DATABASE_NAME: ${process.env.DB_USERNAME}`)
  console.log(`📌 DATABASE_HOST: ${process.env.DB_HOST}`)

  const app = await NestFactory.create(AppModule)
  const logger = new Logger('HTTP')

  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url}`)
    next()
  })

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // await app.listen(process.env.PORT ?? 3000)
  await app.listen(3000, '0.0.0.0')
}
bootstrap()
