// NestJS 애플리케이션 시작점
// import { config } from 'dotenv'
//
// config({ path: '.env.staging' })

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  console.log(`📌 DATABASE_NAME: ${process.env.DB_USERNAME}`)
  console.log(`📌 DATABASE_HOST: ${process.env.DB_HOST}`)

  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
