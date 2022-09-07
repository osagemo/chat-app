package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/osagemo/chat-app/pkg/db"
	"github.com/osagemo/chat-app/pkg/ticket"
	"github.com/osagemo/chat-app/pkg/websocket"
)

func wsHandler(pool *websocket.Pool, rw http.ResponseWriter, r *http.Request) {
	fmt.Println("Websocket endpoint hit, upgrading connection...")
	conn, err := websocket.Upgrade(rw, r)
	if err != nil {
		fmt.Fprintf(rw, "%+V\n", err)
		return
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
		ID:   uuid.New().String(),
		User: websocket.User{Name: "Morgan", Id: 1},
	}

	pool.Register <- client
	client.Read()
}

func initRoutes(db *db.CacheDatabase) {
	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(rw, "HTTP Server")
		result, dbErr := db.Get("test")
		if dbErr != nil {
			log.Fatalf("Failed to connect to redis: %s", dbErr.Error())
		}
		fmt.Println(result)
	})

	http.HandleFunc("/testticket", func(rw http.ResponseWriter, r *http.Request) {
		valid, err := ticket.ValidateRequest(db, r)
		if err != nil {
			fmt.Printf("error while attempting to validate ticket: %s\n", err.Error())
		}
		fmt.Fprintf(rw, "Ticket is valid: %v", valid)
	})

	// init pool
	pool := websocket.NewPool()
	go pool.Start()
	http.HandleFunc("/socket", func(rw http.ResponseWriter, r *http.Request) {
		validRequest, err := ticket.ValidateRequest(db, r)
		if err != nil {
			fmt.Printf("error while attempting to validate ticket: %s\n", err.Error())
		}

		if validRequest {
			wsHandler(pool, rw, r)
		} else {
			fmt.Fprintf(rw, "Unauthorized")
		}
	})
}

// maintain a list of connections like map[*net.Conn]something, add when opened, remove when closed
// iterate through and send the same message to all connections
func main() {
	loadDotEnv()

	database, err := db.NewCacheDatabase()
	if err != nil {
		log.Fatalf("Failed to connect to redis: %s", err.Error())
	}

	initRoutes(database)
	fmt.Println("Socket server v0, listening on port 8080")
	http.ListenAndServe(":8080", nil)
}

func loadDotEnv() {
	if _, envOk := os.LookupEnv("ENV"); !envOk {
		err := godotenv.Load(".dev.env")
		if err != nil {
			log.Fatalf("Error loading .env file: %s", err.Error())
		}
	}
}
