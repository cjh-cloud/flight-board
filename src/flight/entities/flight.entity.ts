import { AbstractEntity } from "../../database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Airline } from "./airline.entity";
import { FlightSchedule } from "./flightSchedule.entity";
import { Status } from "./status.entity";

@Entity()
export class Flight extends AbstractEntity<Flight> {

  // Many flights to one flight schedule
  @ManyToOne(() => FlightSchedule, (flightSchedule) => flightSchedule.flights)
  flightSchedule: FlightSchedule;

  @Column('time', { nullable: true })
  estimatedDepartureTime: Date;

  @Column('time', { nullable: true })
  actualDepartureTime: Date;

  @Column()
  flightDate: Date; // Date the flight is on, cron job will generate this

  // Many flights to one status
  @ManyToOne(() => Status, (status) => status.flights)
  status: Status;

  @Column({ default: true })
  display: Boolean

}