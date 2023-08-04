import { AbstractEntity } from "../../database/abstract.entity";
import { Column, Entity } from "typeorm";

// DB entity of Airline names

@Entity()
export class Airline extends AbstractEntity<Airline> {

  @Column({ unique: true })
  name: string;

}