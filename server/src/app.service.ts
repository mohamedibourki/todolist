import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger();

  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
