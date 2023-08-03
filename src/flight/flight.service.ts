import { Injectable } from '@nestjs/common';

@Injectable()
export class FlightService {
  getHello(): string {
    return 'Hello World!';
  }
}
