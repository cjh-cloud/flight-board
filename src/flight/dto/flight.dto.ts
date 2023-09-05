import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { FlightSchedule } from "../entities/schedule.entity";
import { Status } from "../entities/status.entity";

export class FlightDto {

  // Optional, used when updating but not creating
  @IsNumber()
  id: number;

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

  @IsBoolean()
  display: Boolean;

}