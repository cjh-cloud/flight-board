# Dockerfile.distroless
FROM golang:1.21.1 as build

WORKDIR $GOPATH/src/app/

COPY . .

RUN go mod download
RUN go mod verify

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /main .

# App stage
FROM gcr.io/distroless/static-debian11

COPY --from=build /main .
COPY .env .

CMD ["./main"]
