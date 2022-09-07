package db

import (
	"context"
	"fmt"
	"os"
	"strconv"

	"github.com/go-redis/redis/v9"
)

type CacheDatabase struct {
	Client *redis.Client
}

var ctx = context.Background()

func NewCacheDatabase() (*CacheDatabase, error) {
	// default values
	var db = 0
	var password = ""
	var address = "redis:6379"

	// use environment variables if they exist
	if dbVal, dbValOk := os.LookupEnv("REDIS_DB"); dbValOk {
		i, err := strconv.Atoi(dbVal)
		if err == nil {
			db = i
		}
	}

	if pwVal, pwValOk := os.LookupEnv("REDIS_PASSWORD"); pwValOk {
		password = pwVal
	}

	if addressVal, addressValOk := os.LookupEnv("REDIS_ADDRESS"); addressValOk {
		address = addressVal
	}

	fmt.Printf("Connecting to Redis at %s, Password: %s, Database: %d \n", address, password, db)
	rdb := redis.NewClient(&redis.Options{
		Addr:     address,
		Password: password,
		DB:       db,
	})

	// ping before returning
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		return &CacheDatabase{}, err
	}

	return &CacheDatabase{Client: rdb}, nil
}

func (db *CacheDatabase) Get(key string) (string, error) {
	value, err := db.Client.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", err
	}
	if err != nil {
		panic(err)
	}

	return value, nil
}

func (db *CacheDatabase) Remove(key string) (bool, error) {
	_, err := db.Client.Del(ctx, key).Result()
	if err != nil {
		return false, err
	}

	return true, nil
}
