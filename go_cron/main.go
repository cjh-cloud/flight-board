package main

import (
	"fmt"
	"log"
	"time"
)

// generate tomorrows flights

func main() {
	fmt.Println("🚀 Flight Generator ");

	// get tomorrows date
	today := time.Now()
	tomorrow := today.AddDate(0, 0, 1)

	fmt.Println("Today: ", today)
	fmt.Println("Tomorrow: ", tomorrow)

	store, err := NewPostgresStore()
	if err != nil {
		log.Fatal(err)
	}

	// get latest flight in table
	latestFlight, err := store.GetLatestFlight()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("latest flight: ", latestFlight.FlightDate.Local())

	// If latest flight is same as today, return
	// latestFlight.FlightDate.Local().Before(today)
	if today.After(latestFlight.FlightDate.Local()) {
		fmt.Println("Generating tomorrow's flights...")
	} else {
		fmt.Println("Flight's have already been generated. Exiting...")
		return
	}

	// get schedules where day of week is same as today
	schedules, err := store.GetTomorrowsSchedules()
	if err != nil {
		log.Fatal(err)
	}

	onTimeStatus, err := store.GetStatusId("On Time")
	if err != nil {
		log.Fatal(err)
	}

	// loop through each schedule and add flight to table - might need on time status
	for _, schedule := range schedules {
		flight := new(Flight)
		flight.EstimatedDepartureTime = schedule.ScheduleDepartureTime
		flight.FlightDate = time.Now().AddDate(0, 0, 1) // Need this to be time when writing to DB...
		flight.Display = true
		flight.FlightScheduleId = schedule.ID
		flight.StatusId = onTimeStatus.ID
		err := store.CreateFlight(flight)
		if err != nil {
			log.Fatal(err)
		}
	}

	fmt.Println("Finished generating flights. Exiting...")

}