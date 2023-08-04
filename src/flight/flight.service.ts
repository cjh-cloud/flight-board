import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AirlineDto } from './dto';
import { Airline } from './entities/airline.entity';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
    private readonly entityManager: EntityManager,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getAirlines(): Promise<Airline[]> {
    const airlines = await this.airlineRepository.find();
    return airlines;
  }

  async createAirline(dto: AirlineDto) {
    // Insert airline into db if it doesn't exist
    console.log(dto.name);

    const newAirline = new Airline({
      name: dto.name,
    });

    await this.entityManager.save(newAirline);
  }
}
