import { AbstractEntity } from "../../database/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { FlightSchedule } from "./schedule.entity";

// DB entity of Airline names

@Entity()
export class Airline extends AbstractEntity<Airline> {

  @Column({ unique: true })
  name: string;

  // One Airline with Many Flights
  @OneToMany(() => FlightSchedule, (flights) => flights.airline, { cascade: true })
  flightSchedules: FlightSchedule[];

}