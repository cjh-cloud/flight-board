import { AbstractEntity } from "../../database/abstract.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// DB entity of email and password hash

@Entity()
export class User extends AbstractEntity<User> {
  // @PrimaryGeneratedColumn()
  // id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  hash: string;

  @Column({ nullable: true })
  hashedRt: string;

  // constructor(listing: Partial<Listing>) {
  //   Object.assign(this, listing);
  // }
}