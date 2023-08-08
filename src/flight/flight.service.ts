import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { EntityManager, Repository } from 'typeorm';
import { AirlineDto } from './dto';
import { FlightDto } from './dto/flight.dto';
import { ScheduleDto } from './dto/schedule.dto';
import { StatusDto } from './dto/status.dto';
import { Airline } from './entities/airline.entity';
import { Flight } from './entities/flight.entity';
import { FlightSchedule } from './entities/flightSchedule.entity';
import { Status } from './entities/status.entity';

@Injectable()
export class FlightService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(FlightSchedule)
    private readonly flightScheduleRepository: Repository<FlightSchedule>,
    @InjectRepository(Flight)
    private readonly flightRepository: Repository<Flight>,
    private readonly entityManager: EntityManager,
    private schedulerRegistry: SchedulerRegistry, // IN MEMORY, NOT DISTRIBUTED IF MULTIPLE PODS RUNNING
  ) {
    // const flightCron = schedulerRegistry.getCronJob('generate_days_flights');
    const configService: ConfigService = new ConfigService();
    if (configService.getOrThrow('ENABLE_FLIGHT_CRON') === "true") {
      // flightCron.stop(); // stop cron if not enabled in env far (would rather reverse)
      this.generateDaysFlights('generate_days_flights');
    }
  }

  private readonly logger = new Logger(FlightService.name);

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

  async getStatuses(): Promise<Status[]> {
    const statuses = await this.statusRepository.find();
    return statuses;
  }

  async createStatus(dto: StatusDto) {
    // Insert status into db if it doesn't exist

    const newStatus = new Status({
      name: dto.name,
    });

    await this.entityManager.save(newStatus);
  }

  async getSchedule() { }

  async getAllSchedules() { }

  async createSchedule(dto: ScheduleDto) {
    const newSchedule = new FlightSchedule({
      ...dto
    });

    await this.entityManager.save(newSchedule);
  }

  async updateSchedule() {

  }

  async deleteSchedule() {

  }

  // EVERY_DAY_AT_MIDNIGHT for actual
  // EVERY_10_SECONDS for testing
  // If multiple pods are running, this could be a problem...
  // @Cron(CronExpression.EVERY_10_SECONDS, { name: 'generate_days_flights' })
  async generateDaysFlights(name: string) {

    const job = new CronJob(CronExpression.EVERY_10_SECONDS, async () => {

      this.logger.log('Generating this days flights...');

      const date = new Date();
      date.setDate(date.getDate() + 1); // Shift it to tomorrow
      const d = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      // Get latest date in flights table
      const latestFlight = await this.flightRepository.findOne({
        select: { flightDate: true },
        where: {},
        order: { flightDate: "DESC" }
      });

      // To make sure there is no time from the DB timestamp
      const latestFlightDate = new Date(
        latestFlight.flightDate.getFullYear(),
        latestFlight.flightDate.getMonth(),
        latestFlight.flightDate.getDate()
      );

      this.logger.log("===> Latest record");
      this.logger.log(latestFlight.flightDate);
      this.logger.log(d);
      this.logger.log(latestFlightDate);

      if (!(latestFlightDate < d)) {
        this.logger.log("Flights are up to date?");
        return;
      } else {
        this.logger.log("Get new flights");
      }

      // New flights need to be generated and added to the table
      // Get current day of the week
      const day = d.getDay();
      const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const dayObj = {};
      dayObj[weekday[day]] = true;
      this.logger.log(`Today is ${weekday[day]}`);

      const flightList = await this.flightScheduleRepository.find({
        where: dayObj,
        relations: { airline: true },
        order: { scheduledDepartureTime: "ASC" }
      });

      this.logger.log("List of flights");
      this.logger.log(flightList);

      // Status - get the ontime status
      let status: Status = await this.statusRepository.findOne({
        where: {
          name: "On Time"
        }
      });

      // Insert into flights - loop through
      let flights: Flight[] = [];
      flightList.forEach((flightSchedule: FlightSchedule, i) => {
        let flightObj = new FlightDto();
        flightObj.flightSchedule = flightSchedule;
        flightObj.estimatedDepartureTime = flightSchedule.scheduledDepartureTime;
        flightObj.flightDate = d; // TODO : not sure if this is best, do we want time?
        flightObj.status = status;

        this.logger.log("Flight Obj");
        this.logger.log(flightObj);

        const flightEntity = new Flight({
          ...flightObj
        });

        flights.push(flightEntity);

      });

      this.logger.log("Flights");
      this.logger.log(flights);

      await this.entityManager.save(flights);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `job ${name} added for every ${CronExpression.EVERY_10_SECONDS}!`,
    );
  }

}
