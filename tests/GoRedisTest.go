package main

import (
	"context"
	"fmt"
	"log"
	"time"

	// go-redis imports
	"github.com/redis/go-redis/v9"

	// Valkey Glide imports
	"github.com/valkey-io/valkey-glide/go/v2"
	"github.com/valkey-io/valkey-glide/go/v2/config"
	"github.com/valkey-io/valkey-glide/go/v2/models"
	"github.com/valkey-io/valkey-glide/go/v2/options"
	"github.com/valkey-io/valkey-glide/go/v2/pipeline"
)

var ctx = context.Background()

func main() {
	fmt.Println("=== go-redis to Valkey Glide Migration Test ===\n")

	// Test connection setup
	testConnectionSetup()

	// Test basic string operations
	testStringOperations()

	// Test key operations
	testKeyOperations()

	// Test hash operations
	testHashOperations()

	// Test list operations
	testListOperations()

	// Test set operations
	testSetOperations()

	// Test sorted set operations
	testSortedSetOperations()

	// Test advanced operations
	testAdvancedOperations()

	fmt.Println("\n=== All tests completed ===")
}

func testConnectionSetup() {
	fmt.Println("--- Testing Connection Setup ---")

	// go-redis connection
	fmt.Println("go-redis connection:")
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	defer rdb.Close()

	pong, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Printf("go-redis connection failed: %v", err)
	} else {
		fmt.Printf("go-redis PING: %s\n", pong)
	}

	// Valkey Glide connection
	fmt.Println("Valkey Glide connection:")
	client, err := glide.NewClient(&config.ClientConfiguration{
		Addresses: []config.NodeAddress{
			{Host: "localhost", Port: 6379},
		},
	})
	if err != nil {
		log.Printf("Glide connection failed: %v", err)
		return
	}
	defer client.Close()

	pong, err = client.Ping(ctx)
	if err != nil {
		log.Printf("Glide connection failed: %v", err)
	} else {
		fmt.Printf("Glide PING: %s\n", pong)
	}

	fmt.Println()
}

func testStringOperations() {
	fmt.Println("--- Testing String Operations ---")

	// Setup clients
	rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	defer rdb.Close()

	client, err := glide.NewClient(&config.ClientConfiguration{
		Addresses: []config.NodeAddress{{Host: "localhost", Port: 6379}},
	})
	if err != nil {
		log.Printf("Failed to create Glide client: %v", err)
		return
	}
	defer client.Close()

	// Test SET and GET
	fmt.Println("Testing SET and GET:")

	// go-redis
	err = rdb.Set(ctx, "test:string", "hello world", 0).Err()
	if err != nil {
		log.Printf("go-redis SET failed: %v", err)
	}
	val, err := rdb.Get(ctx, "test:string").Result()
	if err != nil {
		log.Printf("go-redis GET failed: %v", err)
	} else {
		fmt.Printf("go-redis GET: %s\n", val)
	}

	// Glide
	_, err = client.Set(ctx, "test:string:glide", "hello world")
	if err != nil {
		log.Printf("Glide SET failed: %v", err)
	}
	result, err := client.Get(ctx, "test:string:glide")
	if err != nil {
		log.Printf("Glide GET failed: %v", err)
	} else {
		fmt.Printf("Glide GET: %s\n", result.Value())
	}

	// Test MSET and MGET
	fmt.Println("Testing MSET and MGET:")

	// go-redis
	err = rdb.MSet(ctx, map[string]interface{}{
		"test:key1": "value1",
		"test:key2": "value2",
	}).Err()
	if err != nil {
		log.Printf("go-redis MSET failed: %v", err)
	}
	values, err := rdb.MGet(ctx, "test:key1", "test:key2").Result()
	if err != nil {
		log.Printf("go-redis MGET failed: %v", err)
	} else {
		fmt.Printf("go-redis MGET: %v\n", values)
	}

	// Glide
	_, err = client.MSet(ctx, map[string]string{
		"test:glide:key1": "value1",
		"test:glide:key2": "value2",
	})
	if err != nil {
		log.Printf("Glide MSET failed: %v", err)
	}
	glideValues, err := client.MGet(ctx, []string{"test:glide:key1", "test:glide:key2"})
	if err != nil {
		log.Printf("Glide MGET failed: %v", err)
	} else {
		var vals []string
		for _, v := range glideValues {
			if v.IsNil() {
				vals = append(vals, "nil")
			} else {
				vals = append(vals, v.Value())
			}
		}
		fmt.Printf("Glide MGET: %v\n", vals)
	}

	// Test INCR
	fmt.Println("Testing INCR:")

	// go-redis
	counter, err := rdb.Incr(ctx, "test:counter").Result()
	if err != nil {
		log.Printf("go-redis INCR failed: %v", err)
	} else {
		fmt.Printf("go-redis INCR: %d\n", counter)
	}

	// Glide
	glideCounter, err := client.Incr(ctx, "test:glide:counter")
	if err != nil {
		log.Printf("Glide INCR failed: %v", err)
	} else {
		fmt.Printf("Glide INCR: %d\n", glideCounter)
	}

	fmt.Println()
}

func testKeyOperations() {
	fmt.Println("--- Testing Key Operations ---")

	// Setup clients
	rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	defer rdb.Close()

	client, err := glide.NewClient(&config.ClientConfiguration{
		Addresses: []config.NodeAddress{{Host: "localhost", Port: 6379}},
	})
	if err != nil {
		log.Printf("Failed to create Glide client: %v", err)
		return
	}
	defer client.Close()

	// Test EXISTS
	fmt.Println("Testing EXISTS:")

	// Set up test data
	rdb.Set(ctx, "test:exists", "value", 0)
	client.Set(ctx, "test:glide:exists", "value")

	// go-redis
	exists, err := rdb.Exists(ctx, "test:exists", "test:nonexistent").Result()
	if err != nil {
		log.Printf("go-redis EXISTS failed: %v", err)
	} else {
		fmt.Printf("go-redis EXISTS: %d\n", exists)
	}

	// Glide
	glideExists, err := client.Exists(ctx, []string{"test:glide:exists", "test:nonexistent"})
	if err != nil {
		log.Printf("Glide EXISTS failed: %v", err)
	} else {
		fmt.Printf("Glide EXISTS: %d\n", glideExists)
	}

	// Test EXPIRE and TTL
	fmt.Println("Testing EXPIRE and TTL:")

	// go-redis
	rdb.Set(ctx, "test:expire", "value", 0)
	success, err := rdb.Expire(ctx, "test:expire", 10*time.Second).Result()
	if err != nil {
		log.Printf("go-redis EXPIRE failed: %v", err)
	} else {
		fmt.Printf("go-redis EXPIRE: %t\n", success)
	}
	ttl, err := rdb.TTL(ctx, "test:expire").Result()
	if err != nil {
		log.Printf("go-redis TTL failed: %v", err)
	} else {
		fmt.Printf("go-redis TTL: %v\n", ttl)
	}

	// Glide
	client.Set(ctx, "test:glide:expire", "value")
	glideSuccess, err := client.Expire(ctx, "test:glide:expire", 10*time.Second)
	if err != nil {
		log.Printf("Glide EXPIRE failed: %v", err)
	} else {
		fmt.Printf("Glide EXPIRE: %t\n", glideSuccess)
	}
	glideTtl, err := client.TTL(ctx, "test:glide:expire")
	if err != nil {
		log.Printf("Glide TTL failed: %v", err)
	} else {
		fmt.Printf("Glide TTL: %d seconds\n", glideTtl)
	}

	fmt.Println()
}

func testHashOperations() {
	fmt.Println("--- Testing Hash Operations ---")

	// Setup clients
	rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	defer rdb.Close()

	client, err := glide.NewClient(&config.ClientConfiguration{
		Addresses: []config.NodeAddress{{Host: "localhost", Port: 6379}},
	})
	if err != nil {
		log.Printf("Failed to create Glide client: %v", err)
		return
	}
	defer client.Close()

	// Test HSET and HGET
	fmt.Println("Testing HSET and HGET:")

	// go-redis
	result, err := rdb.HSet(ctx, "test:hash", "field1", "value1", "field2", "value2").Result()
	if err != nil {
		log.Printf("go-redis HSET failed: %v", err)
	} else {
		fmt.Printf("go-redis HSET: %d fields set\n", result)
	}
	value, err := rdb.HGet(ctx, "test:hash", "field1").Result()
	if err != nil {
		log.Printf("go-redis HGET failed: %v", err)
	} else {
		fmt.Printf("go-redis HGET: %s\n", value)
	}

	// Glide
	glideResult, err := client.HSet(ctx, "test:glide:hash", map[string]string{
		"field1": "value1",
		"field2": "value2",
	})
	if err != nil {
		log.Printf("Glide HSET failed: %v", err)
	} else {
		fmt.Printf("Glide HSET: %d fields set\n", glideResult)
	}
	glideValue, err := client.HGet(ctx, "test:glide:hash", "field1")
	if err != nil {
		log.Printf("Glide HGET failed: %v", err)
	} else {
		fmt.Printf("Glide HGET: %s\n", glideValue.Value())
	}

	// Test HGETALL
	fmt.Println("Testing HGETALL:")

	// go-redis
	hash, err := rdb.HGetAll(ctx, "test:hash").Result()
	if err != nil {
		log.Printf("go-redis HGETALL failed: %v", err)
	} else {
		fmt.Printf("go-redis HGETALL: %v\n", hash)
	}

	// Glide
	glideHash, err := client.HGetAll(ctx, "test:glide:hash")
	if err != nil {
		log.Printf("Glide HGETALL failed: %v", err)
	} else {
		fmt.Printf("Glide HGETALL: %v\n", glideHash)
	}

	fmt.Println()
}

func testListOperations() {
	fmt.Println("--- Testing List Operations ---")

	// Setup clients
	rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	defer rdb.Close()

	client, err := glide.NewClient(&config.ClientConfiguration{
		Addresses: []config.NodeAddress{{Host: "localhost", Port: 6379}},
	})
	if err != nil {
		log.Printf("Failed to create Glide client: %v", err)
		return
	}
	defer client.Close()

	// Test LPUSH and RPUSH
	fmt.Println("Testing LPUSH and RPUSH:")

	// go-redis
	length, err := rdb.LPush(ctx, "test:list", "element1", "element2").Result()
	if err != nil {
		log.Printf("go-redis LPUSH failed: %v", err)
	} else {
		fmt.Printf("go-redis LPUSH: list length %d\n", length)
	}
	length, err = rdb.RPush(ctx, "test:list", "element3").Result()
	if err != nil {
		log.Printf("go-redis RPUSH failed: %v", err)
	} else {
		fmt.Printf("go-redis RPUSH: list length %d\n", length)
	}

	// Glide
	glideLength, err := client.LPush(ctx, "test:glide:list", []string{"element1", "element2"})
	if err != nil {
		log.Printf("Glide LPUSH failed: %v", err)
	} else {
		fmt.Printf("Glide LPUSH: list length %d\n", glideLength)
	}
	glideLength, err = client.RPush(ctx, "test:glide:list", []string{"element3"})
	if err != nil {
		log.Printf("Glide RPUSH failed: %v", err)
	} else {
		fmt.Printf("Glide RPUSH: list length %d\n", glideLength)
	}

	// Test LRANGE
	fmt.Println("Testing LRANGE:")

	// go-redis
	elements, err := rdb.LRange(ctx, "test:list", 0, -1).Result()
	if err != nil {
		log.Printf("go-redis LRANGE failed: %v", err)
	} else {
		fmt.Printf("go-redis LRANGE: %v\n", elements)
	}

	// Glide
	glideElements, err := client.LRange(ctx, "test:glide:list", 0, -1)
	if err != nil {
		log.Printf("Glide LRANGE failed: %v", err)
	} else {
		fmt.Printf("Glide LRANGE: %v\n", glideElements)
	}

	fmt.Println()
}

func testSetOperations() {
	fmt.Println("--- Testing Set Operations ---")

	// Setup clients
	rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	defer rdb.Close()

	client, err := glide.NewClient(&config.ClientConfiguration{
		Addresses: []config.NodeAddress{{Host: "localhost", Port: 6379}},
	})
	if err != nil {
		log.Printf("Failed to create Glide client: %v", err)
		return
	}
	defer client.Close()

	// Test SADD
	fmt.Println("Testing SADD:")

	// go-redis
	added, err := rdb.SAdd(ctx, "test:set", "member1", "member2", "member3").Result()
	if err != nil {
		log.Printf("go-redis SADD failed: %v", err)
	} else {
		fmt.Printf("go-redis SADD: %d members added\n", added)
	}

	// Glide
	glideAdded, err := client.SAdd(ctx, "test:glide:set", []string{"member1", "member2", "member3"})
	if err != nil {
		log.Printf("Glide SADD failed: %v", err)
	} else {
		fmt.Printf("Glide SADD: %d members added\n", glideAdded)
	}

	// Test SMEMBERS
	fmt.Println("Testing SMEMBERS:")

	// go-redis
	members, err := rdb.SMembers(ctx, "test:set").Result()
	if err != nil {
		log.Printf("go-redis SMEMBERS failed: %v", err)
	} else {
		fmt.Printf("go-redis SMEMBERS: %v\n", members)
	}

	// Glide
	glideMembers, err := client.SMembers(ctx, "test:glide:set")
	if err != nil {
		log.Printf("Glide SMEMBERS failed: %v", err)
	} else {
		var memberSlice []string
		for member := range glideMembers {
			memberSlice = append(memberSlice, member)
		}
		fmt.Printf("Glide SMEMBERS: %v\n", memberSlice)
	}

	// Test SISMEMBER
	fmt.Println("Testing SISMEMBER:")

	// go-redis
	isMember, err := rdb.SIsMember(ctx, "test:set", "member1").Result()
	if err != nil {
		log.Printf("go-redis SISMEMBER failed: %v", err)
	} else {
		fmt.Printf("go-redis SISMEMBER: %t\n", isMember)
	}

	// Glide
	glideIsMember, err := client.SIsMember(ctx, "test:glide:set", "member1")
	if err != nil {
		log.Printf("Glide SISMEMBER failed: %v", err)
	} else {
		fmt.Printf("Glide SISMEMBER: %t\n", glideIsMember)
	}

	fmt.Println()
}

func testSortedSetOperations() {
	fmt.Println("--- Testing Sorted Set Operations ---")

	// Setup clients
	rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	defer rdb.Close()

	client, err := glide.NewClient(&config.ClientConfiguration{
		Addresses: []config.NodeAddress{{Host: "localhost", Port: 6379}},
	})
	if err != nil {
		log.Printf("Failed to create Glide client: %v", err)
		return
	}
	defer client.Close()

	// Test ZADD
	fmt.Println("Testing ZADD:")

	// go-redis
	added, err := rdb.ZAdd(ctx, "test:zset",
		redis.Z{Score: 1, Member: "member1"},
		redis.Z{Score: 2, Member: "member2"},
		redis.Z{Score: 3, Member: "member3"},
	).Result()
	if err != nil {
		log.Printf("go-redis ZADD failed: %v", err)
	} else {
		fmt.Printf("go-redis ZADD: %d members added\n", added)
	}

	// Glide
	glideAdded, err := client.ZAdd(ctx, "test:glide:zset", map[string]float64{
		"member1": 1.0,
		"member2": 2.0,
		"member3": 3.0,
	})
	if err != nil {
		log.Printf("Glide ZADD failed: %v", err)
	} else {
		fmt.Printf("Glide ZADD: %d members added\n", glideAdded)
	}

	// Test ZRANGE
	fmt.Println("Testing ZRANGE:")

	// go-redis
	members, err := rdb.ZRange(ctx, "test:zset", 0, -1).Result()
	if err != nil {
		log.Printf("go-redis ZRANGE failed: %v", err)
	} else {
		fmt.Printf("go-redis ZRANGE: %v\n", members)
	}

	// Glide
	glideMembers, err := client.ZRange(ctx, "test:glide:zset", options.RangeByIndex{Start: 0, End: -1})
	if err != nil {
		log.Printf("Glide ZRANGE failed: %v", err)
	} else {
		fmt.Printf("Glide ZRANGE: %v\n", glideMembers)
	}

	// Test ZRANK
	fmt.Println("Testing ZRANK:")

	// go-redis
	rank, err := rdb.ZRank(ctx, "test:zset", "member2").Result()
	if err != nil {
		log.Printf("go-redis ZRANK failed: %v", err)
	} else {
		fmt.Printf("go-redis ZRANK: %d\n", rank)
	}

	// Glide
	glideRank, err := client.ZRank(ctx, "test:glide:zset", "member2")
	if err != nil {
		log.Printf("Glide ZRANK failed: %v", err)
	} else {
		fmt.Printf("Glide ZRANK: %d\n", glideRank.Value())
	}

	fmt.Println()
}

func testAdvancedOperations() {
	fmt.Println("--- Testing Advanced Operations ---")

	// Setup clients
	rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
	defer rdb.Close()

	client, err := glide.NewClient(&config.ClientConfiguration{
		Addresses: []config.NodeAddress{{Host: "localhost", Port: 6379}},
	})
	if err != nil {
		log.Printf("Failed to create Glide client: %v", err)
		return
	}
	defer client.Close()

	// Test Transactions
	fmt.Println("Testing Transactions:")

	// go-redis
	pipe := rdb.TxPipeline()
	pipe.Set(ctx, "test:tx:key1", "value1", 0)
	pipe.Set(ctx, "test:tx:key2", "value2", 0)
	pipe.Incr(ctx, "test:tx:counter")
	results, err := pipe.Exec(ctx)
	if err != nil {
		log.Printf("go-redis transaction failed: %v", err)
	} else {
		fmt.Printf("go-redis transaction: %d commands executed\n", len(results))
	}

	// Glide
	batch := pipeline.NewStandaloneBatch()
	batch.Set("test:glide:tx:key1", "value1")
	batch.Set("test:glide:tx:key2", "value2")
	batch.Incr("test:glide:tx:counter")
	glideResults, err := client.Exec(ctx, batch, false)
	if err != nil {
		log.Printf("Glide transaction failed: %v", err)
	} else {
		fmt.Printf("Glide transaction: %d commands executed\n", len(glideResults))
	}

	// Test Lua Scripts
	fmt.Println("Testing Lua Scripts:")

	scriptCode := `
		local key = KEYS[1]
		local value = ARGV[1]
		redis.call('SET', key, value)
		return redis.call('GET', key)
	`

	// go-redis
	result, err := rdb.Eval(ctx, scriptCode, []string{"test:script:key"}, "script_value").Result()
	if err != nil {
		log.Printf("go-redis script failed: %v", err)
	} else {
		fmt.Printf("go-redis script result: %v\n", result)
	}

	// Glide
	script := options.NewScript(scriptCode)
	glideResult, err := client.InvokeScriptWithOptions(ctx, script, options.ScriptOptions{
		Keys: []string{"test:glide:script:key"},
		Args: []string{"script_value"},
	})
	if err != nil {
		log.Printf("Glide script failed: %v", err)
	} else {
		fmt.Printf("Glide script result: %v\n", glideResult)
	}

	// Test Custom Commands
	fmt.Println("Testing Custom Commands:")

	// go-redis
	customResult, err := rdb.Do(ctx, "PING").Result()
	if err != nil {
		log.Printf("go-redis custom command failed: %v", err)
	} else {
		fmt.Printf("go-redis custom PING: %v\n", customResult)
	}

	// Glide
	glideCustomResult, err := client.CustomCommand(ctx, []string{"PING"})
	if err != nil {
		log.Printf("Glide custom command failed: %v", err)
	} else {
		fmt.Printf("Glide custom PING: %v\n", glideCustomResult)
	}

	fmt.Println()
}
