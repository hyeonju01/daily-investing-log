import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
  }

  getHello() : string {
    const host = this.configService.get<string>("HOST");
    const port= this.configService.get<number>("PORT", 3000);
    // return 'Hello World!';
    return `${host}:${port}`;
  }
}
