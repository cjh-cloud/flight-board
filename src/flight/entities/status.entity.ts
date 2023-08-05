import { AbstractEntity } from "../../database/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Flight } from "./flight.entity";

// DB entity of Airline names

@Entity()
export class Status extends AbstractEntity<Status> {

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Flight, (flights) => flights.status, { cascade: true })
  flights: Flight[]

}