import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Airline } from "../entities/airline.entity";
import { FlightSchedule } from "../entities/flightSchedule.entity";
import { Status } from "../entities/status.entity";

export class FlightDto {

  @IsNotEmpty()
  flightSchedule: FlightSchedule;

  @IsNotEmpty()
  estimatedDepartureTime: Date; // Time, does not need date

  actualDepartureTime: Date; // Time, does not need date

  @IsNotEmpty()
  @IsDate()
  flightDate: Date;

  @IsNotEmpty()
  status: Status;

  display: Boolean;


}