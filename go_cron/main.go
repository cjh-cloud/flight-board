package main

import (
	"fmt"
	"log"
	"os"
	"time"
)

// Generate tomorrows flights
func main() {
	fmt.Println("🚀 Flight Generator ");

	store, err := NewPostgresStore()
	if err != nil {
		log.Fatal(err)
	}

	//init the loc
	loc, _ := time.LoadLocation(os.Getenv("TIMEZONE"))

	// get tomorrows date
	today := time.Now().In(loc)
	tomorrow := today.AddDate(0, 0, 1)

	// get latest flight in table
	latestFlight, err := store.GetLatestFlight()
	if err != nil {
		log.Fatal(err)
	}
	latestFlightNZT := latestFlight.FlightDate.In(loc) // Convert DB time to NZST/NZDT
	latestFlightMidnight := time.Date(
		latestFlightNZT.Year(),
		latestFlightNZT.Month(),
		latestFlightNZT.Day(),
		0, 0, 0, 0,
		loc,
	) // Create new date with latest flight, and set time to Midnight NZST/NZDT

	fmt.Println("Today: ", today)
	fmt.Println("Tomorrow: ", tomorrow)
	fmt.Println("latest flight: ", latestFlight.FlightDate.In(loc))

	fmt.Println("latest flight New: ", latestFlightMidnight)

	// If latest flight is same as today, return
	if today.After(latestFlightMidnight) {
		fmt.Println("Generating tomorrow's flights...")
	} else {
		fmt.Println("Flight's have already been generated. Exiting...")
		return // Exit main method
	}

	AddFlights(*store, tomorrow)

	fmt.Println("Finished generating flights. Exiting...")
}

// Add flights for a day (in this case, tomorrow)
func AddFlights(store PostgresStore, flightDate time.Time) {
	// get schedules where day of week is same as today
	schedules, err := store.GetDaySchedules(flightDate)
	if err != nil {
		log.Fatal(err)
	}

	onTimeStatus, err := store.GetStatusId("On Time")
	if err != nil {
		log.Fatal(err)
	}

	// loop through each schedule and add flight to table
	for _, schedule := range schedules {
		flight := new(Flight)
		flight.EstimatedDepartureTime = schedule.ScheduleDepartureTime
		flight.FlightDate = flightDate
		flight.Display = true
		flight.FlightScheduleId = schedule.ID
		flight.StatusId = onTimeStatus.ID
		err := store.CreateFlight(flight)
		if err != nil {
			log.Fatal(err)
		}
	}
}
