import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class FlightSearchDto {

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsBoolean()
  domestic: boolean;

  @IsNotEmpty()
  @IsBoolean()
  departing: boolean;

}