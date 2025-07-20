# Migration Guide: go-redis to Valkey Glide

This guide provides a **comprehensive comparison** of how to migrate from **go-redis to Valkey Glide**, with side-by-side code examples to make the transition as smooth as possible.

## Installation

```bash
go get github.com/valkey-io/valkey-glide/go/v2
go mod tidy
```

## Connection Setup

### Constructor Differences

- **go-redis** offers multiple client types and configuration options for different connection scenarios
- **Glide** uses a **single configuration object** that comes pre-configured with best practices

Glide typically requires minimal configuration changes for:
- Timeout settings
- TLS configuration
- Read from replica settings
- User authentication (username & password)

For advanced configurations, refer to the **[Valkey Glide Wiki - Go](https://github.com/valkey-io/valkey-glide/wiki/Go-wrapper)**.

<details>
<summary><b style="font-size:22px;">Standalone Mode</b></summary>

**go-redis**
```go
import (
    "context"
    "github.com/redis/go-redis/v9"
)

var ctx = context.Background()

// Simple connection
rdb := redis.NewClient(&redis.Options{
    Addr: "localhost:6379",
})

// With options
rdbWithOptions := redis.NewClient(&redis.Options{
    Addr:     "localhost:6379",
    Username: "user",
    Password: "password",
})
```

**Glide**
```go
import (
    "context"
    "github.com/valkey-io/valkey-glide/go/v2"
    "github.com/valkey-io/valkey-glide/go/v2/config"
)

var ctx = context.Background()

// Simple connection
client, err := glide.NewClient(&config.ClientConfiguration{
    Addresses: []config.NodeAddress{
        {Host: "localhost", Port: 6379},
    },
})

// With options
clientWithOptions, err := glide.NewClient(&config.ClientConfiguration{
    Addresses: []config.NodeAddress{
        {Host: "localhost", Port: 6379},
    },
    UseTLS: true,
    Credentials: &config.ServerCredentials{
        Username: "user",
        Password: "password",
    },
    ReadFrom: config.ReadFromAZAffinity,
    RequestTimeout: 2000 * time.Millisecond,
    ConnectionBackoff: &config.ConnectionBackoffStrategy{
        NumberOfRetries: 5,
        Factor:          2,
        ExponentBase:    2,
        JitterPercent:   10,
    },
    AdvancedConfiguration: &config.AdvancedClientConfiguration{
        ConnectionTimeout: 5000 * time.Millisecond,
        TLSAdvancedConfiguration: &config.TLSAdvancedConfiguration{
            UseInsecureTLS: false,
        },
    },
    DatabaseId: 0,
})
```

</details>

<details>
<summary><b style="font-size:22px;">Cluster Mode</b></summary>

**go-redis**  
```go
import (
    "github.com/redis/go-redis/v9"
)

cluster := redis.NewClusterClient(&redis.ClusterOptions{
    Addrs: []string{"127.0.0.1:6379", "127.0.0.1:6380"},
})

// With options
clusterWithOptions := redis.NewClusterClient(&redis.ClusterOptions{
    Addrs:    []string{"127.0.0.1:6379", "127.0.0.1:6380"},
    Username: "user",
    Password: "password",
})
```

**Glide**  
```go
import (
    "github.com/valkey-io/valkey-glide/go/v2"
    "github.com/valkey-io/valkey-glide/go/v2/config"
)

client, err := glide.NewClusterClient(&config.ClusterClientConfiguration{
    Addresses: []config.NodeAddress{
        {Host: "127.0.0.1", Port: 6379},
        {Host: "127.0.0.1", Port: 6380},
    },
})

// With options
clientWithOptions, err := glide.NewClusterClient(&config.ClusterClientConfiguration{
    Addresses: []config.NodeAddress{
        {Host: "127.0.0.1", Port: 6379},
        {Host: "127.0.0.1", Port: 6380},
    },
    UseTLS: true,
    Credentials: &config.ServerCredentials{
        Username: "user",
        Password: "password",
    },
    ReadFrom: config.ReadFromAZAffinity,
    RequestTimeout: 2000 * time.Millisecond,
    ConnectionBackoff: &config.ConnectionBackoffStrategy{
        NumberOfRetries: 5,
        Factor:          2,
        ExponentBase:    2,
        JitterPercent:   10,
    },
    AdvancedConfiguration: &config.AdvancedClusterClientConfiguration{
        ConnectionTimeout: 5000 * time.Millisecond,
        TLSAdvancedConfiguration: &config.TLSAdvancedConfiguration{
            UseInsecureTLS: false,
        },
    },
})
```

</details>

<details>
<summary><b style="font-size:22px;">Constructor Parameters Comparison</b></summary>

The table below compares **go-redis options** with **Glide configuration parameters**:

| **go-redis Parameter** | **Equivalent Glide Configuration** |
|--------------------------|--------------------------------------|
| `Addr: string`           | `Addresses: []config.NodeAddress{{Host: string, Port: int}}` |
| `Username: string`       | `Credentials: &config.ServerCredentials{Username: string}` |
| `Password: string`       | `Credentials: &config.ServerCredentials{Password: string}` |
| `DB: int`                | `DatabaseId: int` |
| `TLSConfig: *tls.Config` | `UseTLS: true` |
| `DialTimeout: time.Duration` | `RequestTimeout: time.Duration` |
| `ReadTimeout: time.Duration` | `RequestTimeout: time.Duration` |
| `WriteTimeout: time.Duration` | `RequestTimeout: time.Duration` |
| `MaxRetries: int`        | `ConnectionBackoff: &config.ConnectionBackoffStrategy{NumberOfRetries: int}` |
| `MinRetryBackoff: time.Duration` | `ConnectionBackoff: &config.ConnectionBackoffStrategy{Factor: int, ExponentBase: int}` |
| `MaxRetryBackoff: time.Duration` | `ConnectionBackoff: &config.ConnectionBackoffStrategy{Factor: int, ExponentBase: int}` |
| `ClientName: string`     | `ClientName: string` |
| `ReadFrom: ReadFrom`     | `ReadFrom: config.ReadFrom.Replica` / `config.ReadFrom.PreferReplica` / `config.ReadFrom.AZAffinity` / `config.ReadFrom.AZAffinityReplicasAndPrimary` [Read about AZ affinity](https://valkey.io/blog/az-affinity-strategy/) |
| `LazyConnect: bool`      | `LazyConnect: bool` |

**Advanced configuration**

Both **Standalone** and **Cluster** modes support advanced configuration options:

```go
// Standalone mode
client, err := glide.NewClient(&config.ClientConfiguration{
    Addresses: []config.NodeAddress{{Host: "localhost", Port: 6379}},
    RequestTimeout: 500 * time.Millisecond,
    UseTLS: true,
    ClientName: "my-client",
})

// Cluster mode
clusterClient, err := glide.NewClusterClient(&config.ClusterClientConfiguration{
    Addresses: []config.NodeAddress{{Host: "localhost", Port: 6379}},
    RequestTimeout: 500 * time.Millisecond,
    UseTLS: true,
    ClientName: "my-cluster-client",
})
```

</details>

## Command Comparison: go-redis → Glide

Below is a [comprehensive list](#command-comparison-chart) of common Redis commands and how they are implemented in both go-redis and Glide.

### Alphabetical Command Reference

|  |  |  | | |
|-------------------|----------------------------------|------------------------|----------------------------|--------------------------|
| [APPEND](#append) | [GETRANGE](#getrange-setrange) | [LPUSH](#lpush-rpush) | [RENAME](#rename-renamenx) | [SREM](#srem-sismember) |
| [AUTH](#auth) | [HDEL](#hdel-hexists) | [LRANGE](#lrange) | [RENAMENX](#rename-renamenx) | [TTL](#expire-ttl) |
| [CLOSE](#close-disconnect) | [HEXISTS](#hdel-hexists) | [MGET](#mset-mget-multiple-setget) | [RPOP](#lpop-rpop) | [ZADD](#zadd-zrange) |
| [Custom Commands](#custom-commands) | [HGET](#hset-hget) | [MSET](#mset-mget-multiple-setget) | [RPUSH](#lpush-rpush) | [ZRANGE](#zadd-zrange) |
| [DECR](#incr-decr) | [HGETALL](#hgetall) | [MULTI/EXEC](#transactions-multi-exec) | [SADD](#sadd-smembers) | [ZRANK](#zrank-zrevrank) |
| [DECRBY](#incrby-decrby) | [HMGET](#hmset-hmget) | [SCAN](#keys-scan) | [SETEX](#setex-set-with-expiry) | [ZREM](#zrem-zscore) |
| [DEL](#del-delete) | [HMSET](#hmset-hmget) | [SET](#set-get) | [SETRANGE](#getrange-setrange) | [ZREVRANK](#zrank-zrevrank) |
| [EVAL / EVALSHA](#eval-evalsha) | [HSET](#hset-hget) | [SETNX](#setnx-set-if-not-exists) | [SISMEMBER](#srem-sismember) | [ZSCORE](#zrem-zscore) |
| [EXISTS](#exists) | [INCR](#incr-decr) | [KEYS](#keys-scan) | [SMEMBERS](#sadd-smembers) | |
| [EXPIRE & TTL](#expire-ttl) | [INCRBY](#incrby-decrby) | | [LPOP](#lpop-rpop) | |
| [GET](#set-get) | | | | |

### String Operations

<a id="set-get"></a>
<details>
<summary><b style="font-size:18px;">SET & GET</b></summary>

The `SET` command stores a key-value pair in Valkey, while `GET` retrieves the value associated with a key.
- Both **go-redis** and **Glide** support these commands with similar syntax.

**go-redis**
```go
err := rdb.Set(ctx, "key", "value", 0).Err()
if err != nil {
    panic(err)
}

val, err := rdb.Get(ctx, "key").Result()
if err != nil {
    panic(err)
}
fmt.Println("key", val) // "key value"

// With expiration
err = rdb.Set(ctx, "key", "value", time.Hour).Err()
```

**Glide**
```go
_, err := client.Set(ctx, "key", "value")
if err != nil {
    panic(err)
}

val, err := client.Get(ctx, "key")
if err != nil {
    panic(err)
}
fmt.Println("key", val.Value()) // "key value"

// With expiration
import "github.com/valkey-io/valkey-glide/go/v2/options"
_, err = client.SetWithOptions(ctx, "key", "value", options.SetOptions{
    Expiry: &options.Expiry{
        Type:  options.Seconds,
        Count: 3600,
    },
})
```
</details>

<a id="setex-set-with-expiry"></a>
<details>
<summary><b style="font-size:18px;">SETEX (Set with Expiry)</b></summary>

The `SETEX` command sets a key with an expiration time in seconds.
- In **go-redis**, this is a dedicated function.
- In **Glide**, expiration is handled using options within the `Set()` command.

**go-redis**
```go
err := rdb.SetEx(ctx, "key", "value", time.Hour).Err()
if err != nil {
    panic(err)
}
```

**Glide**
```go
import "github.com/valkey-io/valkey-glide/go/v2/options"

_, err := client.SetWithOptions(ctx, "key", "value", options.SetOptions{
    Expiry: &options.Expiry{
        Type:  options.Seconds,
        Count: 3600,
    },
})
if err != nil {
    panic(err)
}
```
</details>

<a id="setnx-set-if-not-exists"></a>
<details>
<summary><b style="font-size:18px;">SETNX (Set if Not Exists)</b></summary>

The `SETNX` command sets a key only if it does not already exist.
- In **go-redis**, this is a dedicated function that returns true if the key was set, false if the key already exists.
- In **Glide**, this is handled using options within the `Set()` command.

**go-redis**
```go
result, err := rdb.SetNX(ctx, "key", "value", 0).Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // true if key was set, false if key exists
```

**Glide**
```go
import "github.com/valkey-io/valkey-glide/go/v2/options"

result, err := client.SetWithOptions(ctx, "key", "value", options.SetOptions{
    ConditionalSet: options.OnlyIfDoesNotExist,
})
if err != nil {
    panic(err)
}
// Returns "OK" if key was set, nil if key exists
fmt.Println(result.Value()) // "OK" or empty if nil
```
</details>

<a id="mset-mget-multiple-setget"></a>
<details>
<summary><b style="font-size:18px;">MSET & MGET (Multiple Set/Get)</b></summary>

The `MSET` command sets multiple key-value pairs in a single operation, while `MGET` retrieves values for multiple keys.
- In **go-redis**, `MSet()` accepts a map or key-value pairs as arguments.
- In **Glide**, `MSet()` accepts a map with key-value pairs.
- For `MGet()`, **go-redis** accepts multiple keys as arguments, while **Glide** requires a slice of keys.

**go-redis**
```go
// Multiple set
err := rdb.MSet(ctx, map[string]interface{}{
    "key1": "value1",
    "key2": "value2",
}).Err()
if err != nil {
    panic(err)
}

// Multiple get
values, err := rdb.MGet(ctx, "key1", "key2").Result()
if err != nil {
    panic(err)
}
fmt.Println(values) // [value1 value2]
```

**Glide**
```go
// Multiple set
_, err := client.MSet(ctx, map[string]string{
    "key1": "value1",
    "key2": "value2",
})
if err != nil {
    panic(err)
}

// Multiple get
values, err := client.MGet(ctx, []string{"key1", "key2"})
if err != nil {
    panic(err)
}
// values is []models.Result[string]
for _, val := range values {
    if val.IsNil() {
        fmt.Println("nil")
    } else {
        fmt.Println(val.Value())
    }
}
```
</details>

<a id="incr-decr"></a>
<details>
<summary><b style="font-size:18px;">INCR & DECR</b></summary>

The `INCR` command increments the value of a key by 1, while `DECR` decrements it by 1.
- Both **go-redis** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**go-redis**
```go
result, err := rdb.Incr(ctx, "counter").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 1

result, err = rdb.Decr(ctx, "counter").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 0
```

**Glide**
```go
result, err := client.Incr(ctx, "counter")
if err != nil {
    panic(err)
}
fmt.Println(result) // 1

result, err = client.Decr(ctx, "counter")
if err != nil {
    panic(err)
}
fmt.Println(result) // 0
```
</details>

<a id="incrby-decrby"></a>
<details>
<summary><b style="font-size:18px;">INCRBY & DECRBY</b></summary>

The `INCRBY` command increases the value of a key by a specified amount, while `DECRBY` decreases it by a specified amount.
- Both **go-redis** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**go-redis**
```go
result, err := rdb.IncrBy(ctx, "counter", 5).Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 5

result, err = rdb.DecrBy(ctx, "counter", 2).Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 3
```

**Glide**
```go
result, err := client.IncrBy(ctx, "counter", 5)
if err != nil {
    panic(err)
}
fmt.Println(result) // 5

result, err = client.DecrBy(ctx, "counter", 2)
if err != nil {
    panic(err)
}
fmt.Println(result) // 3
```
</details>

<a id="append"></a>
<details>
<summary><b style="font-size:18px;">APPEND</b></summary>

The `APPEND` command appends a value to the end of an existing string stored at a key.
- Both **go-redis** and **Glide** support this command in the same way.
- Returns the length of the string after the append operation.

**go-redis**
```go
err := rdb.Set(ctx, "greeting", "Hello", 0).Err()
if err != nil {
    panic(err)
}

length, err := rdb.Append(ctx, "greeting", " World").Result()
if err != nil {
    panic(err)
}
fmt.Println(length) // 11

result, err := rdb.Get(ctx, "greeting").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // "Hello World"
```

**Glide**
```go
_, err := client.Set(ctx, "greeting", "Hello")
if err != nil {
    panic(err)
}

length, err := client.Append(ctx, "greeting", " World")
if err != nil {
    panic(err)
}
fmt.Println(length) // 11

result, err := client.Get(ctx, "greeting")
if err != nil {
    panic(err)
}
fmt.Println(result.Value()) // "Hello World"
```
</details>

<a id="getrange-setrange"></a>
<details>
<summary><b style="font-size:18px;">GETRANGE & SETRANGE</b></summary>

The `GETRANGE` command retrieves a substring from a string value stored at a key, while `SETRANGE` overwrites part of a string at a key starting at a specified offset.
- Both **go-redis** and **Glide** support these commands in the same way.

**go-redis**
```go
err := rdb.Set(ctx, "key", "Hello World", 0).Err()
if err != nil {
    panic(err)
}

result, err := rdb.GetRange(ctx, "key", 0, 4).Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // "Hello"

length, err := rdb.SetRange(ctx, "key", 6, "Redis").Result()
if err != nil {
    panic(err)
}
fmt.Println(length) // 11

updated, err := rdb.Get(ctx, "key").Result()
if err != nil {
    panic(err)
}
fmt.Println(updated) // "Hello Redis"
```

**Glide**
```go
_, err := client.Set(ctx, "key", "Hello World")
if err != nil {
    panic(err)
}

result, err := client.GetRange(ctx, "key", 0, 4)
if err != nil {
    panic(err)
}
fmt.Println(result) // "Hello"

length, err := client.SetRange(ctx, "key", 6, "Redis")
if err != nil {
    panic(err)
}
fmt.Println(length) // 11

updated, err := client.Get(ctx, "key")
if err != nil {
    panic(err)
}
fmt.Println(updated.Value()) // "Hello Redis"
```
</details>

### Key Operations

<a id="del-delete"></a>
<details>
<summary><b style="font-size:18px;">DEL (Delete)</b></summary>

The `DEL` command removes one or more keys from Valkey.
- In **go-redis**, `Del()` accepts multiple keys as separate arguments.
- In **Glide**, `Del()` requires a slice of keys.

**go-redis**
```go
result, err := rdb.Del(ctx, "key1", "key2").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (number of keys deleted)
```

**Glide**
```go
result, err := client.Del(ctx, []string{"key1", "key2"})
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (number of keys deleted)
```
</details>

<a id="exists"></a>
<details>
<summary><b style="font-size:18px;">EXISTS</b></summary>

The `EXISTS` command checks if one or more keys exist in Valkey.
- In **go-redis**, `Exists()` accepts multiple keys as separate arguments and returns the number of keys that exist.
- In **Glide**, `Exists()` requires a slice of keys and also returns the number of keys that exist.

**go-redis**
```go
result, err := rdb.Exists(ctx, "existKey", "nonExistKey").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 1 (number of keys that exist)
```

**Glide**
```go
result, err := client.Exists(ctx, []string{"existKey", "nonExistKey"})
if err != nil {
    panic(err)
}
fmt.Println(result) // 1 (number of keys that exist)
```
</details>

<a id="expire-ttl"></a>
<details>
<summary><b style="font-size:18px;">EXPIRE & TTL</b></summary>

The `EXPIRE` command sets a time-to-live (TTL) for a key, after which it will be automatically deleted. The `TTL` command returns the remaining time-to-live for a key.
- Both **go-redis** and **Glide** support these commands with similar syntax.

**go-redis**
```go
result, err := rdb.Expire(ctx, "key", 10*time.Second).Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // true (success)

ttl, err := rdb.TTL(ctx, "key").Result()
if err != nil {
    panic(err)
}
fmt.Println(ttl) // 10s (seconds remaining)
```

**Glide**
```go
result, err := client.Expire(ctx, "key", 10*time.Second)
if err != nil {
    panic(err)
}
fmt.Println(result) // true (success)

ttl, err := client.TTL(ctx, "key")
if err != nil {
    panic(err)
}
fmt.Println(ttl) // 10 (seconds remaining)
```
</details>

<a id="keys-scan"></a>
<details>
<summary><b style="font-size:18px;">KEYS & SCAN</b></summary>

The `KEYS` command returns all keys matching a pattern, while `SCAN` iterates through keys in a more efficient way for production use.
- `KEYS` is not recommended for production use as it blocks the server until completion.
- `SCAN` is the preferred method for iterating through keys in production environments.
- In **Glide**, the cursor returned by `Scan()` needs to be handled using the `models.Cursor` type.

**go-redis**
```go
// KEYS (not recommended for production)
allKeys, err := rdb.Keys(ctx, "*").Result()
if err != nil {
    panic(err)
}

// SCAN (recommended for production)
var cursor uint64
var keys []string
for {
    var err error
    keys, cursor, err = rdb.Scan(ctx, cursor, "*", 10).Result()
    if err != nil {
        panic(err)
    }
    
    if len(keys) > 0 {
        fmt.Println("SCAN iteration:", keys)
    }
    
    if cursor == 0 {
        break
    }
}
```

**Glide**
```go
import "github.com/valkey-io/valkey-glide/go/v2/models"

// KEYS (not recommended for production)
allKeys, err := client.Keys(ctx, "*")
if err != nil {
    panic(err)
}

// SCAN (recommended for production)
cursor := models.NewCursor("0")
for {
    result, err := client.Scan(ctx, cursor)
    if err != nil {
        panic(err)
    }
    
    keys := result.Data
    if len(keys) > 0 {
        fmt.Println("SCAN iteration:", keys)
    }
    
    cursor = result.Cursor
    if cursor.IsFinished() {
        break
    }
}
```
</details>

<a id="rename-renamenx"></a>
<details>
<summary><b style="font-size:18px;">RENAME & RENAMENX</b></summary>

The `RENAME` command renames a key, while `RENAMENX` renames a key only if the new key does not already exist.
- Both **go-redis** and **Glide** support these commands with similar syntax.

**go-redis**
```go
err := rdb.Set(ctx, "oldkey", "value", 0).Err()
if err != nil {
    panic(err)
}

result, err := rdb.Rename(ctx, "oldkey", "newkey").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // "OK"

err = rdb.Set(ctx, "key1", "value1", 0).Err()
if err != nil {
    panic(err)
}

success, err := rdb.RenameNX(ctx, "key1", "key2").Result()
if err != nil {
    panic(err)
}
fmt.Println(success) // true (success)
```

**Glide**
```go
_, err := client.Set(ctx, "oldkey", "value")
if err != nil {
    panic(err)
}

result, err := client.Rename(ctx, "oldkey", "newkey")
if err != nil {
    panic(err)
}
fmt.Println(result) // "OK"

_, err = client.Set(ctx, "key1", "value1")
if err != nil {
    panic(err)
}

success, err := client.RenameNX(ctx, "key1", "key2")
if err != nil {
    panic(err)
}
fmt.Println(success) // true (success)
```
</details>

### Hash Operations

<a id="hset-hget"></a>
<details>
<summary><b style="font-size:18px;">HSET & HGET</b></summary>

The `HSET` command sets field-value pairs in a hash stored at a key, while `HGET` retrieves the value of a specific field.
- In **go-redis**, `HSet()` accepts field-value pairs as separate arguments or a map.
- In **Glide**, `HSet()` accepts a map with field-value pairs.

**go-redis**
```go
// Set multiple fields
result, err := rdb.HSet(ctx, "hash", "key1", "1", "key2", "2").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (fields added)

// Get a single field
value, err := rdb.HGet(ctx, "hash", "key1").Result()
if err != nil {
    panic(err)
}
fmt.Println(value) // "1"
```

**Glide**
```go
// Set multiple fields
result, err := client.HSet(ctx, "hash", map[string]string{
    "key1": "1",
    "key2": "2",
})
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (fields added)

// Get a single field
value, err := client.HGet(ctx, "hash", "key1")
if err != nil {
    panic(err)
}
fmt.Println(value.Value()) // "1"
```
</details>

<a id="hmset-hmget"></a>
<details>
<summary><b style="font-size:18px;">HMSET & HMGET</b></summary>

The `HMSET` command sets multiple field-value pairs in a hash, while `HMGET` retrieves values for multiple fields.
- In **go-redis**, `HMSet()` accepts either field-value pairs as arguments or a map.
- In **Glide**, there is no separate `HMSet()` method; instead, `HSet()` is used for setting multiple fields.
- For `HMGet()`, **go-redis** accepts multiple fields as arguments, while **Glide** requires a slice of fields.

**go-redis**
```go
// Set multiple fields
err := rdb.HMSet(ctx, "hash", map[string]interface{}{
    "key1": "1",
    "key2": "2",
}).Err()
if err != nil {
    panic(err)
}

// Get multiple fields
values, err := rdb.HMGet(ctx, "hash", "key1", "key2").Result()
if err != nil {
    panic(err)
}
fmt.Println(values) // ["1", "2"]
```

**Glide**
```go
// Set multiple fields (same as HSet in Glide)
_, err := client.HSet(ctx, "hash", map[string]string{
    "key1": "1",
    "key2": "2",
})
if err != nil {
    panic(err)
}

// Get multiple fields
values, err := client.HMGet(ctx, "hash", []string{"key1", "key2"})
if err != nil {
    panic(err)
}
// values is []models.Result[string]
for _, val := range values {
    if val.IsNil() {
        fmt.Println("nil")
    } else {
        fmt.Println(val.Value())
    }
}
```
</details>

<a id="hgetall"></a>
<details>
<summary><b style="font-size:18px;">HGETALL</b></summary>

The `HGETALL` command retrieves all field-value pairs from a hash.
- Both **go-redis** and **Glide** support this command in the same way.
- Returns a map with field names as keys and their values.

**go-redis**
```go
err := rdb.HSet(ctx, "user", map[string]interface{}{
    "name": "John",
    "age":  "30",
}).Err()
if err != nil {
    panic(err)
}

user, err := rdb.HGetAll(ctx, "user").Result()
if err != nil {
    panic(err)
}
fmt.Println(user) // map[name:John age:30]
```

**Glide**
```go
_, err := client.HSet(ctx, "user", map[string]string{
    "name": "John",
    "age":  "30",
})
if err != nil {
    panic(err)
}

user, err := client.HGetAll(ctx, "user")
if err != nil {
    panic(err)
}
fmt.Println(user) // map[name:John age:30]
```
</details>

<a id="hdel-hexists"></a>
<details>
<summary><b style="font-size:18px;">HDEL & HEXISTS</b></summary>

The `HDEL` command removes one or more fields from a hash, while `HEXISTS` checks if a field exists in a hash.
- In **go-redis**, `HDel()` accepts multiple fields as separate arguments.
- In **Glide**, `HDel()` requires a slice of fields.

**go-redis**
```go
result, err := rdb.HDel(ctx, "hash", "field1", "field2").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (fields deleted)

exists, err := rdb.HExists(ctx, "hash", "field1").Result()
if err != nil {
    panic(err)
}
fmt.Println(exists) // false
```

**Glide**
```go
result, err := client.HDel(ctx, "hash", []string{"field1", "field2"})
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (fields deleted)

exists, err := client.HExists(ctx, "hash", "field1")
if err != nil {
    panic(err)
}
fmt.Println(exists) // false
```
</details>

### List Operations

<a id="lpush-rpush"></a>
<details>
<summary><b style="font-size:18px;">LPUSH & RPUSH</b></summary>

The `LPUSH` command adds elements to the head of a list, while `RPUSH` adds elements to the tail.
- In **go-redis**, these commands accept multiple elements as separate arguments.
- In **Glide**, these commands require a slice of elements.

**go-redis**
```go
result, err := rdb.LPush(ctx, "list", "element1", "element2").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (list length)

result, err = rdb.RPush(ctx, "list", "element3", "element4").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 4 (list length)
```

**Glide**
```go
result, err := client.LPush(ctx, "list", []string{"element1", "element2"})
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (list length)

result, err = client.RPush(ctx, "list", []string{"element3", "element4"})
if err != nil {
    panic(err)
}
fmt.Println(result) // 4 (list length)
```
</details>

<a id="lpop-rpop"></a>
<details>
<summary><b style="font-size:18px;">LPOP & RPOP</b></summary>

The `LPOP` command removes and returns an element from the head of a list, while `RPOP` removes and returns an element from the tail.
- Both **go-redis** and **Glide** support these commands with similar syntax.

**go-redis**
```go
value, err := rdb.LPop(ctx, "list").Result()
if err != nil {
    panic(err)
}
fmt.Println(value) // "element2"

value, err = rdb.RPop(ctx, "list").Result()
if err != nil {
    panic(err)
}
fmt.Println(value) // "element4"
```

**Glide**
```go
value, err := client.LPop(ctx, "list")
if err != nil {
    panic(err)
}
fmt.Println(value.Value()) // "element2"

value, err = client.RPop(ctx, "list")
if err != nil {
    panic(err)
}
fmt.Println(value.Value()) // "element4"
```
</details>

<a id="lrange"></a>
<details>
<summary><b style="font-size:18px;">LRANGE</b></summary>

The `LRANGE` command returns a range of elements from a list.
- Both **go-redis** and **Glide** support this command with similar syntax.

**go-redis**
```go
values, err := rdb.LRange(ctx, "list", 0, -1).Result()
if err != nil {
    panic(err)
}
fmt.Println(values) // ["element1", "element3"]
```

**Glide**
```go
values, err := client.LRange(ctx, "list", 0, -1)
if err != nil {
    panic(err)
}
fmt.Println(values) // ["element1", "element3"]
```
</details>

### Set Operations

<a id="sadd-smembers"></a>
<details>
<summary><b style="font-size:18px;">SADD & SMEMBERS</b></summary>

The `SADD` command adds members to a set, while `SMEMBERS` returns all members of a set.
- In **go-redis**, `SAdd()` accepts multiple members as separate arguments.
- In **Glide**, `SAdd()` requires a slice of members.

**go-redis**
```go
result, err := rdb.SAdd(ctx, "set", "member1", "member2").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (members added)

members, err := rdb.SMembers(ctx, "set").Result()
if err != nil {
    panic(err)
}
fmt.Println(members) // ["member1", "member2"]
```

**Glide**
```go
result, err := client.SAdd(ctx, "set", []string{"member1", "member2"})
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (members added)

members, err := client.SMembers(ctx, "set")
if err != nil {
    panic(err)
}
// Convert map[string]struct{} to slice for printing
var memberSlice []string
for member := range members {
    memberSlice = append(memberSlice, member)
}
fmt.Println(memberSlice) // ["member1", "member2"]
```
</details>

<a id="srem-sismember"></a>
<details>
<summary><b style="font-size:18px;">SREM & SISMEMBER</b></summary>

The `SREM` command removes members from a set, while `SISMEMBER` checks if a member exists in a set.
- In **go-redis**, `SRem()` accepts multiple members as separate arguments.
- In **Glide**, `SRem()` requires a slice of members.

**go-redis**
```go
result, err := rdb.SRem(ctx, "set", "member1").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 1 (members removed)

exists, err := rdb.SIsMember(ctx, "set", "member1").Result()
if err != nil {
    panic(err)
}
fmt.Println(exists) // false
```

**Glide**
```go
result, err := client.SRem(ctx, "set", []string{"member1"})
if err != nil {
    panic(err)
}
fmt.Println(result) // 1 (members removed)

exists, err := client.SIsMember(ctx, "set", "member1")
if err != nil {
    panic(err)
}
fmt.Println(exists) // false
```
</details>

### Sorted Set Operations

<a id="zadd-zrange"></a>
<details>
<summary><b style="font-size:18px;">ZADD & ZRANGE</b></summary>

The `ZADD` command adds members with scores to a sorted set, while `ZRANGE` returns a range of members.
- In **go-redis**, `ZAdd()` accepts score-member pairs.
- In **Glide**, `ZAdd()` accepts a map with member-score pairs.

**go-redis**
```go
import "github.com/redis/go-redis/v9"

result, err := rdb.ZAdd(ctx, "zset", redis.Z{Score: 1, Member: "member1"}, redis.Z{Score: 2, Member: "member2"}).Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (members added)

members, err := rdb.ZRange(ctx, "zset", 0, -1).Result()
if err != nil {
    panic(err)
}
fmt.Println(members) // ["member1", "member2"]
```

**Glide**
```go
result, err := client.ZAdd(ctx, "zset", map[string]float64{
    "member1": 1.0,
    "member2": 2.0,
})
if err != nil {
    panic(err)
}
fmt.Println(result) // 2 (members added)

import "github.com/valkey-io/valkey-glide/go/v2/options"

members, err := client.ZRange(ctx, "zset", options.RangeByIndex{Start: 0, End: -1})
if err != nil {
    panic(err)
}
fmt.Println(members) // ["member1", "member2"]
```
</details>

<a id="zrank-zrevrank"></a>
<details>
<summary><b style="font-size:18px;">ZRANK & ZREVRANK</b></summary>

The `ZRANK` command returns the rank of a member in a sorted set (lowest to highest), while `ZREVRANK` returns the rank from highest to lowest.
- Both **go-redis** and **Glide** support these commands with similar syntax.

**go-redis**
```go
rank, err := rdb.ZRank(ctx, "zset", "member1").Result()
if err != nil {
    panic(err)
}
fmt.Println(rank) // 0

revRank, err := rdb.ZRevRank(ctx, "zset", "member1").Result()
if err != nil {
    panic(err)
}
fmt.Println(revRank) // 1
```

**Glide**
```go
rank, err := client.ZRank(ctx, "zset", "member1")
if err != nil {
    panic(err)
}
fmt.Println(rank.Value()) // 0

revRank, err := client.ZRevRank(ctx, "zset", "member1")
if err != nil {
    panic(err)
}
fmt.Println(revRank.Value()) // 1
```
</details>

<a id="zrem-zscore"></a>
<details>
<summary><b style="font-size:18px;">ZREM & ZSCORE</b></summary>

The `ZREM` command removes members from a sorted set, while `ZSCORE` returns the score of a member.
- In **go-redis**, `ZRem()` accepts multiple members as separate arguments.
- In **Glide**, `ZRem()` requires a slice of members.

**go-redis**
```go
result, err := rdb.ZRem(ctx, "zset", "member1").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // 1 (members removed)

score, err := rdb.ZScore(ctx, "zset", "member2").Result()
if err != nil {
    panic(err)
}
fmt.Println(score) // 2.0
```

**Glide**
```go
result, err := client.ZRem(ctx, "zset", []string{"member1"})
if err != nil {
    panic(err)
}
fmt.Println(result) // 1 (members removed)

score, err := client.ZScore(ctx, "zset", "member2")
if err != nil {
    panic(err)
}
fmt.Println(score.Value()) // 2.0
```
</details>

### Advanced Operations

<a id="transactions-multi-exec"></a>
<details>
<summary><b style="font-size:18px;">Transactions (MULTI/EXEC)</b></summary>

Transactions allow you to execute multiple commands atomically.
- In **go-redis**, transactions are handled using `TxPipeline()`.
- In **Glide**, transactions are handled using batch operations with `Exec()`.

**go-redis**
```go
pipe := rdb.TxPipeline()
pipe.Set(ctx, "key1", "value1", 0)
pipe.Set(ctx, "key2", "value2", 0)
pipe.Incr(ctx, "counter")

results, err := pipe.Exec(ctx)
if err != nil {
    panic(err)
}
fmt.Println(len(results)) // 3 (commands executed)
```

**Glide**
```go
import "github.com/valkey-io/valkey-glide/go/v2/pipeline"

batch := pipeline.NewStandaloneBatch()
batch.Set("key1", "value1")
batch.Set("key2", "value2")
batch.Incr("counter")

results, err := client.Exec(ctx, batch, false)
if err != nil {
    panic(err)
}
fmt.Println(len(results)) // 3 (commands executed)
```
</details>

<a id="eval-evalsha"></a>
<details>
<summary><b style="font-size:18px;">EVAL / EVALSHA</b></summary>

The `EVAL` command executes Lua scripts, while `EVALSHA` executes scripts by their SHA1 hash.
- Both **go-redis** and **Glide** support Lua script execution.
- In **Glide**, scripts are managed using the `Script` type and `InvokeScript()` method.

**go-redis**
```go
script := `
    local key = KEYS[1]
    local value = ARGV[1]
    redis.call('SET', key, value)
    return redis.call('GET', key)
`

result, err := rdb.Eval(ctx, script, []string{"mykey"}, "myvalue").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // "myvalue"
```

**Glide**
```go
import "github.com/valkey-io/valkey-glide/go/v2/options"

scriptCode := `
    local key = KEYS[1]
    local value = ARGV[1]
    redis.call('SET', key, value)
    return redis.call('GET', key)
`

script := options.NewScript(scriptCode)
result, err := client.InvokeScriptWithOptions(ctx, script, options.ScriptOptions{
    Keys: []string{"mykey"},
    Args: []string{"myvalue"},
})
if err != nil {
    panic(err)
}
fmt.Println(result) // "myvalue"
```
</details>

<a id="custom-commands"></a>
<details>
<summary><b style="font-size:18px;">Custom Commands</b></summary>

Both libraries support executing custom or arbitrary Redis commands.
- In **go-redis**, use `Do()` method.
- In **Glide**, use `CustomCommand()` method.

**go-redis**
```go
result, err := rdb.Do(ctx, "PING").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // "PONG"

// Custom command with arguments
result, err = rdb.Do(ctx, "SET", "customkey", "customvalue").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // "OK"
```

**Glide**
```go
result, err := client.CustomCommand(ctx, []string{"PING"})
if err != nil {
    panic(err)
}
fmt.Println(result) // "PONG"

// Custom command with arguments
result, err = client.CustomCommand(ctx, []string{"SET", "customkey", "customvalue"})
if err != nil {
    panic(err)
}
fmt.Println(result) // "OK"
```
</details>

<a id="auth"></a>
<details>
<summary><b style="font-size:18px;">AUTH</b></summary>

Authentication is typically handled during connection setup, but can also be done explicitly.
- In **go-redis**, authentication is usually set in the client options or can be done with `Auth()`.
- In **Glide**, authentication is set in the client configuration during connection setup.

**go-redis**
```go
// During connection setup
rdb := redis.NewClient(&redis.Options{
    Addr:     "localhost:6379",
    Username: "user",
    Password: "password",
})

// Or explicitly after connection
result, err := rdb.Auth(ctx, "password").Result()
if err != nil {
    panic(err)
}
fmt.Println(result) // "OK"
```

**Glide**
```go
// During connection setup (recommended)
client, err := glide.NewClient(&config.ClientConfiguration{
    Addresses: []config.NodeAddress{
        {Host: "localhost", Port: 6379},
    },
    Credentials: &config.ServerCredentials{
        Username: "user",
        Password: "password",
    },
})

// Authentication is handled automatically during connection
```
</details>

## Error Handling

Error handling differs between the two libraries:

**go-redis**
```go
val, err := rdb.Get(ctx, "nonexistent").Result()
if err == redis.Nil {
    fmt.Println("Key does not exist")
} else if err != nil {
    panic(err)
} else {
    fmt.Println("Value:", val)
}
```

**Glide**
```go
val, err := client.Get(ctx, "nonexistent")
if err != nil {
    panic(err)
}

if val.IsNil() {
    fmt.Println("Key does not exist")
} else {
    fmt.Println("Value:", val.Value())
}
```

## Connection Management

<a id="close-disconnect"></a>
<details>
<summary><b style="font-size:18px;">Close / Disconnect</b></summary>

Properly closing connections is important to free up resources and avoid connection leaks.
- In **go-redis**, you call `Close()` on the client and handle any potential errors.
- In **Glide**, you call `Close()` on the client (no error return).

**go-redis**
```go
// Close connection
err := rdb.Close()
if err != nil {
    panic(err)
}

// For cluster connections
err = cluster.Close()
if err != nil {
    panic(err)
}
```

**Glide**
```go
// Close connection (works for both standalone and cluster)
client.Close()
```
</details>

## Summary

This migration guide covers the most commonly used Redis commands and their equivalents in Valkey Glide. Key differences to remember:

1. **Connection Setup**: Glide uses structured configuration objects instead of option structs
2. **Method Arguments**: Glide often requires slices where go-redis accepts variadic arguments
3. **Return Values**: Glide uses `models.Result[T]` types for nullable values
4. **Error Handling**: Different approaches for handling nil values and errors
5. **Transactions**: Glide uses batch operations instead of pipelines
6. **Scripts**: Glide provides a more structured approach to Lua script management

For more advanced features and detailed API documentation, refer to the [Valkey Glide Go Documentation](https://github.com/valkey-io/valkey-glide/wiki/Go-wrapper).
