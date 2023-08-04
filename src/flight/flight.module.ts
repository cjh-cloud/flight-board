import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from './entities/airline.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airline]),
  ],
  providers: [FlightService],
  controllers: [FlightController]
})
export class FlightModule { }
