import { AbstractEntity } from "../../database/abstract.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Airline } from "./airline.entity";
import { Flight } from "./flight.entity";

@Entity()
export class FlightSchedule extends AbstractEntity<FlightSchedule> {

  // Many flight schedules to one Airline
  @ManyToOne(() => Airline, (airline) => airline.flightSchedules)
  airline: Airline;

  // One Flight Schedule with many Airlines
  @OneToMany(() => Flight, (flight) => flight.flightSchedule, { cascade: true })
  flights: Flight[];

  @Column()
  flightNumber: number;

  @Column()
  destination: string;

  @Column('time')
  scheduledDepartureTime: Date; // Time, does not need date

  // departing / arriving -  arriving is false
  @Column()
  departing: boolean;

  // domestic / international - international is false
  @Column()
  domestic: boolean;

  @Column()
  monday: boolean;

  @Column()
  tuesday: boolean;

  @Column()
  wednesday: boolean;

  @Column()
  thursday: boolean;

  @Column()
  friday: boolean;

  @Column()
  saturday: boolean;

  @Column()
  sunday: boolean;

}