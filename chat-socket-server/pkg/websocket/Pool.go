package websocket

import "fmt"

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	BroadCast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		BroadCast:  make(chan Message),
	}
}

// The only place where we write to WebSocket connections.
// Using select to wait for multiple channel operations to avoid issues with concurrent writing
func (pool *Pool) Start() {
	for {
		{ // scope to avoid SA4011
			select {
			case client := <-pool.Register:
				pool.Clients[client] = true
				fmt.Printf("new Client connected: %s", client.ID)
				fmt.Println("Size of Connection Pool: ", len(pool.Clients))
				for client := range pool.Clients {
					client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined"})
				}
				break
			case client := <-pool.Unregister:
				delete(pool.Clients, client)
				fmt.Println("Size of Connection Pool: ", len(pool.Clients))
				for client := range pool.Clients {
					client.Conn.WriteJSON(Message{Type: 1, Body: "User disconnected"})
				}
				break
			case message := <-pool.BroadCast:
				fmt.Println("Broadcasting message to all clients: ", message.Body)
				for client := range pool.Clients {
					if err := client.Conn.WriteJSON(message); err != nil {
						fmt.Println(err)
						return
					}
				}
				break
			}
		}
	}
}
