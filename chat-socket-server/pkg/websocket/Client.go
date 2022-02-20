package websocket

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string // connection identifier
	Conn *websocket.Conn
	Pool *Pool // the pool this client is a part of?
	User User
}

type User struct {
	Name string `json:"name"`
	Id   int    `json:"id"`
}

type Message struct {
	OpCode int
	Type   string `json:"type"`
	Body   string `json:"body"`
	User   User   `json:"user"`
}

func (c *Client) Read() {
	// cleanup
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		// "err" will trigger when client closes connection,
		// The return will trigger the above cleanup which will unregister the client from the pool
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		message := Message{OpCode: messageType, Type: "chat-message", Body: string(p), User: c.User}
		c.Pool.BroadCast <- message
		fmt.Printf("Message Recieved And passed to channel %+v\n", message)
	}
}
