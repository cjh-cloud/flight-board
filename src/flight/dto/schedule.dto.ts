import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Airline } from "../entities/airline.entity";

export class ScheduleDto {
  @IsNotEmpty()
  // @IsNumber()
  airline: Airline; // Or should it be id of airline?

  @IsNotEmpty()
  @IsString()
  flightNumber: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsDate()
  scheduledDepartureTime: Date; // Time, does not need date

  // departing / arriving -  arriving is false
  @IsNotEmpty()
  @IsBoolean()
  departing: boolean;

  // domestic / international - international is false
  @IsNotEmpty()
  @IsBoolean()
  domestic: boolean;

  @IsNotEmpty()
  @IsBoolean()
  monday: boolean;

  @IsNotEmpty()
  @IsBoolean()
  tuesday: boolean;

  @IsNotEmpty()
  @IsBoolean()
  wednesday: boolean;

  @IsNotEmpty()
  @IsBoolean()
  thursday: boolean;

  @IsNotEmpty()
  @IsBoolean()
  friday: boolean;

  @IsNotEmpty()
  @IsBoolean()
  saturday: boolean;

  @IsNotEmpty()
  @IsBoolean()
  sunday: boolean;
}