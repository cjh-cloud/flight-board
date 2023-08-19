import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { AirlineDto } from './dto';
import { FlightSearchDto } from './dto/flightSearch.dto';
import { ScheduleDto } from './dto/schedule.dto';
import { StatusDto } from './dto/status.dto';
import { Airline } from './entities/airline.entity';
import { Flight } from './entities/flight.entity';
import { Status } from './entities/status.entity';
import { FlightService } from './flight.service';

@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) { }

  // @Get()
  // getHello(): string {
  //   return this.flightService.getHello();
  // }

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

  @Public()
  @Get('status')
  getStatuses(): Promise<Status[]> {
    return this.flightService.getStatuses();
  }

  @Public()
  @Post('status')
  createStatus(@Body() dto: StatusDto) {
    return this.flightService.createStatus(dto);
  }

  @Public()
  @Post('schedule')
  createSchedule(@Body() dto: ScheduleDto) {
    return this.flightService.createSchedule(dto);
  }

  @Public()
  @Get()
  getFlights(@Body() dto: FlightSearchDto): Promise<Flight[]> {
    return this.flightService.getFlights(dto);
  }

}
