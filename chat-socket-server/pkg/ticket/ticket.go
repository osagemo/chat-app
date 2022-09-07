package ticket

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"time"

	"github.com/osagemo/chat-app/pkg/db"
)

type Ticket struct {
	IpAddress string `json:"ip"`
	IssuedAt  string `json:"issuedAt"`
	IssuedFor string `json:"issuedFor"`
}

func ValidateRequest(db *db.CacheDatabase, request *http.Request) (bool, error) {
	token := request.URL.Query().Get("WsTicket")
	ticketJson, dbErr := db.Get(token)
	if dbErr != nil {
		return false, dbErr
	}

	// remove ticket
	db.Remove(token)

	// extract ip, validate ticket
	ip, _, err := net.SplitHostPort(request.RemoteAddr)
	if err != nil {
		return false, fmt.Errorf("userip: %q is not IP:port", request.RemoteAddr)
	}
	userIP := net.ParseIP(ip)
	if userIP == nil {
		return false, fmt.Errorf("userip: %q is not IP:port", request.RemoteAddr)
	}

	valid, err := validateTicket(ticketJson, userIP)
	if err != nil {
		return false, err
	}

	return valid, nil
}

func validateTicket(ticketJson string, userIp net.IP) (bool, error) {
	var ticket Ticket
	err := json.Unmarshal([]byte(ticketJson), &ticket)
	if err != nil {
		return false, err
	}
	fmt.Printf("Validating Ticket: %v\n", ticket)

	// check ip
	ticketIp := net.ParseIP(ticket.IpAddress)
	ipMatch := userIp.Equal(ticketIp)
	if !ipMatch {
		return false, fmt.Errorf("request IP (%v) does not match ticket IP (%v)", userIp, ticket.IpAddress)
	}

	// check timestamp
	issuedAt, err := time.Parse(time.RFC3339, ticket.IssuedAt)
	if err != nil {
		return false, err
	}
	issuedAtValid := time.Now().UTC().Before(issuedAt.Add(time.Hour * 12))
	if !issuedAtValid {
		return false, fmt.Errorf("ticket not within last 12 hours: %v", issuedAt)
	}

	return true, nil
}
