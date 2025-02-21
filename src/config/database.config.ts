import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { InvestingLog } from '../investing-logs/entities/investing-log.entity'

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  /* DB 연결 설정 확인 로깅 */
  // console.log('📌 현재 환경:', process.env.NODE_ENV) // 현재 적용된 환경 출력
  // console.log('📌 DB_HOST:', process.env.DB_HOST) // 어떤 DB_HOST가 적용되는지 확인
  // console.log('📌 현재 DB 설정:', {
  //   host: configService.get<string>('DB_HOST'),
  //   port: configService.get<number>('DB_PORT'),
  //   username: configService.get<string>('DB_USERNAME'),
  //   password: configService.get<string>('DB_PASSWORD'),
  //   database: configService.get<string>('DB_NAME'),
  // })

  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [User, InvestingLog],
    synchronize: true,
    autoLoadEntities: true,
  }
}
