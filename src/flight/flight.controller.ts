import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { AirlineDto } from './dto';
import { Airline } from './entities/airline.entity';
import { FlightService } from './flight.service';

@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) { }

  @Get()
  getHello(): string {
    return this.flightService.getHello();
  }

  @Public()
  @Get('airline')
  getAirlines(): Promise<Airline[]> {
    return this.flightService.getAirlines();
  }

  @Public()
  @Post('airline')
  createAirline(@Body() dto: AirlineDto) {
    return this.flightService.createAirline(dto);
  }

}
