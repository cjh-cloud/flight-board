package main

import (
	"database/sql"
	"time"
)

type Schedule struct {
	ID int
	FlightNumber string
	Origin string
	Destination string
	ScheduleDepartureTime time.Time
	Domestic bool
	Monday bool
	Tuesday bool
	Wednesday bool
	Thursday bool
	Friday bool
	Saturday bool
	Sunday bool
	AirlineId int
}

type Flight struct {
	ID int `json:"id"`
	EstimatedDepartureTime time.Time
	ActualDepartureTime sql.NullTime
	FlightDate time.Time
	Display bool
	FlightScheduleId int
	StatusId int
}

type Status struct {
	ID int
	Name string
}
