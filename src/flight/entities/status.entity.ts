import { AbstractEntity } from "../../database/abstract.entity";
import { Column, Entity } from "typeorm";

// DB entity of Airline names

@Entity()
export class Status extends AbstractEntity<Status> {

  @Column({ unique: true })
  name: string;

}