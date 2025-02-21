import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithRequest,
  VerifyCallbackWithRequest,
} from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'defaultSecretKey',
    })
  }

  async validate(payload: any): Promise<{ id: number; email: string }> {
    console.log('JWT payload: ', payload)
    return payload
  }
}
