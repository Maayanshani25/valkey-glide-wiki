# Migration Guide: redis-py to Valkey Glide

This guide provides a **comprehensive comparison** of how to migrate from **redis-py to Valkey Glide**, with side-by-side code examples to make the transition as smooth as possible.

## Installation

```bash
pip install valkey-glide
```

## Connection Setup

### Constructor Differences

- **redis-py** offers multiple constructors for different connection configurations
- **Glide** uses a **configuration object** that comes pre-configured with best practices

Glide typically requires minimal configuration changes for:
- Timeout settings
- TLS configuration
- Read from replica settings
- User authentication (username & password)

For advanced configurations, refer to the **[Glide Wiki - Python](https://github.com/valkey-io/valkey-glide/wiki/Python-wrapper)**.

<details>
<summary><b style="font-size:22px;">Standalone Mode</b></summary>

**redis-py**
```python
import redis

# Simple connection
r = redis.Redis(host='localhost', port=6379, db=0)

# With options
r_with_options = redis.Redis(
    host='localhost',
    port=6379,
    username='user',
    password='password',
    db=0,
    decode_responses=True  # Return strings instead of bytes
)
```

**Glide**
```python
from glide import GlideClient, GlideClientConfiguration, NodeAddress, ServerCredentials

# Simple connection
addresses = [NodeAddress(host="localhost", port=6379)]
client_config = GlideClientConfiguration(addresses)
client = await GlideClient.create(client_config)

# With options
addresses = [NodeAddress(host="localhost", port=6379)]
credentials = ServerCredentials(password="password", username="user")
client_config = GlideClientConfiguration(
    addresses,
    credentials=credentials,
    database=0
)
client_with_options = await GlideClient.create(client_config)
```

</details>

<details>
<summary><b style="font-size:22px;">Cluster Mode</b></summary>

**redis-py**  
```python
from redis.cluster import RedisCluster

# Simple connection
rc = RedisCluster(
    startup_nodes=[
        {"host": "127.0.0.1", "port": 6379},
        {"host": "127.0.0.1", "port": 6380}
    ],
    decode_responses=True
)

# With options
rc_with_options = RedisCluster(
    startup_nodes=[
        {"host": "127.0.0.1", "port": 6379},
        {"host": "127.0.0.1", "port": 6380}
    ],
    password="password",
    decode_responses=True
)
```

**Glide**  
```python
from glide import GlideClusterClient, GlideClusterClientConfiguration, NodeAddress, ServerCredentials

# Simple connection
addresses = [
    NodeAddress(host="127.0.0.1", port=6379),
    NodeAddress(host="127.0.0.1", port=6380)
]
client_config = GlideClusterClientConfiguration(addresses)
client = await GlideClusterClient.create(client_config)

# With options
addresses = [
    NodeAddress(host="127.0.0.1", port=6379),
    NodeAddress(host="127.0.0.1", port=6380)
]
credentials = ServerCredentials(password="password")
client_config = GlideClusterClientConfiguration(
    addresses,
    credentials=credentials
)
client_with_options = await GlideClusterClient.create(client_config)
```

</details>

<details>
<summary><b style="font-size:22px;">Constructor Parameters Comparison</b></summary>

The table below compares **redis-py constructors** with **Glide configuration parameters**:

| **redis-py Parameter** | **Equivalent Glide Configuration** |
|--------------------------|--------------------------------------|
| `host: str`              | `addresses: [NodeAddress(host="host", port=port)]` |
| `port: int`              | `addresses: [NodeAddress(host="host", port=port)]` |
| `db: int`                | `database: int` |
| `username: str`          | `credentials: ServerCredentials(username="username")` |
| `password: str`          | `credentials: ServerCredentials(password="password")` |
| `socket_timeout: float`  | `request_timeout: int` (in milliseconds) |
| `socket_connect_timeout: float` | Not directly supported, handled internally |
| `socket_keepalive: bool` | Not directly supported, handled internally |
| `socket_keepalive_options` | Not directly supported, handled internally |
| `connection_pool: ConnectionPool` | Not needed, handled internally |
| `unix_socket_path: str`  | Not supported |
| `encoding: str`          | Not needed, returns bytes by default |
| `decode_responses: bool` | Not supported, use `.decode()` on returned bytes |
| `retry_on_timeout: bool` | Not needed, handled internally |
| `ssl: bool`              | `use_tls: bool` |
| `ssl_keyfile: str`       | Not directly supported |
| `ssl_certfile: str`      | Not directly supported |
| `ssl_cert_reqs: str`     | Not directly supported |
| `ssl_ca_certs: str`      | Not directly supported |
| `max_connections: int`   | Not needed, handled internally |
| `health_check_interval: float` | Not needed, handled internally |
| `client_name: str`       | Not supported |

**Advanced configuration**

**Standalone Mode** uses `GlideClientConfiguration` and **Cluster Mode** uses `GlideClusterClientConfiguration`, but the usage is similar:

```python
# Standalone mode
client_config = GlideClientConfiguration(
    addresses=[NodeAddress(host="localhost", port=6379)],
    request_timeout=500  # 500ms timeout
)
client = await GlideClient.create(client_config)

# Cluster mode
cluster_config = GlideClusterClientConfiguration(
    addresses=[NodeAddress(host="localhost", port=6379)],
    request_timeout=500  # 500ms timeout
)
cluster_client = await GlideClusterClient.create(cluster_config)
```

</details>

## Command Comparison: redis-py → Glide

Below is a [comprehensive list](#command-comparison-chart) of common Redis commands and how they are implemented in both redis-py and Glide.

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
- Both **redis-py** and **Glide** support these commands in the same way.
- Note that redis-py can return strings if `decode_responses=True` is set, while Glide always returns bytes.

**redis-py**
```python
await r.set('key', 'value')
val = await r.get('key')  # b"value" or "value" if decode_responses=True

# With options
await r.set('key', 'value', ex=60)  # Set with 60 second expiry
```

**Glide**
```python
await client.set('key', 'value')
val = await client.get('key')  # b"value"

# With options
from glide import ExpiryType
await client.set('key', 'value', expiry=ExpirySet(ExpiryType.SEC, 60))
```
</details>

<a id="setex-set-with-expiry"></a>
<details>
<summary><b style="font-size:18px;">SETEX (Set with Expiry)</b></summary>

The `SETEX` command sets a key with an expiration time in seconds.
- In **redis-py**, this is a dedicated function.
- In **Glide**, expiration is handled using the `ExpirySet` class within the `set()` command.

**redis-py**
```python
await r.setex('key', 5, 'value')  # Set with 5 second expiry
```

**Glide**
```python
from glide import ExpiryType, ExpirySet

await client.set('key', 'value', expiry=ExpirySet(ExpiryType.SEC, 5))
```
</details>

<a id="setnx-set-if-not-exists"></a>
<details>
<summary><b style="font-size:18px;">SETNX (Set if Not Exists)</b></summary>

The `SETNX` command sets a key only if it does not already exist.
- In **redis-py**, this is a dedicated function that returns True if the key was set, False if the key already exists.
- In **Glide**, this is handled using the `ConditionalChange` enum within the `set()` command.

**redis-py**
```python
result = await r.setnx('key', 'value')  # Returns True if key was set, False if key exists
```

**Glide**
```python
from glide import ConditionalChange

result = await client.set('key', 'value', conditional_set=ConditionalChange.ONLY_IF_DOES_NOT_EXIST)
# Returns "OK" if key was set, None if key exists
```
</details>

<a id="mset-mget-multiple-setget"></a>
<details>
<summary><b style="font-size:18px;">MSET & MGET (Multiple Set/Get)</b></summary>

The `MSET` command sets multiple key-value pairs in a single operation, while `MGET` retrieves values for multiple keys.
- Both **redis-py** and **Glide** support these commands in a similar way.
- For `mget()`, both libraries accept a list of keys.

**redis-py**
```python
# Multiple set
await r.mset({'key1': 'value1', 'key2': 'value2'})

# Multiple get
values = await r.mget(['key1', 'key2'])  # [b'value1', b'value2'] or ["value1", "value2"] if decode_responses=True
```

**Glide**
```python
# Multiple set
await client.mset({'key1': 'value1', 'key2': 'value2'})

# Multiple get
values = await client.mget(['key1', 'key2'])  # [b'value1', b'value2']
```
</details>

<a id="incr-decr"></a>
<details>
<summary><b style="font-size:18px;">INCR & DECR</b></summary>

The `INCR` command increments the value of a key by 1, while `DECR` decrements it by 1.
- Both **redis-py** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**redis-py**
```python
await r.incr('counter')  # counter = 1
await r.decr('counter')  # counter = 0
```

**Glide**
```python
await client.incr('counter')  # counter = 1
await client.decr('counter')  # counter = 0
```
</details>

<a id="incrby-decrby"></a>
<details>
<summary><b style="font-size:18px;">INCRBY & DECRBY</b></summary>

The `INCRBY` command increases the value of a key by a specified amount, while `DECRBY` decreases it by a specified amount.
- Both **redis-py** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**redis-py**
```python
await r.incrby('counter', 5)  # 5
await r.decrby('counter', 2)  # 3
```

**Glide**
```python
await client.incrby('counter', 5)  # 5
await client.decrby('counter', 2)  # 3
```
</details>

<a id="append"></a>
<details>
<summary><b style="font-size:18px;">APPEND</b></summary>

The `APPEND` command appends a value to the end of an existing string stored at a key.
- Both **redis-py** and **Glide** support this command in the same way.
- Returns the length of the string after the append operation.

**redis-py**
```python
await r.set('greeting', 'Hello')
await r.append('greeting', ' World')  # Returns length: 11
result = await r.get('greeting')  # b"Hello World" or "Hello World" if decode_responses=True
```

**Glide**
```python
await client.set('greeting', 'Hello')
await client.append('greeting', ' World')  # Returns length: 11
result = await client.get('greeting')  # b"Hello World"
```
</details>

<a id="getrange-setrange"></a>
<details>
<summary><b style="font-size:18px;">GETRANGE & SETRANGE</b></summary>

The `GETRANGE` command retrieves a substring from a string value stored at a key, while `SETRANGE` overwrites part of a string at a key starting at a specified offset.
- Both **redis-py** and **Glide** support these commands in the same way.
- Note that in Glide, the method names are `getrange` and `setrange` (lowercase).

**redis-py**
```python
await r.set('key', 'Hello World')
result = await r.getrange('key', 0, 4)  # b"Hello" or "Hello" if decode_responses=True

await r.setrange('key', 6, 'Redis')  # Returns length: 11
updated = await r.get('key')  # b"Hello Redis" or "Hello Redis" if decode_responses=True
```

**Glide**
```python
await client.set('key', 'Hello World')
result = await client.getrange('key', 0, 4)  # b"Hello"

await client.setrange('key', 6, 'Redis')  # Returns length: 11
updated = await client.get('key')  # b"Hello Redis"
```
</details>

### Key Operations

<a id="del-delete"></a>
<details>
<summary><b style="font-size:18px;">DEL (Delete)</b></summary>

The `DEL` command removes one or more keys from Valkey.
- In **redis-py**, `delete()` accepts multiple keys as separate arguments or as a list.
- In **Glide**, `del()` requires a list of keys.

**redis-py**
```python
await r.delete('key1', 'key2')  # 2 (number of keys deleted)
# or
await r.delete(['key1', 'key2'])  # 2 (number of keys deleted)
```

**Glide**
```python
await client.delete(['key1', 'key2'])  # 2 (number of keys deleted)
```
</details>

<a id="exists"></a>
<details>
<summary><b style="font-size:18px;">EXISTS</b></summary>

The `EXISTS` command checks if one or more keys exist in Valkey.
- In **redis-py**, `exists()` accepts multiple keys as separate arguments or as a list and returns the number of keys that exist.
- In **Glide**, `exists()` requires a list of keys and also returns the number of keys that exist.

**redis-py**
```python
await r.exists('existKey', 'nonExistKey')  # 1 (number of keys that exist)
# or
await r.exists(['existKey', 'nonExistKey'])  # 1 (number of keys that exist)
```

**Glide**
```python
await client.exists(['existKey', 'nonExistKey'])  # 1 (number of keys that exist)
```
</details>

<a id="expire-ttl"></a>
<details>
<summary><b style="font-size:18px;">EXPIRE & TTL</b></summary>

The `EXPIRE` command sets a time-to-live (TTL) for a key, after which it will be automatically deleted. The `TTL` command returns the remaining time-to-live for a key.
- In **redis-py**, `expire()` returns True if successful, False if the key doesn't exist or couldn't be expired.
- In **Glide**, `expire()` returns True if successful, False otherwise.

**redis-py**
```python
await r.expire('key', 10)  # True (success)
ttl = await r.ttl('key')  # 10 (seconds remaining)
```

**Glide**
```python
await client.expire('key', 10)  # True (success)
ttl = await client.ttl('key')  # 10 (seconds remaining)
```
</details>

<a id="keys-scan"></a>
<details>
<summary><b style="font-size:18px;">KEYS & SCAN</b></summary>

The `KEYS` command returns all keys matching a pattern, while `SCAN` iterates through keys in a more efficient way for production use.
- `KEYS` is not recommended for production use as it blocks the server until completion.
- `SCAN` is the preferred method for iterating through keys in production environments.
- In **Glide**, the cursor returned by `scan()` is a bytes object that needs to be converted to a string using `.decode()` or `.toString()`.

**redis-py**
```python
# KEYS (not recommended for production)
all_keys = await r.keys('*')

# SCAN (recommended for production)
cursor = '0'
while cursor != 0:
    cursor, keys = await r.scan(cursor=cursor, match='*')
    if keys:
        print(f'SCAN iteration: {", ".join(keys)}')
```

**Glide**
```python
# KEYS (not recommended for production)
all_keys = await client.keys('*')

# SCAN (recommended for production)
cursor = '0'
while cursor != '0':
    result = await client.scan(cursor)
    cursor = result[0].decode()  # or result[0].toString()
    
    keys = result[1]
    if keys:
        print(f'SCAN iteration: {", ".join([k.decode() for k in keys])}')
```
</details>

<a id="rename-renamenx"></a>
<details>
<summary><b style="font-size:18px;">RENAME & RENAMENX</b></summary>

The `RENAME` command renames a key, while `RENAMENX` renames a key only if the new key does not already exist.
- In **redis-py**, `renamenx()` returns True if successful, False if the target key already exists.
- In **Glide**, `renamenx()` returns True if successful, False if the target key already exists.

**redis-py**
```python
await r.set('oldkey', 'value')
await r.rename('oldkey', 'newkey')  # True

await r.set('key1', 'value1')
result = await r.renamenx('key1', 'key2')  # True (success)
```

**Glide**
```python
await client.set('oldkey', 'value')
await client.rename('oldkey', 'newkey')  # "OK"

await client.set('key1', 'value1')
result = await client.renamenx('key1', 'key2')  # True (success)
```
</details>

### Hash Operations

<a id="hset-hget"></a>
<details>
<summary><b style="font-size:18px;">HSET & HGET</b></summary>

The `HSET` command sets field-value pairs in a hash stored at a key, while `HGET` retrieves the value of a specific field.
- In **redis-py**, `hset()` can accept field-value pairs as separate arguments or as a mapping.
- In **Glide**, `hset()` accepts a key and a mapping of field-value pairs.

**redis-py**
```python
# Set a single field
await r.hset('hash', 'key1', '1')  # 1 (field added)

# Set multiple fields
await r.hset('hash', mapping={'key1': '1', 'key2': '2'})  # 2 (fields added)

# Get a single field
value = await r.hget('hash', 'key1')  # b"1" or "1" if decode_responses=True
```

**Glide**
```python
# Set multiple fields
await client.hset('hash', {'key1': '1', 'key2': '2'})  # 2 (fields added)

# Get a single field
value = await client.hget('hash', 'key1')  # b"1"
```
</details>

<a id="hmset-hmget"></a>
<details>
<summary><b style="font-size:18px;">HMSET & HMGET</b></summary>

The `HMSET` command sets multiple field-value pairs in a hash, while `HMGET` retrieves values for multiple fields.
- In **redis-py**, `hmset()` accepts a mapping of field-value pairs.
- In **Glide**, there is no separate `hmset()` method; instead, `hset()` is used for setting multiple fields.
- For `hmget()`, both libraries require a key and a list of fields.

**redis-py**
```python
# Set multiple fields
await r.hmset('hash', {'key1': '1', 'key2': '2'})

# Get multiple fields
values = await r.hmget('hash', ['key1', 'key2'])  # [b"1", b"2"] or ["1", "2"] if decode_responses=True
```

**Glide**
```python
# Set multiple fields (same as hset in Glide)
await client.hset('hash', {'key1': '1', 'key2': '2'})

# Get multiple fields
values = await client.hmget('hash', ['key1', 'key2'])  # [b"1", b"2"]
```
</details>

<a id="hgetall"></a>
<details>
<summary><b style="font-size:18px;">HGETALL</b></summary>

The `HGETALL` command retrieves all field-value pairs from a hash.
- Both **redis-py** and **Glide** support this command in the same way.
- Returns a dictionary with field names as keys and their values.

**redis-py**
```python
await r.hset('user', mapping={'name': 'John', 'age': '30'})
user = await r.hgetall('user')  # {b'name': b'John', b'age': b'30'} or {'name': 'John', 'age': '30'} if decode_responses=True
```

**Glide**
```python
await client.hset('user', {'name': 'John', 'age': '30'})
user = await client.hgetall('user')  # {b'name': b'John', b'age': b'30'}
```
</details>

<a id="hdel-hexists"></a>
<details>
<summary><b style="font-size:18px;">HDEL & HEXISTS</b></summary>

The `HDEL` command removes one or more fields from a hash, while `HEXISTS` checks if a field exists in a hash.
- In **redis-py**, `hdel()` accepts multiple fields as separate arguments or as a list and returns the number of fields removed.
- In **Glide**, `hdel()` requires a list of fields.
- For `hexists()`, both libraries return True if the field exists, False if it doesn't.

**redis-py**
```python
await r.hset('hash', mapping={'key1': '1', 'key2': '2', 'key3': '3'})
await r.hdel('hash', 'key1', 'key2')  # 2 (fields deleted)
# or
await r.hdel('hash', ['key1', 'key2'])  # 2 (fields deleted)

exists = await r.hexists('hash', 'key3')  # True (exists)
not_exists = await r.hexists('hash', 'key1')  # False (doesn't exist)
```

**Glide**
```python
await client.hset('hash', {'key1': '1', 'key2': '2', 'key3': '3'})
await client.hdel('hash', ['key1', 'key2'])  # 2 (fields deleted)

exists = await client.hexists('hash', 'key3')  # True
not_exists = await client.hexists('hash', 'key1')  # False
```
</details>

### List Operations

<a id="lpush-rpush"></a>
<details>
<summary><b style="font-size:18px;">LPUSH & RPUSH</b></summary>

The `LPUSH` command adds elements to the beginning of a list, while `RPUSH` adds elements to the end of a list.
- In **redis-py**, these commands accept multiple elements as separate arguments or as a list.
- In **Glide**, they require a list of elements.
- Both return the length of the list after the operation.

**redis-py**
```python
length_of_list = await r.lpush('list', 'a', 'b', 'c')  # length_of_list = 3
# or
length_of_list = await r.lpush('list', ['a', 'b', 'c'])  # length_of_list = 3

length_of_list = await r.rpush('list', 'd', 'e')  # length_of_list = 5
# or
length_of_list = await r.rpush('list', ['d', 'e'])  # length_of_list = 5
```

**Glide**
```python
length_of_list = await client.lpush('list', ['a', 'b', 'c'])  # length_of_list = 3
length_of_list = await client.rpush('list', ['d', 'e'])  # length_of_list = 5
```
</details>

<a id="lpop-rpop"></a>
<details>
<summary><b style="font-size:18px;">LPOP & RPOP</b></summary>

The `LPOP` command removes and returns the first element of a list, while `RPOP` removes and returns the last element.
- Both **redis-py** and **Glide** support these commands in the same way.
- Returns None if the list doesn't exist or is empty.

**redis-py**
```python
await r.rpush('list', ['a', 'b', 'c'])
first = await r.lpop('list')  # b"a" or "a" if decode_responses=True
last = await r.rpop('list')  # b"c" or "c" if decode_responses=True
```

**Glide**
```python
await client.rpush('list', ['a', 'b', 'c'])
first = await client.lpop('list')  # b"a"
last = await client.rpop('list')  # b"c"
```
</details>

<a id="lrange"></a>
<details>
<summary><b style="font-size:18px;">LRANGE</b></summary>

The `LRANGE` command retrieves a range of elements from a list.
- Both **redis-py** and **Glide** support this command in the same way.
- The range is specified by start and stop indices, where 0 is the first element, -1 is the last element.

**redis-py**
```python
await r.rpush('list', ['a', 'b', 'c', 'd', 'e'])
elements = await r.lrange('list', 0, 2)  # [b"a", b"b", b"c"] or ["a", "b", "c"] if decode_responses=True
```

**Glide**
```python
await client.rpush('list', ['a', 'b', 'c', 'd', 'e'])
elements = await client.lrange('list', 0, 2)  # [b"a", b"b", b"c"]
```
</details>

### Set Operations

<a id="sadd-smembers"></a>
<details>
<summary><b style="font-size:18px;">SADD & SMEMBERS</b></summary>

The `SADD` command adds one or more members to a set, while `SMEMBERS` returns all members of a set.
- In **redis-py**, `sadd()` accepts multiple members as separate arguments or as a list.
- In **Glide**, `sadd()` requires a list of members.
- Both return the number of members that were added to the set (excluding members that were already present).

**redis-py**
```python
await r.sadd('set', 'a', 'b', 'c')  # 3 (members added)
# or
await r.sadd('set', ['a', 'b', 'c'])  # 3 (members added)

members = await r.smembers('set')  # {b"a", b"b", b"c"} or {"a", "b", "c"} if decode_responses=True
```

**Glide**
```python
await client.sadd('set', ['a', 'b', 'c'])  # 3 (members added)
members = await client.smembers('set')  # {b"a", b"b", b"c"}
```
</details>

<a id="srem-sismember"></a>
<details>
<summary><b style="font-size:18px;">SREM & SISMEMBER</b></summary>

The `SREM` command removes one or more members from a set, while `SISMEMBER` checks if a value is a member of a set.
- In **redis-py**, `srem()` accepts multiple members as separate arguments or as a list and returns the number of members removed.
- In **Glide**, `srem()` requires a list of members.
- For `sismember()`, both libraries return True if the member exists, False if it doesn't.

**redis-py**
```python
await r.sadd('set', ['a', 'b', 'c'])
await r.srem('set', 'a', 'b')  # 2 (members removed)
# or
await r.srem('set', ['a', 'b'])  # 2 (members removed)

is_member = await r.sismember('set', 'c')  # True (is member)
not_member = await r.sismember('set', 'a')  # False (not member)
```

**Glide**
```python
await client.sadd('set', ['a', 'b', 'c'])
await client.srem('set', ['a', 'b'])  # 2 (members removed)

is_member = await client.sismember('set', 'c')  # True
not_member = await client.sismember('set', 'a')  # False
```
</details>

### Sorted Set Operations

<a id="zadd-zrange"></a>
<details>
<summary><b style="font-size:18px;">ZADD & ZRANGE</b></summary>

The `ZADD` command adds one or more members with scores to a sorted set, while `ZRANGE` retrieves members from a sorted set by index range.
- In **redis-py**, `zadd()` accepts score-member pairs as separate arguments or as a mapping.
- In **Glide**, `zadd()` requires a list of objects with score and member properties.
- For `zrange()` with scores, **redis-py** uses a 'withscores' parameter, while **Glide** uses an options object.

**redis-py**
```python
# Using separate arguments
await r.zadd('sortedSet', {'one': 1, 'two': 2, 'three': 3})  # 3 (members added)

members = await r.zrange('sortedSet', 0, -1)  # [b"one", b"two", b"three"] or ["one", "two", "three"] if decode_responses=True

# With scores
with_scores = await r.zrange('sortedSet', 0, -1, withscores=True)
# [(b"one", 1.0), (b"two", 2.0), (b"three", 3.0)] or [("one", 1.0), ("two", 2.0), ("three", 3.0)] if decode_responses=True
```

**Glide**
```python
await client.zadd('sortedSet', [
  {'score': 1, 'member': 'one'},
  {'score': 2, 'member': 'two'},
  {'score': 3, 'member': 'three'}
])  # 3 (members added)

members = await client.zrange('sortedSet', 0, -1)  # [b"one", b"two", b"three"]

# With scores
with_scores = await client.zrange('sortedSet', 0, -1, with_scores=True)
# [(b"one", 1.0), (b"two", 2.0), (b"three", 3.0)]
```
</details>

<a id="zrem-zscore"></a>
<details>
<summary><b style="font-size:18px;">ZREM & ZSCORE</b></summary>

The `ZREM` command removes one or more members from a sorted set, while `ZSCORE` returns the score of a member in a sorted set.
- In **redis-py**, `zrem()` accepts multiple members as separate arguments or as a list.
- In **Glide**, `zrem()` requires a list of members.
- Both return the number of members that were removed from the sorted set.

**redis-py**
```python
await r.zadd('sortedSet', {'one': 1, 'two': 2, 'three': 3})
await r.zrem('sortedSet', 'one', 'two')  # 2 (members removed)
# or
await r.zrem('sortedSet', ['one', 'two'])  # 2 (members removed)

score = await r.zscore('sortedSet', 'three')  # 3.0
```

**Glide**
```python
await client.zadd('sortedSet', [
  {'score': 1, 'member': 'one'},
  {'score': 2, 'member': 'two'},
  {'score': 3, 'member': 'three'}
])
await client.zrem('sortedSet', ['one', 'two'])  # 2 (members removed)

score = await client.zscore('sortedSet', 'three')  # 3.0
```
</details>

<a id="zrank-zrevrank"></a>
<details>
<summary><b style="font-size:18px;">ZRANK & ZREVRANK</b></summary>

The `ZRANK` command returns the rank (position) of a member in a sorted set, while `ZREVRANK` returns the rank in reverse order.
- Both **redis-py** and **Glide** support these commands in the same way.
- Ranks are 0-based, meaning the member with the lowest score has rank 0.
- `ZREVRANK` returns the rank in descending order, where the member with the highest score has rank 0.

**redis-py**
```python
await r.zadd('sortedSet', {'one': 1, 'two': 2, 'three': 3})
rank = await r.zrank('sortedSet', 'two')  # 1 (0-based index)
rev_rank = await r.zrevrank('sortedSet', 'two')  # 1 (0-based index from end)
```

**Glide**
```python
await client.zadd('sortedSet', [
  {'score': 1, 'member': 'one'},
  {'score': 2, 'member': 'two'},
  {'score': 3, 'member': 'three'}
])
rank = await client.zrank('sortedSet', 'two')  # 1 (0-based index)
rev_rank = await client.zrevrank('sortedSet', 'two')  # 1 (0-based index from end)
```
</details>

### Transactions

<a id="transactions-multi-exec"></a>
<details>
<summary><b style="font-size:18px;">Transactions (MULTI / EXEC)</b></summary>

The `MULTI` command starts a transaction block, while `EXEC` executes all commands issued after MULTI.
- In **redis-py**, transactions are created using `r.pipeline(transaction=True)` and executed with `execute()`.
- In **Glide**, transactions are created using the `Transaction` class and executed with `client.exec()`.
- The result format is similar: both return a list of results corresponding to each command in the transaction.

**redis-py**
```python
# Create a transaction
pipeline = r.pipeline(transaction=True)
pipeline.set("key", "value")
pipeline.get("key")
result = await pipeline.execute()  # [True, b"value"] or [True, "value"] if decode_responses=True
```

**Glide**
```python
from glide import Transaction

# Create a transaction
transaction = Transaction()
transaction.set("key", "value")
transaction.get("key")
result = await client.exec(transaction)  # ["OK", b"value"]
```
</details>

### Lua Scripts

<a id="eval-evalsha"></a>
<details>
<summary><b style="font-size:18px;">EVAL / EVALSHA</b></summary>

The `EVAL` command executes a Lua script on the server, while `EVALSHA` executes a script cached on the server using its SHA1 hash.
- In **redis-py**, these commands require specifying the script, the number of keys, and passing keys and arguments separately.
- In **Glide**, scripts are created using the `Script` class and executed with `invoke_script()`, with keys and arguments passed in separate lists.
- **Glide** automatically handles script caching, so there's no need for separate `EVALSHA` handling.

**redis-py**
```python
# EVAL
lua_script = "return {KEYS[1], ARGV[1]}"
result = await r.eval(lua_script, 1, "foo", "bar")
print(result)  # [b'foo', b'bar'] or ['foo', 'bar'] if decode_responses=True

# EVALSHA
sha = await r.script_load(lua_script)
sha_result = await r.evalsha(sha, 1, "foo", "bar")
print(sha_result)  # [b'foo', b'bar'] or ['foo', 'bar'] if decode_responses=True
```

**Glide**
```python
from glide import Script

lua_script = Script("return {KEYS[1], ARGV[1]}")
result = await client.invoke_script(lua_script, keys=["foo"], args=["bar"])
print(result)  # [b'foo', b'bar']
```
</details>

### Authentication

<a id="auth"></a>
<details>
<summary><b style="font-size:18px;">AUTH</b></summary>

The `AUTH` command authenticates a client connection to the Valkey server.
- In **redis-py**, authentication is done using the `auth()` method or during client initialization.
- In **Glide**, authentication is handled during client initialization using `ServerCredentials`.

**redis-py**
```python
# During initialization
r = redis.Redis(host='localhost', port=6379, password='mypass')

# Or after initialization
await r.auth('mypass')  # True
```

**Glide**
```python
# During initialization
credentials = ServerCredentials(password="mypass")
client_config = GlideClientConfiguration(
    addresses=[NodeAddress(host="localhost", port=6379)],
    credentials=credentials
)
client = await GlideClient.create(client_config)
```
</details>

### Custom Commands

<a id="custom-commands"></a>
<details>
<summary><b style="font-size:18px;">Custom Commands</b></summary>

Both libraries provide ways to execute custom or raw Redis commands.
- In **redis-py**, you can use the `execute_command()` method.
- In **Glide**, you can use the `custom_command()` method.

**redis-py**
```python
# Execute a raw command
result = await r.execute_command('SET', 'key', 'value')
print(result)  # True or "OK" depending on the command

# Another example
result = await r.execute_command('HSET', 'hash', 'field', 'value')
print(result)  # 1
```

**Glide**
```python
# Execute a raw command
result = await client.custom_command(['SET', 'key', 'value'])
print(result)  # "OK"

# Another example
result = await client.custom_command(['HSET', 'hash', 'field', 'value'])
print(result)  # 1
```
</details>

## Command Comparison Chart

Below is a comprehensive chart comparing common Redis commands between redis-py and Valkey Glide:

| Command | redis-py | Valkey Glide |
|---------|---------|--------------|
| **Connection** |
| Connect | `redis.Redis(host='localhost', port=6379)` | `GlideClient.create(GlideClientConfiguration(addresses=[NodeAddress(host="localhost", port=6379)]))` |
| Cluster | `RedisCluster(startup_nodes=[{"host": "127.0.0.1", "port": 6379}])` | `GlideClusterClient.create(GlideClusterClientConfiguration(addresses=[NodeAddress(host="127.0.0.1", port=6379)]))` |
| Auth | `r.auth('pass')` | Set in configuration with `ServerCredentials` |
| Select DB | `r.select(1)` | `client.select(1)` |
| **Strings** |
| SET | `r.set('key', 'val')` | `client.set('key', 'val')` |
| GET | `r.get('key')` | `client.get('key')` |
| SETEX | `r.setex('key', 10, 'val')` | `client.set('key', 'val', expiry=ExpirySet(ExpiryType.SEC, 10))` |
| SETNX | `r.setnx('key', 'val')` | `client.set('key', 'val', conditional_set=ConditionalChange.ONLY_IF_DOES_NOT_EXIST)` |
| MSET | `r.mset({'key1': 'val1'})` | `client.mset({'key1': 'val1'})` |
| MGET | `r.mget(['key1', 'key2'])` | `client.mget(['key1', 'key2'])` |
| INCR | `r.incr('counter')` | `client.incr('counter')` |
| DECR | `r.decr('counter')` | `client.decr('counter')` |
| INCRBY | `r.incrby('counter', 5)` | `client.incrby('counter', 5)` |
| DECRBY | `r.decrby('counter', 5)` | `client.decrby('counter', 5)` |
| APPEND | `r.append('key', 'val')` | `client.append('key', 'val')` |
| GETRANGE | `r.getrange('key', 0, 3)` | `client.getrange('key', 0, 3)` |
| SETRANGE | `r.setrange('key', 0, 'val')` | `client.setrange('key', 0, 'val')` |
| **Keys** |
| DEL | `r.delete('key1', 'key2')` or `r.delete(['key1', 'key2'])` | `client.delete(['key1', 'key2'])` |
| EXISTS | `r.exists('key1', 'key2')` or `r.exists(['key1', 'key2'])` | `client.exists(['key1', 'key2'])` |
| EXPIRE | `r.expire('key', 10)` | `client.expire('key', 10)` |
| TTL | `r.ttl('key')` | `client.ttl('key')` |
| KEYS | `r.keys('pattern')` | `client.keys('pattern')` |
| SCAN | `r.scan(cursor=0, match='*')` | `client.scan('0')` |
| RENAME | `r.rename('old', 'new')` | `client.rename('old', 'new')` |
| RENAMENX | `r.renamenx('old', 'new')` | `client.renamenx('old', 'new')` |
| **Hashes** |
| HSET | `r.hset('hash', 'k1', 'v1')` or `r.hset('hash', mapping={'k1': 'v1'})` | `client.hset('hash', {'k1': 'v1'})` |
| HGET | `r.hget('hash', 'field')` | `client.hget('hash', 'field')` |
| HMSET | `r.hmset('hash', {'k1': 'v1'})` | `client.hset('hash', {'k1': 'v1'})` |
| HMGET | `r.hmget('hash', ['k1', 'k2'])` | `client.hmget('hash', ['k1', 'k2'])` |
| HGETALL | `r.hgetall('hash')` | `client.hgetall('hash')` |
| HDEL | `r.hdel('hash', 'k1', 'k2')` or `r.hdel('hash', ['k1', 'k2'])` | `client.hdel('hash', ['k1', 'k2'])` |
| HEXISTS | `r.hexists('hash', 'field')` | `client.hexists('hash', 'field')` |
| **Lists** |
| LPUSH | `r.lpush('list', 'a', 'b')` or `r.lpush('list', ['a', 'b'])` | `client.lpush('list', ['a', 'b'])` |
| RPUSH | `r.rpush('list', 'a', 'b')` or `r.rpush('list', ['a', 'b'])` | `client.rpush('list', ['a', 'b'])` |
| LPOP | `r.lpop('list')` | `client.lpop('list')` |
| RPOP | `r.rpop('list')` | `client.rpop('list')` |
| LRANGE | `r.lrange('list', 0, -1)` | `client.lrange('list', 0, -1)` |
| **Sets** |
| SADD | `r.sadd('set', 'a', 'b')` or `r.sadd('set', ['a', 'b'])` | `client.sadd('set', ['a', 'b'])` |
| SMEMBERS | `r.smembers('set')` | `client.smembers('set')` |
| SREM | `r.srem('set', 'a', 'b')` or `r.srem('set', ['a', 'b'])` | `client.srem('set', ['a', 'b'])` |
| SISMEMBER | `r.sismember('set', 'a')` | `client.sismember('set', 'a')` |
| **Sorted Sets** |
| ZADD | `r.zadd('zset', {'a': 1, 'b': 2})` | `client.zadd('zset', [{'score': 1, 'member': 'a'}, {'score': 2, 'member': 'b'}])` |
| ZRANGE | `r.zrange('zset', 0, -1)` | `client.zrange('zset', 0, -1)` |
| ZRANGE with scores | `r.zrange('zset', 0, -1, withscores=True)` | `client.zrange('zset', 0, -1, with_scores=True)` |
| ZREM | `r.zrem('zset', 'a', 'b')` or `r.zrem('zset', ['a', 'b'])` | `client.zrem('zset', ['a', 'b'])` |
| ZSCORE | `r.zscore('zset', 'a')` | `client.zscore('zset', 'a')` |
| ZRANK | `r.zrank('zset', 'a')` | `client.zrank('zset', 'a')` |
| ZREVRANK | `r.zrevrank('zset', 'a')` | `client.zrevrank('zset', 'a')` |
| **Transactions** |
| MULTI/EXEC | `r.pipeline(transaction=True).set('k', 'v').get('k').execute()` | `client.exec(Transaction().set('k', 'v').get('k'))` |
| **Lua Scripts** |
| EVAL | `r.eval(script, 1, 'key', 'arg')` | `client.invoke_script(Script(script), keys=['key'], args=['arg'])` |
| EVALSHA | `r.evalsha(sha, 1, 'key', 'arg')` | `client.invoke_script(Script(script), keys=['key'], args=['arg'])` |
| **Custom Commands** |
| Raw Command | `r.execute_command('SET', 'key', 'value')` | `client.custom_command(['SET', 'key', 'value'])` |
