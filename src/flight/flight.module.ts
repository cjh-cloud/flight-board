import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from './entities/airline.entity';
import { Status } from './entities/status.entity';
import { FlightSchedule } from './entities/flightSchedule.entity';
import { Flight } from './entities/flight.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airline, Status, FlightSchedule, Flight]),
  ],
  providers: [FlightService],
  controllers: [FlightController]
})
export class FlightModule { }
