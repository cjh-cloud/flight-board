import { IsNotEmpty, IsString } from "class-validator";

export class AirlineDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}