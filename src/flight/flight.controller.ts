import { Body, Controller, Get, MessageEvent, Param, ParseIntPipe, Post, Res, Sse } from '@nestjs/common';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
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
  constructor(
    private readonly flightService: FlightService,
    private eventEmitter: EventEmitter2,
  ) { }

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

  // ! This might send all events to any subsriber, frontend would have to sort
  // ? So far it looks like it actually works
  @Public()
  @OnEvent('flight.*')
  @Sse('sse/:id')
  sse(@Param("id", ParseIntPipe) flightId: number): Observable<MessageEvent> {
    console.log(`SSE CONTROLLER ${flightId}`);

    // return this.flightService.sse(flightId);
    return fromEvent(this.eventEmitter, `flight.${flightId}`).pipe(
      map((_) => ({ data: { hello: `world ${flightId}` } } as MessageEvent)),
    );
  }

  // These two endpoints return HTML that subscribes to an SSE
  @Public()
  @Get('ssetest')
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Public()
  @Get('ssetest2')
  index2(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index2.html')).toString());
  }

  // These two endpoints emit event to publish to SSE
  @Public()
  @Get('test')
  getTest() {
    return this.flightService.getTest();
  }

  @Public()
  @Get('test2')
  getTest2() {
    return this.flightService.getTest2();
  }

}
