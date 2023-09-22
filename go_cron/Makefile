# @ means command won't be printed
build:
	@go build -o bin/go_cron

# Call build first
run: build
	@./bin/go_cron

test:
	@go test -v ./...
