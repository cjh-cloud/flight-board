import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from './entities/airline.entity';
import { Status } from './entities/status.entity';
import { FlightSchedule } from './entities/schedule.entity';
import { Flight } from './entities/flight.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true, // so we can use events like flight.*
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Airline, Status, FlightSchedule, Flight]),
  ],
  providers: [FlightService],
  controllers: [FlightController]
})
export class FlightModule { }
