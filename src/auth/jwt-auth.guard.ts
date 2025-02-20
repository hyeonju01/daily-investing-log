import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }
}
