# Migration Guide: ioredis to Valkey Glide

This guide provides a **comprehensive comparison** of how to migrate from **ioredis to Valkey Glide**, with side-by-side code examples to make the transition as smooth as possible.

## Installation

```bash
npm i @valkey/valkey-glide
```

## Connection Setup

### Constructor Differences

- **ioredis** offers multiple constructors for different connection configurations
- **Glide** uses a **single configuration object** that comes pre-configured with best practices

Glide typically requires minimal configuration changes for:
- Timeout settings
- TLS configuration
- Read from replica settings
- User authentication (username & password)

For advanced configurations, refer to the **[Glide Wiki - NodeJS](https://github.com/valkey-io/valkey-glide/wiki/NodeJS-Wrapper)**.

<details>
<summary><b style="font-size:22px;">Standalone Mode</b></summary>

**ioredis**
```js
const Redis = require("ioredis");

// Simple connection
const redis = new Redis();

// With options
const redisWithOptions = new Redis({
  port: 6379,
  host: "localhost",
  username: "user",
  password: "password",
  db: 0
});
```

**Glide**
```js
import { GlideClient } from '@valkey/valkey-glide';

// Simple connection
const addresses = [
  { host: "localhost", port: 6379 }
]; 
const client = await GlideClient.createClient({
  addresses: addresses
});

// With options
const clientWithOptions = await GlideClient.createClient({
  addresses: [{ host: "localhost", port: 6379 }],
  credentials: {
    username: "user",
    password: "password"
  },
  database: 0
});
```

</details>

<details>
<summary><b style="font-size:22px;">Cluster Mode</b></summary>

**ioredis**  
```js
const Redis = require("ioredis");

const cluster = new Redis.Cluster([
  { host: "127.0.0.1", port: 6379 },
  { host: "127.0.0.1", port: 6380 }
]);

// With options
const clusterWithOptions = new Redis.Cluster([
  { host: "127.0.0.1", port: 6379 },
  { host: "127.0.0.1", port: 6380 }
], {
  redisOptions: {
    password: "password"
  }
});
```

**Glide**  
```js
import { GlideClusterClient } from '@valkey/valkey-glide';

const addresses = [
  { host: "127.0.0.1", port: 6379 },
  { host: "127.0.0.1", port: 6380 }
];

const client = await GlideClusterClient.createClient({
  addresses: addresses
});

// With options
const clientWithOptions = await GlideClusterClient.createClient({
  addresses: addresses,
  credentials: {
    password: "password"
  }
});
```

</details>

<details>
<summary><b style="font-size:22px;">Constructor Parameters Comparison</b></summary>

The table below compares **ioredis constructors** with **Glide configuration parameters**:

| **ioredis Parameter** | **Equivalent Glide Configuration** |
|--------------------------|--------------------------------------|
| `port: number`           | `addresses: [{ host: string, port: number }]` |
| `host: string`           | `addresses: [{ host: string, port: number }]` |
| `path: string`           | Not supported |
| `username: string`       | `credentials: { username: string }` |
| `password: string`       | `credentials: { password: string }` |
| `db: number`             | `database: number` |
| `tls: {}`                | `useTLS: true` |
| `connectTimeout: number` | `advancedConfiguration: { connectionTimeout: number }` |
| `maxRetriesPerRequest: number` | `advancedConfiguration: { maxRetries: number }` |
| `retryStrategy: function` | Not directly supported, handled internally |
| `reconnectOnError: function` | Not directly supported, handled internally |
| `readOnly: boolean`      | `readFrom: "REPLICA"` |
| `enableOfflineQueue: boolean` | Not needed, handled internally |
| `enableReadyCheck: boolean` | Not needed, handled internally |
| `autoResubscribe: boolean` | Not needed, handled internally |
| `autoResendUnfulfilledCommands: boolean` | Not needed, handled internally |
| `lazyConnect: boolean`   | Not needed, handled internally |
| `keyPrefix: string`      | Not supported |
| `showFriendlyErrorStack: boolean` | Not needed, handled internally |

**Advanced configuration**

**Standalone Mode** uses `AdvancedGlideClientConfiguration` and **Cluster Mode** uses `AdvancedGlideClusterClientConfiguration`, but the usage is similar:

```js
// Standalone mode
const client = await GlideClient.createClient({
  addresses: [{ host: "localhost", port: 6379 }],
  advancedConfiguration: {
    connectionTimeout: 500,
    maxRetries: 3
  }
});

// Cluster mode
const clusterClient = await GlideClusterClient.createClient({
  addresses: [{ host: "localhost", port: 6379 }],
  advancedConfiguration: {
    connectionTimeout: 500,
    maxRetries: 3
  }
});
```

</details>

## Command Comparison: ioredis → Glide

Below is a [comprehensive list](#command-comparison-chart) of common Redis commands and how they are implemented in both ioredis and Glide.

### Alphabetical Command Reference

|  |  |  | | |
|-------------------|----------------------------------|------------------------|----------------------------|--------------------------|
| [APPEND](#append) | [GETRANGE](#getrange-setrange) | [LPUSH](#lpush-rpush) | [RENAME](#rename-renamenx) | [SREM](#srem-sismember) |
| [AUTH](#auth) | [HDEL](#hdel-hexists) | [LRANGE](#lrange) | [RENAMENX](#rename-renamenx) | [TTL](#expire-ttl) |
| [Custom Commands](#custom-commands) | [HEXISTS](#hdel-hexists) | [MGET](#mset-mget-multiple-setget) | [RPOP](#lpop-rpop) | [ZADD](#zadd-zrange) |
| [DECR](#incr-decr) | [HGET](#hset-hget) | [MSET](#mset-mget-multiple-setget) | [RPUSH](#lpush-rpush) | [ZRANGE](#zadd-zrange) |
| [DECRBY](#incrby-decrby) | [HGETALL](#hgetall) | [MULTI/EXEC](#transactions-multi-exec) | [SADD](#sadd-smembers) | [ZRANK](#zrank-zrevrank) |
| [DEL](#del-delete) | [HMGET](#hmset-hmget) | [SCAN](#keys-scan) | [SETEX](#setex-set-with-expiry) | [ZREM](#zrem-zscore) |
| [EVAL / EVALSHA](#eval-evalsha) | [HMSET](#hmset-hmget) | [SET](#set-get) | [SETRANGE](#getrange-setrange) | [ZREVRANK](#zrank-zrevrank) |
| [EXISTS](#exists) | [HSET](#hset-hget) | [SETNX](#setnx-set-if-not-exists) | [SISMEMBER](#srem-sismember) | [ZSCORE](#zrem-zscore) |
| [EXPIRE & TTL](#expire-ttl) | [INCR](#incr-decr) | [KEYS](#keys-scan) | [SMEMBERS](#sadd-smembers) | |
| [GET](#set-get) | [INCRBY](#incrby-decrby) | | [LPOP](#lpop-rpop) | |

### String Operations

<a id="set-get"></a>
<details>
<summary><b style="font-size:18px;">SET & GET</b></summary>

The `SET` command stores a key-value pair in Valkey, while `GET` retrieves the value associated with a key.
- Both **ioredis** and **Glide** support these commands in the same way.

**ioredis**
```js
await redis.set('key', 'value');
const val = await redis.get('key'); // "value"

// With options
await redis.set('key', 'value', 'EX', 60); // Set with 60 second expiry
```

**Glide**
```js
await client.set('key', 'value');
const val = await client.get('key'); // "value"

// With options
import { TimeUnit } from "@valkey/valkey-glide";
await client.set('key', 'value', {
  expiry: {
    type: TimeUnit.Seconds,
    count: 60
  }
});
```
</details>

<a id="setex-set-with-expiry"></a>
<details>
<summary><b style="font-size:18px;">SETEX (Set with Expiry)</b></summary>

The `SETEX` command sets a key with an expiration time in seconds.
- In **ioredis**, this is a dedicated function.
- In **Glide**, expiration is handled using options within the `set()` command.

**ioredis**
```js
await redis.setex('key', 5, 'value'); // Set with 5 second expiry
```

**Glide**
```js
import { TimeUnit } from "@valkey/valkey-glide";

await client.set('key', 'value', {
  expiry: {
    type: TimeUnit.Seconds,
    count: 5
  }
});
```
</details>

<a id="setnx-set-if-not-exists"></a>
<details>
<summary><b style="font-size:18px;">SETNX (Set if Not Exists)</b></summary>

The `SETNX` command sets a key only if it does not already exist.
- In **ioredis**, this is a dedicated function that returns 1 if the key was set, 0 if the key already exists.
- In **Glide**, this is handled using options within the `set()` command.

**ioredis**
```js
const result = await redis.setnx('key', 'value'); // Returns 1 if key was set, 0 if key exists
```

**Glide**
```js
const result = await client.set('key', 'value', {
  setMode: "NX" // Only set if key doesn't exist
}); // Returns "OK" if key was set, null if key exists
```
</details>

<a id="mset-mget-multiple-setget"></a>
<details>
<summary><b style="font-size:18px;">MSET & MGET (Multiple Set/Get)</b></summary>

The `MSET` command sets multiple key-value pairs in a single operation, while `MGET` retrieves values for multiple keys.
- In **ioredis**, `mset()` accepts either key-value pairs as arguments or an object.
- In **Glide**, `mset()` accepts only an object with key-value pairs.
- For `mget()`, **ioredis** accepts multiple keys as arguments, while **Glide** requires an array of keys.

**ioredis**
```js
// Multiple set
await redis.mset('key1', 'value1', 'key2', 'value2');
// or as an object
await redis.mset({
  key1: 'value1',
  key2: 'value2'
});

// Multiple get
const values = await redis.mget('key1', 'key2'); // ['value1', 'value2']
```

**Glide**
```js
// Multiple set
await client.mset({
  key1: 'value1',
  key2: 'value2'
});

// Multiple get
const values = await client.mget(['key1', 'key2']); // ['value1', 'value2']
```
</details>

<a id="incr-decr"></a>
<details>
<summary><b style="font-size:18px;">INCR & DECR</b></summary>

The `INCR` command increments the value of a key by 1, while `DECR` decrements it by 1.
- Both **ioredis** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**ioredis**
```js
await redis.incr('counter'); // counter = 1
await redis.decr('counter'); // counter = 0
```

**Glide**
```js
await client.incr('counter'); // counter = 1
await client.decr('counter'); // counter = 0
```
</details>

<a id="incrby-decrby"></a>
<details>
<summary><b style="font-size:18px;">INCRBY & DECRBY</b></summary>

The `INCRBY` command increases the value of a key by a specified amount, while `DECRBY` decreases it by a specified amount.
- Both **ioredis** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**ioredis**
```js
await redis.incrby('counter', 5); // 5
await redis.decrby('counter', 2); // 3
```

**Glide**
```js
await client.incrBy('counter', 5); // 5
await client.decrBy('counter', 2); // 3
```
</details>

<a id="append"></a>
<details>
<summary><b style="font-size:18px;">APPEND</b></summary>

The `APPEND` command appends a value to the end of an existing string stored at a key.
- Both **ioredis** and **Glide** support this command in the same way.
- Returns the length of the string after the append operation.

**ioredis**
```js
await redis.set('greeting', 'Hello');
await redis.append('greeting', ' World'); // Returns length: 11
const result = await redis.get('greeting'); // "Hello World"
```

**Glide**
```js
await client.set('greeting', 'Hello');
await client.append('greeting', ' World'); // Returns length: 11
const result = await client.get('greeting'); // "Hello World"
```
</details>

<a id="getrange-setrange"></a>
<details>
<summary><b style="font-size:18px;">GETRANGE & SETRANGE</b></summary>

The `GETRANGE` command retrieves a substring from a string value stored at a key, while `SETRANGE` overwrites part of a string at a key starting at a specified offset.
- Both **ioredis** and **Glide** support these commands in the same way.
- Note the camelCase method names in Glide: `getRange` and `setRange`.

**ioredis**
```js
await redis.set('key', 'Hello World');
const result = await redis.getrange('key', 0, 4); // "Hello"

await redis.setrange('key', 6, 'Redis'); // Returns length: 11
const updated = await redis.get('key'); // "Hello Redis"
```

**Glide**
```js
await client.set('key', 'Hello World');
const result = await client.getRange('key', 0, 4); // "Hello"

await client.setRange('key', 6, 'Redis'); // Returns length: 11
const updated = await client.get('key'); // "Hello Redis"
```
</details>

### Key Operations

<a id="del-delete"></a>
<details>
<summary><b style="font-size:18px;">DEL (Delete)</b></summary>

The `DEL` command removes one or more keys from Valkey.
- In **ioredis**, `del()` accepts multiple keys as separate arguments.
- In **Glide**, `del()` requires an array of keys.

**ioredis**
```js
await redis.del('key1', 'key2'); // 2 (number of keys deleted)
```

**Glide**
```js
await client.del(['key1', 'key2']); // 2 (number of keys deleted)
```
</details>

<a id="exists"></a>
<details>
<summary><b style="font-size:18px;">EXISTS</b></summary>

The `EXISTS` command checks if one or more keys exist in Valkey.
- In **ioredis**, `exists()` accepts multiple keys as separate arguments and returns the number of keys that exist.
- In **Glide**, `exists()` requires an array of keys and also returns the number of keys that exist.

**ioredis**
```js
await redis.exists('existKey', 'nonExistKey'); // 1 (number of keys that exist)
```

**Glide**
```js
await client.exists(['existKey', 'nonExistKey']); // 1 (number of keys that exist)
```
</details>

<a id="expire-ttl"></a>
<details>
<summary><b style="font-size:18px;">EXPIRE & TTL</b></summary>

The `EXPIRE` command sets a time-to-live (TTL) for a key, after which it will be automatically deleted. The `TTL` command returns the remaining time-to-live for a key.
- In **ioredis**, `expire()` returns 1 if successful, 0 if the key doesn't exist or couldn't be expired.
- In **Glide**, `expire()` returns true if successful, false otherwise.

**ioredis**
```js
await redis.expire('key', 10); // 1 (success)
const ttl = await redis.ttl('key'); // 10 (seconds remaining)
```

**Glide**
```js
await client.expire('key', 10); // true (success)
const ttl = await client.ttl('key'); // 10 (seconds remaining)
```
</details>

<a id="keys-scan"></a>
<details>
<summary><b style="font-size:18px;">KEYS & SCAN</b></summary>

The `KEYS` command returns all keys matching a pattern, while `SCAN` iterates through keys in a more efficient way for production use.
- `KEYS` is not recommended for production use as it blocks the server until completion.
- `SCAN` is the preferred method for iterating through keys in production environments.
- In **Glide**, the cursor returned by `scan()` needs to be converted to a string using `toString()`.

**ioredis**
```js
// KEYS (not recommended for production)
const allKeys = await redis.keys('*');

// SCAN (recommended for production)
let cursor = '0';
let result;
do {
    result = await redis.scan(cursor);
    cursor = result[0];

    const keys = result[1];
    if (keys.length > 0) {
        console.log('SCAN iteration: ' + keys.join(', '));
    }
} while (cursor !== '0');
```

**Glide**
```js
// KEYS (not recommended for production)
const allKeys = await client.keys('*');

// SCAN (recommended for production)
let cursor = '0';
let result;
do {
    result = await client.scan(cursor);
    cursor = result[0].toString();

    const keys = result[1];
    if (keys.length > 0) {
        console.log('SCAN iteration: ' + keys.join(', '));
    }
} while (cursor !== '0');
```
</details>

<a id="rename-renamenx"></a>
<details>
<summary><b style="font-size:18px;">RENAME & RENAMENX</b></summary>

The `RENAME` command renames a key, while `RENAMENX` renames a key only if the new key does not already exist.
- In **ioredis**, `renamenx()` returns 1 if successful, 0 if the target key already exists.
- In **Glide**, `renameNx()` returns true if successful, false if the target key already exists.
- Note the camelCase method name in Glide: `renameNx`.

**ioredis**
```js
await redis.set('oldkey', 'value');
await redis.rename('oldkey', 'newkey'); // "OK"

await redis.set('key1', 'value1');
const result = await redis.renamenx('key1', 'key2'); // 1 (success)
```

**Glide**
```js
await client.set('oldkey', 'value');
await client.rename('oldkey', 'newkey'); // "OK"

await client.set('key1', 'value1');
const result = await client.renameNx('key1', 'key2'); // true (success)
```
</details>

### Hash Operations

<a id="hset-hget"></a>
<details>
<summary><b style="font-size:18px;">HSET & HGET</b></summary>

The `HSET` command sets field-value pairs in a hash stored at a key, while `HGET` retrieves the value of a specific field.
- In **ioredis**, `hset()` accepts field-value pairs as separate arguments.
- In **Glide**, `hset()` accepts an object with field-value pairs.

**ioredis**
```js
// Set multiple fields
await redis.hset('hash', 'key1', '1', 'key2', '2'); // 2 (fields added)

// Get a single field
const value = await redis.hget('hash', 'key1'); // "1"
```

**Glide**
```js
// Set multiple fields
await client.hset('hash', { key1: '1', key2: '2' }); // 2 (fields added)

// Get a single field
const value = await client.hget('hash', 'key1'); // "1"
```
</details>

<a id="hmset-hmget"></a>
<details>
<summary><b style="font-size:18px;">HMSET & HMGET</b></summary>

The `HMSET` command sets multiple field-value pairs in a hash, while `HMGET` retrieves values for multiple fields.
- In **ioredis**, `hmset()` accepts either field-value pairs as arguments or an object.
- In **Glide**, there is no separate `hmset()` method; instead, `hset()` is used for setting multiple fields.
- For `hmget()`, **ioredis** accepts multiple fields as arguments, while **Glide** requires an array of fields.

**ioredis**
```js
// Set multiple fields
await redis.hmset('hash', 'key1', '1', 'key2', '2');
// or as an object
await redis.hmset('hash', { key1: '1', key2: '2' });

// Get multiple fields
const values = await redis.hmget('hash', 'key1', 'key2'); // ["1", "2"]
```

**Glide**
```js
// Set multiple fields (same as hset in Glide)
await client.hset('hash', { key1: '1', key2: '2' });

// Get multiple fields
const values = await client.hmget('hash', ['key1', 'key2']); // ["1", "2"]
```
</details>

<a id="hgetall"></a>
<details>
<summary><b style="font-size:18px;">HGETALL</b></summary>

The `HGETALL` command retrieves all field-value pairs from a hash.
- Both **ioredis** and **Glide** support this command in the same way.
- Returns an object with field names as keys and their values.

**ioredis**
```js
await redis.hset('user', { name: 'John', age: '30' });
const user = await redis.hgetall('user'); // { name: 'John', age: '30' }
```

**Glide**
```js
await client.hset('user', { name: 'John', age: '30' });
const user = await client.hgetall('user'); // { name: 'John', age: '30' }
```
</details>

<a id="hdel-hexists"></a>
<details>
<summary><b style="font-size:18px;">HDEL & HEXISTS</b></summary>

The `HDEL` command removes one or more fields from a hash, while `HEXISTS` checks if a field exists in a hash.
- In **ioredis**, `hdel()` accepts multiple fields as separate arguments and returns the number of fields removed.
- In **Glide**, `hdel()` requires an array of fields.
- For `hexists()`, **ioredis** returns 1 if the field exists, 0 if it doesn't, while **Glide** returns true or false.

**ioredis**
```js
await redis.hset('hash', { key1: '1', key2: '2', key3: '3' });
await redis.hdel('hash', 'key1', 'key2'); // 2 (fields deleted)

const exists = await redis.hexists('hash', 'key3'); // 1 (exists)
const notExists = await redis.hexists('hash', 'key1'); // 0 (doesn't exist)
```

**Glide**
```js
await client.hset('hash', { key1: '1', key2: '2', key3: '3' });
await client.hdel('hash', ['key1', 'key2']); // 2 (fields deleted)

const exists = await client.hexists('hash', 'key3'); // true
const notExists = await client.hexists('hash', 'key1'); // false
```
</details>

### List Operations

<a id="lpush-rpush"></a>
<details>
<summary><b style="font-size:18px;">LPUSH & RPUSH</b></summary>

The `LPUSH` command adds elements to the beginning of a list, while `RPUSH` adds elements to the end of a list.
- In **ioredis**, these commands accept multiple elements as separate arguments.
- In **Glide**, they require an array of elements.
- Both return the length of the list after the operation.

**ioredis**
```js
let lengthOfList = await redis.lpush('list', 'a', 'b', 'c'); // lengthOfList = 3
lengthOfList = await redis.rpush('list', 'd', 'e'); // lengthOfList = 5
```

**Glide**
```js
let lengthOfList = await client.lpush('list', ['a', 'b', 'c']); // lengthOfList = 3
lengthOfList = await client.rpush('list', ['d', 'e']); // lengthOfList = 5
```
</details>

<a id="lpop-rpop"></a>
<details>
<summary><b style="font-size:18px;">LPOP & RPOP</b></summary>

The `LPOP` command removes and returns the first element of a list, while `RPOP` removes and returns the last element.
- Both **ioredis** and **Glide** support these commands in the same way.
- Returns null if the list doesn't exist or is empty.

**ioredis**
```js
await redis.rpush('list', 'a', 'b', 'c');
const first = await redis.lpop('list'); // "a"
const last = await redis.rpop('list'); // "c"
```

**Glide**
```js
await client.rpush('list', ['a', 'b', 'c']);
const first = await client.lpop('list'); // "a"
const last = await client.rpop('list'); // "c"
```
</details>

<a id="lrange"></a>
<details>
<summary><b style="font-size:18px;">LRANGE</b></summary>

The `LRANGE` command retrieves a range of elements from a list.
- Both **ioredis** and **Glide** support this command in the same way.
- The range is specified by start and stop indices, where 0 is the first element, -1 is the last element.

**ioredis**
```js
await redis.rpush('list', 'a', 'b', 'c', 'd', 'e');
const elements = await redis.lrange('list', 0, 2); // ["a", "b", "c"]
```

**Glide**
```js
await client.rpush('list', ['a', 'b', 'c', 'd', 'e']);
const elements = await client.lrange('list', 0, 2); // ["a", "b", "c"]
```
</details>

### Set Operations

<a id="sadd-smembers"></a>
<details>
<summary><b style="font-size:18px;">SADD & SMEMBERS</b></summary>

The `SADD` command adds one or more members to a set, while `SMEMBERS` returns all members of a set.
- In **ioredis**, `sadd()` accepts multiple members as separate arguments.
- In **Glide**, `sadd()` requires an array of members.
- Both return the number of members that were added to the set (excluding members that were already present).

**ioredis**
```js
await redis.sadd('set', 'a', 'b', 'c'); // 3 (members added)
const members = await redis.smembers('set'); // ["a", "b", "c"]
```

**Glide**
```js
await client.sadd('set', ['a', 'b', 'c']); // 3 (members added)
const members = await client.smembers('set'); // ["a", "b", "c"]
```
</details>

<a id="srem-sismember"></a>
<details>
<summary><b style="font-size:18px;">SREM & SISMEMBER</b></summary>

The `SREM` command removes one or more members from a set, while `SISMEMBER` checks if a value is a member of a set.
- In **ioredis**, `srem()` accepts multiple members as separate arguments and returns the number of members removed.
- In **Glide**, `srem()` requires an array of members.
- For `sismember()`, **ioredis** returns 1 if the member exists, 0 if it doesn't, while **Glide** returns true or false.

**ioredis**
```js
await redis.sadd('set', 'a', 'b', 'c');
await redis.srem('set', 'a', 'b'); // 2 (members removed)

const isMember = await redis.sismember('set', 'c'); // 1 (is member)
const notMember = await redis.sismember('set', 'a'); // 0 (not member)
```

**Glide**
```js
await client.sadd('set', ['a', 'b', 'c']);
await client.srem('set', ['a', 'b']); // 2 (members removed)

const isMember = await client.sismember('set', 'c'); // true
const notMember = await client.sismember('set', 'a'); // false
```
</details>

### Sorted Set Operations

<a id="zadd-zrange"></a>
<details>
<summary><b style="font-size:18px;">ZADD & ZRANGE</b></summary>

The `ZADD` command adds one or more members with scores to a sorted set, while `ZRANGE` retrieves members from a sorted set by index range.
- In **ioredis**, `zadd()` accepts score-member pairs as separate arguments.
- In **Glide**, `zadd()` requires an array of objects with score and member properties.
- For `zrange()` with scores, **ioredis** uses a 'WITHSCORES' string parameter, while **Glide** uses an options object.

**ioredis**
```js
await redis.zadd('sortedSet', 1, 'one', 2, 'two', 3, 'three'); // 3 (members added)
const members = await redis.zrange('sortedSet', 0, -1); // ["one", "two", "three"]

// With scores
const withScores = await redis.zrange('sortedSet', 0, -1, 'WITHSCORES'); 
// ["one", "1", "two", "2", "three", "3"]
```

**Glide**
```js
await client.zadd('sortedSet', [
  { score: 1, member: 'one' },
  { score: 2, member: 'two' },
  { score: 3, member: 'three' }
]); // 3 (members added)

const members = await client.zrange('sortedSet', 0, -1); // ["one", "two", "three"]

// With scores
const withScores = await client.zrange('sortedSet', 0, -1, { withScores: true });
// ["one", "1", "two", "2", "three", "3"]
```
</details>

<a id="zrem-zscore"></a>
<details>
<summary><b style="font-size:18px;">ZREM & ZSCORE</b></summary>

The `ZREM` command removes one or more members from a sorted set, while `ZSCORE` returns the score of a member in a sorted set.
- In **ioredis**, `zrem()` accepts multiple members as separate arguments.
- In **Glide**, `zrem()` requires an array of members.
- Both return the number of members that were removed from the sorted set.

**ioredis**
```js
await redis.zadd('sortedSet', 1, 'one', 2, 'two', 3, 'three');
await redis.zrem('sortedSet', 'one', 'two'); // 2 (members removed)

const score = await redis.zscore('sortedSet', 'three'); // "3"
```

**Glide**
```js
await client.zadd('sortedSet', [
  { score: 1, member: 'one' },
  { score: 2, member: 'two' },
  { score: 3, member: 'three' }
]);
await client.zrem('sortedSet', ['one', 'two']); // 2 (members removed)

const score = await client.zscore('sortedSet', 'three'); // "3"
```
</details>

<a id="zrank-zrevrank"></a>
<details>
<summary><b style="font-size:18px;">ZRANK & ZREVRANK</b></summary>

The `ZRANK` command returns the rank (position) of a member in a sorted set, while `ZREVRANK` returns the rank in reverse order.
- Both **ioredis** and **Glide** support these commands in the same way.
- Ranks are 0-based, meaning the member with the lowest score has rank 0.
- `ZREVRANK` returns the rank in descending order, where the member with the highest score has rank 0.

**ioredis**
```js
await redis.zadd('sortedSet', 1, 'one', 2, 'two', 3, 'three');
const rank = await redis.zrank('sortedSet', 'two'); // 1 (0-based index)
const revRank = await redis.zrevrank('sortedSet', 'two'); // 1 (0-based index from end)
```

**Glide**
```js
await client.zadd('sortedSet', [
  { score: 1, member: 'one' },
  { score: 2, member: 'two' },
  { score: 3, member: 'three' }
]);
const rank = await client.zrank('sortedSet', 'two'); // 1 (0-based index)
const revRank = await client.zrevrank('sortedSet', 'two'); // 1 (0-based index from end)
```
</details>

### Transactions

<a id="transactions-multi-exec"></a>
<details>
<summary><b style="font-size:18px;">Transactions (MULTI / EXEC)</b></summary>

The `MULTI` command starts a transaction block, while `EXEC` executes all commands issued after MULTI.
- In **ioredis**, transactions are created using `redis.multi()` and executed with `exec()`.
- In **Glide**, transactions are created using the `Transaction` class and executed with `client.exec()`.
- The result format differs: **ioredis** returns an array of arrays with errors and results, while **Glide** returns an array of results.

**ioredis**
```js
const transaction = redis.multi()
  .set("key", "value")
  .get("key");
const result = await transaction.exec(); 
console.log(result); // [ [ null, 'OK' ], [ null, 'value' ] ]
```

**Glide**
```js
import { Transaction } from "@valkey/valkey-glide";
const transaction = new Transaction()
  .set("key", "value")
  .get("key");
const result = await client.exec(transaction);
console.log(result); // ['OK', 'value']
```
</details>

### Lua Scripts

<a id="eval-evalsha"></a>
<details>
<summary><b style="font-size:18px;">EVAL / EVALSHA</b></summary>

The `EVAL` command executes a Lua script on the server, while `EVALSHA` executes a script cached on the server using its SHA1 hash.
- In **ioredis**, these commands require specifying the number of keys and passing keys and arguments separately.
- In **Glide**, scripts are created using the `Script` class and executed with `invokeScript()`, with keys and arguments passed in a single options object.
- **Glide** automatically handles script caching, so there's no need for separate `EVALSHA` handling.

**ioredis**
```js
// EVAL
const luaScript = `return { KEYS[1], ARGV[1] }`;
const scriptOptions = {
  keys: ["foo"],
  args: ["bar"],
};

const result = await redis.eval(
  luaScript, 
  1, 
  ...scriptOptions.keys, 
  ...scriptOptions.args
);
console.log(result); // ['foo', 'bar']

// EVALSHA
const sha = await redis.script('load', luaScript);
const shaResult = await redis.evalsha(
  sha,
  1,
  ...scriptOptions.keys,
  ...scriptOptions.args
);
console.log(shaResult); // ['foo', 'bar']
```

**Glide**
```js
import { Script } from "@valkey/valkey-glide";

const luaScript = new Script("return { KEYS[1], ARGV[1] }");
const scriptOptions = {
  keys: ["foo"],
  args: ["bar"],
};

const result = await client.invokeScript(luaScript, scriptOptions);
console.log(result); // ['foo', 'bar']
```
</details>

### Authentication

<a id="auth"></a>
<details>
<summary><b style="font-size:18px;">AUTH</b></summary>

The `AUTH` command authenticates a client connection to the Valkey server.
- In **ioredis**, authentication is done using the `auth()` method.
- In **Glide**, authentication is handled using `updateConnectionPassword()`.

**ioredis**
```js
await redis.auth('mypass'); // OK
```

**Glide**
```js
await client.updateConnectionPassword('mypass'); // OK
```
</details>

### Custom Commands

<a id="custom-commands"></a>
<details>
<summary><b style="font-size:18px;">Custom Commands</b></summary>

The `defineCommand` feature in ioredis allows defining custom commands, while Glide provides a `customCommand` method for executing raw commands.
- In **ioredis**, you can define custom commands using Lua scripts or execute raw commands using `call()`.
- In **Glide**, you can execute raw commands using `customCommand()` or use the `Script` class for Lua scripts.

**ioredis**
```js
// Define a custom command
redis.defineCommand('echo', {
  numberOfKeys: 0,
  lua: 'return ARGV[1]'
});

// Use the custom command
const result = await redis.echo('Hello');
console.log(result); // "Hello"

// Or execute a raw command
const rawResult = await redis.call('SET', 'key', 'value');
console.log(rawResult); // "OK"
```

**Glide**
```js
// Execute a raw command
const result = await client.customCommand(['SET', 'key', 'value']);
console.log(result); // "OK"

// For Lua scripts, use Script class
import { Script } from "@valkey/valkey-glide";
const echoScript = new Script("return ARGV[1]");
const scriptResult = await client.invokeScript(echoScript, {
  args: ["Hello"]
});
console.log(scriptResult); // "Hello"
```
</details>

## Command Comparison Chart

Below is a comprehensive chart comparing common Redis commands between ioredis and Valkey Glide:

| Command | ioredis | Valkey Glide |
|---------|---------|--------------|
| **Connection** |
| Connect | `new Redis()` | `await GlideClient.createClient({})` |
| Cluster | `new Redis.Cluster([])` | `await GlideClusterClient.createClient({})` |
| Auth | `redis.auth('pass')` | `client.updateConnectionPassword('pass')` |
| Select DB | `redis.select(1)` | `client.select(1)` |
| **Strings** |
| SET | `redis.set('key', 'val')` | `client.set('key', 'val')` |
| GET | `redis.get('key')` | `client.get('key')` |
| SETEX | `redis.setex('key', 10, 'val')` | `client.set('key', 'val', {expiry: {type: TimeUnit.Seconds, count: 10}})` |
| SETNX | `redis.setnx('key', 'val')` | `client.set('key', 'val', {setMode: "NX"})` |
| MSET | `redis.mset({key1: 'val1'})` | `client.mset({key1: 'val1'})` |
| MGET | `redis.mget('key1', 'key2')` | `client.mget(['key1', 'key2'])` |
| INCR | `redis.incr('counter')` | `client.incr('counter')` |
| DECR | `redis.decr('counter')` | `client.decr('counter')` |
| INCRBY | `redis.incrby('counter', 5)` | `client.incrBy('counter', 5)` |
| DECRBY | `redis.decrby('counter', 5)` | `client.decrBy('counter', 5)` |
| APPEND | `redis.append('key', 'val')` | `client.append('key', 'val')` |
| GETRANGE | `redis.getrange('key', 0, 3)` | `client.getRange('key', 0, 3)` |
| SETRANGE | `redis.setrange('key', 0, 'val')` | `client.setRange('key', 0, 'val')` |
| **Keys** |
| DEL | `redis.del('key1', 'key2')` | `client.del(['key1', 'key2'])` |
| EXISTS | `redis.exists('key1', 'key2')` | `client.exists(['key1', 'key2'])` |
| EXPIRE | `redis.expire('key', 10)` | `client.expire('key', 10)` |
| TTL | `redis.ttl('key')` | `client.ttl('key')` |
| KEYS | `redis.keys('pattern')` | `client.keys('pattern')` |
| SCAN | `redis.scan('0')` | `client.scan('0')` |
| RENAME | `redis.rename('old', 'new')` | `client.rename('old', 'new')` |
| RENAMENX | `redis.renamenx('old', 'new')` | `client.renameNx('old', 'new')` |
| **Hashes** |
| HSET | `redis.hset('hash', 'k1', 'v1', 'k2', 'v2')` | `client.hset('hash', {k1: 'v1', k2: 'v2'})` |
| HGET | `redis.hget('hash', 'field')` | `client.hget('hash', 'field')` |
| HMSET | `redis.hmset('hash', {k1: 'v1'})` | `client.hset('hash', {k1: 'v1'})` |
| HMGET | `redis.hmget('hash', 'k1', 'k2')` | `client.hmget('hash', ['k1', 'k2'])` |
| HGETALL | `redis.hgetall('hash')` | `client.hgetall('hash')` |
| HDEL | `redis.hdel('hash', 'k1', 'k2')` | `client.hdel('hash', ['k1', 'k2'])` |
| HEXISTS | `redis.hexists('hash', 'field')` | `client.hexists('hash', 'field')` |
| **Lists** |
| LPUSH | `redis.lpush('list', 'a', 'b')` | `client.lpush('list', ['a', 'b'])` |
| RPUSH | `redis.rpush('list', 'a', 'b')` | `client.rpush('list', ['a', 'b'])` |
| LPOP | `redis.lpop('list')` | `client.lpop('list')` |
| RPOP | `redis.rpop('list')` | `client.rpop('list')` |
| LRANGE | `redis.lrange('list', 0, -1)` | `client.lrange('list', 0, -1)` |
| **Sets** |
| SADD | `redis.sadd('set', 'a', 'b')` | `client.sadd('set', ['a', 'b'])` |
| SMEMBERS | `redis.smembers('set')` | `client.smembers('set')` |
| SREM | `redis.srem('set', 'a', 'b')` | `client.srem('set', ['a', 'b'])` |
| SISMEMBER | `redis.sismember('set', 'a')` | `client.sismember('set', 'a')` |
| **Sorted Sets** |
| ZADD | `redis.zadd('zset', 1, 'a', 2, 'b')` | `client.zadd('zset', [{score: 1, member: 'a'}, {score: 2, member: 'b'}])` |
| ZRANGE | `redis.zrange('zset', 0, -1)` | `client.zrange('zset', 0, -1)` |
| ZRANGE with scores | `redis.zrange('zset', 0, -1, 'WITHSCORES')` | `client.zrange('zset', 0, -1, {withScores: true})` |
| ZREM | `redis.zrem('zset', 'a', 'b')` | `client.zrem('zset', ['a', 'b'])` |
| ZSCORE | `redis.zscore('zset', 'a')` | `client.zscore('zset', 'a')` |
| ZRANK | `redis.zrank('zset', 'a')` | `client.zrank('zset', 'a')` |
| ZREVRANK | `redis.zrevrank('zset', 'a')` | `client.zrevrank('zset', 'a')` |
| **Transactions** |
| MULTI/EXEC | `redis.multi().set('k', 'v').get('k').exec()` | `client.exec(new Transaction().set('k', 'v').get('k'))` |
| **Lua Scripts** |
| EVAL | `redis.eval(script, numKeys, ...keysAndArgs)` | `client.invokeScript(new Script(script), {keys: [], args: []})` |
| EVALSHA | `redis.evalsha(sha, numKeys, ...keysAndArgs)` | `client.invokeScript(new Script(script), {keys: [], args: []})` |
| **Custom Commands** |
| Raw Command | `redis.call('SET', 'key', 'value')` | `client.customCommand(['SET', 'key', 'value'])` |
