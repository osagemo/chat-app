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
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
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

		message := Message{Type: messageType, Body: string(p)}
		c.Pool.BroadCast <- message
		fmt.Printf("Message Recieved And passed to channel %+v\n", message)
	}
}
