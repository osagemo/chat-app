package db

import (
	"context"
	"os"
	"strconv"

	"github.com/go-redis/redis/v9"
)

type CacheDatabase struct {
	Client *redis.Client
}

var ctx = context.Background()

func NewCacheDatabase() (*CacheDatabase, error) {
	var db = 0
	var password = ""

	if dbVal, dbValOk := os.LookupEnv("REDIS_DB"); dbValOk {
		i, err := strconv.Atoi(dbVal)
		if err == nil {
			db = i
		}
	}

	if pwVal, pwValOk := os.LookupEnv("REDIS_PASSWORD"); pwValOk {
		password = pwVal
	}

	rdb := redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: password,
		DB:       db,
	})

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		return &CacheDatabase{}, err
	}

	return &CacheDatabase{Client: rdb}, nil
}

func (db *CacheDatabase) Get(key string) (string, error) {
	value, err := db.Client.Get(ctx, key).Result()
	if err != nil {
		return "", err
	}

	return value, nil
}
