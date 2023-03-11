FROM golang:1.20-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY *.go ./

RUN go build -o /go-example-app

CMD ["/go-example-app"]
