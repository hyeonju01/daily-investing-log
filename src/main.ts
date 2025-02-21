// NestJS 애플리케이션 시작점
import { config } from 'dotenv'

config({ path: '.env.test' })

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  console.log(`🚀 NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`📌 DATABASE_NAME: ${process.env.DATABASE_NAME}`)
  console.log(`📌 DATABASE_HOST: ${process.env.DATABASE_HOST}`)

  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
