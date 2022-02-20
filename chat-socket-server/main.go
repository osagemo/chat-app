package main

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
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

func initRoutes() {
	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(rw, "HTTP Server")
	})

	// init pool
	pool := websocket.NewPool()
	go pool.Start()
	http.HandleFunc("/socket", func(rw http.ResponseWriter, r *http.Request) {
		wsHandler(pool, rw, r)
	})
}

// maintain a list of connections like map[*net.Conn]something, add when opened, remove when closed
// iterate through and send the same message to all connections
func main() {
	initRoutes()
	fmt.Println("Socket server v0, listening on port 8080")
	http.ListenAndServe(":8080", nil)
}
