# Migration Guide: Jedis to Valkey Glide

This guide provides a **comprehensive comparison** of how to migrate from **Jedis to Valkey Glide**, with side-by-side code examples to make the transition as smooth as possible.

## Installation

Add the following dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>io.valkey</groupId>
    <artifactId>valkey-glide</artifactId>
    <version>1.3.1</version>
</dependency>
```

## Connection Setup

### Constructor Differences

- **Jedis** offers multiple constructors for different connection configurations
- **Glide** uses a **single configuration object** that comes pre-configured with best practices

Glide typically requires minimal configuration changes for:
- Timeout settings
- TLS configuration
- Read from replica settings
- User authentication (username & password)

For advanced configurations, refer to the **[Glide Wiki - Java](https://github.com/valkey-io/valkey-glide/wiki/Java-Wrapper)**.

<details>
<summary><b style="font-size:22px;">Standalone Mode</b></summary>

**Jedis**
```java
// Simple connection
Jedis jedis = new Jedis("localhost", 6379);

// With options
Jedis jedisWithOptions = new Jedis("localhost", 6379, 2000);
jedisWithOptions.auth("password");
jedisWithOptions.select(0);
```

**Glide**
```java
import glide.api.GlideClient;
import glide.api.models.configuration.GlideClientConfiguration;
import glide.api.models.configuration.NodeAddress;
import glide.api.models.configuration.ServerCredentials;

// Simple connection
GlideClientConfiguration config = GlideClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("localhost")
        .port(6379)
        .build())
    .build();

GlideClient client = GlideClient.createClient(config).get();

// With options
GlideClientConfiguration configWithOptions = GlideClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("localhost")
        .port(6379)
        .build())
    .credentials(ServerCredentials.builder()
        .password("password")
        .build())
    .database(0)
    .build();

GlideClient clientWithOptions = GlideClient.createClient(configWithOptions).get();
```

</details>

<details>
<summary><b style="font-size:22px;">Cluster Mode</b></summary>

**Jedis**  
```java
// Simple cluster connection
Set<HostAndPort> jedisClusterNodes = new HashSet<>();
jedisClusterNodes.add(new HostAndPort("127.0.0.1", 7000));
jedisClusterNodes.add(new HostAndPort("127.0.0.1", 7001));
JedisCluster cluster = new JedisCluster(jedisClusterNodes);

// With options
JedisPoolConfig poolConfig = new JedisPoolConfig();
poolConfig.setMaxTotal(128);
poolConfig.setMaxIdle(128);
poolConfig.setMinIdle(16);
poolConfig.setTestOnBorrow(true);
poolConfig.setTestOnReturn(true);
poolConfig.setTestWhileIdle(true);

JedisCluster clusterWithOptions = new JedisCluster(jedisClusterNodes, 2000, 2000, 5, "password", poolConfig);
```

**Glide**  
```java
import glide.api.GlideClusterClient;
import glide.api.models.configuration.GlideClusterClientConfiguration;
import glide.api.models.configuration.NodeAddress;
import glide.api.models.configuration.ServerCredentials;

// Simple cluster connection
GlideClusterClientConfiguration config = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("127.0.0.1")
        .port(7000)
        .build())
    .address(NodeAddress.builder()
        .host("127.0.0.1")
        .port(7001)
        .build())
    .build();

GlideClusterClient clusterClient = GlideClusterClient.createClient(config).get();

// With options
GlideClusterClientConfiguration configWithOptions = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("127.0.0.1")
        .port(7000)
        .build())
    .address(NodeAddress.builder()
        .host("127.0.0.1")
        .port(7001)
        .build())
    .credentials(ServerCredentials.builder()
        .password("password")
        .build())
    .build();

GlideClusterClient clusterClientWithOptions = GlideClusterClient.createClient(configWithOptions).get();
```

</details>

<details>
<summary><b style="font-size:22px;">Constructor Parameters Comparison</b></summary>

The table below compares **Jedis constructors** with **Glide configuration parameters**:

| **Jedis Parameter** | **Equivalent Glide Configuration** |
|--------------------------|--------------------------------------|
| `host: String` | `address(NodeAddress.builder().host(host).build())` |
| `port: int` | `address(NodeAddress.builder().port(port).build())` |
| `timeout: int` | `requestTimeout(timeout)` |
| `password: String` | `credentials(ServerCredentials.builder().password(password).build())` |
| `user: String` | `credentials(ServerCredentials.builder().username(user).build())` |
| `db: int` | `database(db)` |
| `ssl: boolean` | `useTLS(true)` |
| `JedisPoolConfig poolConfig` | Not needed, handled internally |
| `maxAttempts: int` | `advancedConfiguration.maxRetries(maxAttempts)` |
| `clientName: String` | Not directly supported |
| `Set<HostAndPort> clusterNodes` | Multiple `.address()` calls |
| `Duration topologyRefreshPeriod` | Not directly supported, handled internally |
| `Duration maxTotalRetriesDuration` | Not directly supported, handled internally |

**Advanced configuration**

**Standalone Mode** uses `GlideClientConfiguration` and **Cluster Mode** uses `GlideClusterClientConfiguration`, but the usage is similar:

```java
// Standalone mode
GlideClientConfiguration config = GlideClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("localhost")
        .port(6379)
        .build())
    .requestTimeout(500)
    .build();

GlideClient client = GlideClient.createClient(config).get();

// Cluster mode
GlideClusterClientConfiguration clusterConfig = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("localhost")
        .port(7000)
        .build())
    .requestTimeout(500)
    .build();

GlideClusterClient clusterClient = GlideClusterClient.createClient(clusterConfig).get();
```

</details>

## Command Comparison: Jedis → Glide

Below is a comprehensive list of common Redis commands and how they are implemented in both Jedis and Glide.

**NOTE**: **Glide** uses asynchronous execution, so most commands return a `CompletableFuture<T>`. Use `.get()` to retrieve the result.

### String Operations

<details>
<summary><b style="font-size:18px;">SET & GET</b></summary>

The `SET` command stores a key-value pair in Valkey, while `GET` retrieves the value associated with a key.
- Both **Jedis** and **Glide** support these commands in the same way.

**Jedis**
```java
// Set a key-value pair
jedis.set("key", "value");

// Retrieve the value
String value = jedis.get("key");  // value = "value"
```

**Glide**
```java
// Set a key-value pair
client.set("key", "value");

// Retrieve the value
String value = client.get("key").get();  // value = "value"
```

**Note:** The `.get()` is required in **Glide** because `get()` returns a **`CompletableFuture<String>`**.
</details>

<details>
<summary><b style="font-size:18px;">SETEX (Set with Expiry)</b></summary>

The `SETEX` command sets a key with an expiration time in seconds.
- In **Jedis**, this is a dedicated function.
- In **Glide**, expiration is handled using an additional parameter in the `set()` command.

**Jedis**
```java
jedis.setex("key", 5, "value"); // Set with 5 second expiry
```

**Glide**
```java
client.set("key", "value", 5);
```
</details>

<details>
<summary><b style="font-size:18px;">SETNX (Set if Not Exists)</b></summary>

The `SETNX` command sets a key only if it does not already exist.
- In **Jedis**, this is a dedicated function that returns 1 if the key was set, 0 if the key already exists.
- In **Glide**, this is handled using options within the `set()` command.

**Jedis**
```java
Long result = jedis.setnx("key", "value"); // Returns 1 if key was set, 0 if key exists
```

**Glide**
```java
String result = client.set("key", "value", "NX").get(); // Returns "OK" if key was set, null if key exists
```
</details>

<details>
<summary><b style="font-size:18px;">MSET & MGET (Multiple Set/Get)</b></summary>

The `MSET` command sets multiple key-value pairs in a single operation, while `MGET` retrieves values for multiple keys.
- In **Jedis**, `mset()` accepts a Map of key-value pairs.
- In **Glide**, `mset()` also accepts a Map with key-value pairs.
- For `mget()`, **Jedis** accepts multiple keys as separate arguments, while **Glide** requires an array of keys.

**Jedis**
```java
// Multiple set
Map<String, String> map = new HashMap<>();
map.put("key1", "value1");
map.put("key2", "value2");
String result = jedis.mset(map); // "OK"

// Multiple get
List<String> values = jedis.mget("key1", "key2"); // ["value1", "value2"]
```

**Glide**
```java
// Multiple set
Map<String, String> map = new HashMap<>();
map.put("key1", "value1");
map.put("key2", "value2");
client.mset(map);

// Multiple get
String[] values = client.mget(new String[]{"key1", "key2"}).get(); // ["value1", "value2"]
```
</details>

<details>
<summary><b style="font-size:18px;">INCR & DECR</b></summary>

The `INCR` command increments the value of a key by 1, while `DECR` decrements it by 1.
- Both **Jedis** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**Jedis**
```java
jedis.set("counter", "1");
jedis.incr("counter"); // counter = 2
jedis.decr("counter"); // counter = 1
```

**Glide**
```java
client.set("counter", "1");
client.incr("counter").get(); // counter = 2
client.decr("counter").get(); // counter = 1
```
</details>

<details>
<summary><b style="font-size:18px;">INCRBY & DECRBY</b></summary>

The `INCRBY` command increases the value of a key by a specified amount, while `DECRBY` decreases it by a specified amount.
- Both **Jedis** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**Jedis**
```java
long counter = jedis.incrBy("counter", 5); // counter: 5
counter = jedis.decrBy("counter", 2); // counter: 3
```

**Glide**
```java
long counter = client.incrBy("counter", 5).get(); // counter: 5
counter = client.decrBy("counter", 2).get(); // counter: 3
```
</details>

<details>
<summary><b style="font-size:18px;">APPEND</b></summary>

The `APPEND` command appends a value to the end of an existing string stored at a key.
- Both **Jedis** and **Glide** support this command in the same way.
- Returns the length of the string after the append operation.

**Jedis**
```java
jedis.set("greeting", "Hello");
Long length = jedis.append("greeting", " World"); // Returns length: 11
String result = jedis.get("greeting"); // "Hello World"
```

**Glide**
```java
client.set("greeting", "Hello");
Long length = client.append("greeting", " World").get(); // Returns length: 11
String result = client.get("greeting").get(); // "Hello World"
```
</details>

<details>
<summary><b style="font-size:18px;">GETRANGE & SETRANGE</b></summary>

The `GETRANGE` command retrieves a substring from a string value stored at a key, while `SETRANGE` overwrites part of a string at a key starting at a specified offset.
- Both **Jedis** and **Glide** support these commands in the same way.
- Note the camelCase method names in Glide: `getRange` and `setRange`.

**Jedis**
```java
jedis.set("key", "Hello World");
String result = jedis.getrange("key", 0, 4); // "Hello"

jedis.setrange("key", 6, "Redis"); // Returns length: 11
String updated = jedis.get("key"); // "Hello Redis"
```

**Glide**
```java
client.set("key", "Hello World");
String result = client.getRange("key", 0, 4).get(); // "Hello"

client.setRange("key", 6, "Redis").get(); // Returns length: 11
String updated = client.get("key").get(); // "Hello Redis"
```
</details>

### Key Operations

<details>
<summary><b style="font-size:18px;">DEL (Delete)</b></summary>

The `DEL` command removes one or more keys from Valkey.
- In **Jedis**, `del()` accepts multiple keys as separate arguments.
- In **Glide**, `del()` requires an array of keys.

**Jedis**
```java
Long deleted = jedis.del("key1", "key2"); // 2 (number of keys deleted)
```

**Glide**
```java
Long deleted = client.del(new String[]{"key1", "key2"}).get(); // 2 (number of keys deleted)
```
</details>

<details>
<summary><b style="font-size:18px;">EXISTS</b></summary>

The `EXISTS` command checks if one or more keys exist in Valkey.
- In **Jedis**, `exists(String key)` returns true if the key exists. If given multiple keys (String... keys), it returns the number of existing keys.
- In **Glide**, `exists()` takes a list of keys (`String[]`) and returns a **Long** indicating how many of the provided keys exist.

**Jedis**
```java
boolean exists = jedis.exists("key"); // true or false for a single key
Long count = jedis.exists("key1", "key2"); // number of keys that exist
```

**Glide**
```java
Long count = client.exists(new String[]{"key1", "key2"}).get(); // number of keys that exist
```
</details>

<details>
<summary><b style="font-size:18px;">EXPIRE & TTL</b></summary>

The `EXPIRE` command sets a time-to-live (TTL) for a key, after which it will be automatically deleted. The `TTL` command returns the remaining time-to-live for a key.
- In **Jedis**, `expire()` returns 1 if successful, 0 if the key doesn't exist or couldn't be expired.
- In **Glide**, `expire()` returns 1 if successful, 0 otherwise.

**Jedis**
```java
Long success = jedis.expire("key", 10); // 1 (success)
Long ttl = jedis.ttl("key"); // 10 (seconds remaining)
```

**Glide**
```java
Long success = client.expire("key", 10).get(); // 1 (success)
Long ttl = client.ttl("key").get(); // 10 (seconds remaining)
```
</details>

<details>
<summary><b style="font-size:18px;">KEYS & SCAN</b></summary>

The `KEYS` command returns all keys matching a pattern, while `SCAN` iterates through keys in a more efficient way for production use.
- `KEYS` is not recommended for production use as it blocks the server until completion.
- `SCAN` is the preferred method for iterating through keys in production environments.

**Jedis**
```java
// KEYS (not recommended for production)
Set<String> allKeys = jedis.keys("*");

// SCAN (recommended for production)
String cursor = ScanParams.SCAN_POINTER_START;
ScanResult<String> scanResult;

do {
    scanResult = jedis.scan(cursor);
    cursor = scanResult.getCursor();

    List<String> keys = scanResult.getResult();
    if (keys.size() > 0) {
        System.out.println("SCAN iteration: " + String.join(", ", keys));
    }
} while (!cursor.equals(ScanParams.SCAN_POINTER_START));
```

**Glide**
```java
// KEYS (not recommended for production)
String[] allKeys = client.keys("*").get();

// SCAN (recommended for production)
String cursor = "0";
Object[] result;

do {
    result = client.scan(cursor).get();
    cursor = result[0].toString();

    Object[] keys = (Object[]) result[1];
    if (keys.length > 0) {
        String keyList = Arrays.stream(keys)
            .map(obj -> (String) obj)
            .collect(Collectors.joining(", "));
        System.out.println("SCAN iteration: " + keyList);
    }
} while (!cursor.equals("0"));
```
</details>

<details>
<summary><b style="font-size:18px;">RENAME & RENAMENX</b></summary>

The `RENAME` command renames a key, while `RENAMENX` renames a key only if the new key does not already exist.
- In **Jedis**, `renamenx()` returns 1 if successful, 0 if the target key already exists.
- In **Glide**, `renameNx()` returns 1 if successful, 0 if the target key already exists.
- Note the camelCase method name in Glide: `renameNx`.

**Jedis**
```java
jedis.set("oldkey", "value");
String result = jedis.rename("oldkey", "newkey"); // "OK"

jedis.set("key1", "value1");
Long success = jedis.renamenx("key1", "key2"); // 1 (success)
```

**Glide**
```java
client.set("oldkey", "value");
String result = client.rename("oldkey", "newkey").get(); // "OK"

client.set("key1", "value1");
Long success = client.renameNx("key1", "key2").get(); // 1 (success)
```
</details>

### Hash Operations

<details>
<summary><b style="font-size:18px;">HSET & HGET</b></summary>

The `HSET` command sets field-value pairs in a hash stored at a key, while `HGET` retrieves the value of a specific field.
- In **Jedis**, `hset()` accepts field-value pairs as separate arguments or as a Map.
- In **Glide**, `hset()` accepts a Map with field-value pairs.

**Jedis**
```java
// Set a single field
jedis.hset("hash", "key1", "1"); // 1 (field added)

// Set multiple fields
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
jedis.hset("hash", map); // 2 (fields added)

// Get a single field
String value = jedis.hget("hash", "key1"); // "1"
```

**Glide**
```java
// Set a single field
Map<String, String> singleField = new HashMap<>();
singleField.put("key1", "1");
client.hset("hash", singleField).get(); // 1 (field added)

// Set multiple fields
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
client.hset("hash", map).get(); // 2 (fields added)

// Get a single field
String value = client.hget("hash", "key1").get(); // "1"
```
</details>

<details>
<summary><b style="font-size:18px;">HMSET & HMGET</b></summary>

The `HMSET` command sets multiple field-value pairs in a hash, while `HMGET` retrieves values for multiple fields.
- In **Jedis**, `hmset()` accepts a Map of field-value pairs.
- In **Glide**, there is no separate `hmset()` method; instead, `hset()` is used for setting multiple fields.
- For `hmget()`, **Jedis** accepts multiple fields as arguments, while **Glide** requires an array of fields.

**Jedis**
```java
// Set multiple fields
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
String result = jedis.hmset("hash", map); // "OK"

// Get multiple fields
List<String> values = jedis.hmget("hash", "key1", "key2"); // ["1", "2"]
```

**Glide**
```java
// Set multiple fields (same as hset in Glide)
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
client.hset("hash", map).get(); // 2 (fields added)

// Get multiple fields
String[] values = client.hmget("hash", new String[]{"key1", "key2"}).get(); // ["1", "2"]
```
</details>

<details>
<summary><b style="font-size:18px;">HGETALL</b></summary>

The `HGETALL` command retrieves all field-value pairs from a hash.
- Both **Jedis** and **Glide** support this command in the same way.
- Returns a Map with field names as keys and their values.

**Jedis**
```java
Map<String, String> map = new HashMap<>();
map.put("name", "John");
map.put("age", "30");
jedis.hset("user", map);

Map<String, String> user = jedis.hgetAll("user"); // {name=John, age=30}
```

**Glide**
```java
Map<String, String> map = new HashMap<>();
map.put("name", "John");
map.put("age", "30");
client.hset("user", map);

Map<String, String> user = client.hgetall("user").get(); // {name=John, age=30}
```
</details>

<details>
<summary><b style="font-size:18px;">HDEL & HEXISTS</b></summary>

The `HDEL` command removes one or more fields from a hash, while `HEXISTS` checks if a field exists in a hash.
- In **Jedis**, `hdel()` accepts multiple fields as separate arguments and returns the number of fields removed.
- In **Glide**, `hdel()` requires an array of fields.
- For `hexists()`, **Jedis** returns true if the field exists, false if it doesn't, while **Glide** returns 1 or 0.

**Jedis**
```java
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
map.put("key3", "3");
jedis.hset("hash", map);

Long deleted = jedis.hdel("hash", "key1", "key2"); // 2 (fields deleted)

Boolean exists = jedis.hexists("hash", "key3"); // true (exists)
Boolean notExists = jedis.hexists("hash", "key1"); // false (doesn't exist)
```

**Glide**
```java
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
map.put("key3", "3");
client.hset("hash", map);

Long deleted = client.hdel("hash", new String[]{"key1", "key2"}).get(); // 2 (fields deleted)

Long exists = client.hexists("hash", "key3").get(); // 1 (exists)
Long notExists = client.hexists("hash", "key1").get(); // 0 (doesn't exist)
```
</details>

### List Operations

<details>
<summary><b style="font-size:18px;">LPUSH & RPUSH</b></summary>

The `LPUSH` command adds elements to the beginning of a list, while `RPUSH` adds elements to the end of a list.
- In **Jedis**, these commands accept multiple elements as separate arguments.
- In **Glide**, they require an array of elements.
- Both return the length of the list after the operation.

**Jedis**
```java
Long lengthOfList = jedis.lpush("list", "a", "b", "c"); // lengthOfList = 3
lengthOfList = jedis.rpush("list", "d", "e"); // lengthOfList = 5
```

**Glide**
```java
Long lengthOfList = client.lpush("list", new String[]{"a", "b", "c"}).get(); // lengthOfList = 3
lengthOfList = client.rpush("list", new String[]{"d", "e"}).get(); // lengthOfList = 5
```
</details>

<details>
<summary><b style="font-size:18px;">LPOP & RPOP</b></summary>

The `LPOP` command removes and returns the first element of a list, while `RPOP` removes and returns the last element.
- Both **Jedis** and **Glide** support these commands in the same way.
- Returns null if the list doesn't exist or is empty.

**Jedis**
```java
jedis.rpush("list", "a", "b", "c");
String first = jedis.lpop("list"); // "a"
String last = jedis.rpop("list"); // "c"
```

**Glide**
```java
client.rpush("list", new String[]{"a", "b", "c"});
String first = client.lpop("list").get(); // "a"
String last = client.rpop("list").get(); // "c"
```
</details>

<details>
<summary><b style="font-size:18px;">LRANGE</b></summary>

The `LRANGE` command retrieves a range of elements from a list.
- Both **Jedis** and **Glide** support this command in the same way.
- The range is specified by start and stop indices, where 0 is the first element, -1 is the last element.

**Jedis**
```java
jedis.rpush("list", "a", "b", "c", "d", "e");
List<String> elements = jedis.lrange("list", 0, 2); // ["a", "b", "c"]
```

**Glide**
```java
client.rpush("list", new String[]{"a", "b", "c", "d", "e"});
String[] elements = client.lrange("list", 0, 2).get(); // ["a", "b", "c"]
```
</details>

### Set Operations

<details>
<summary><b style="font-size:18px;">SADD & SMEMBERS</b></summary>

The `SADD` command adds one or more members to a set, while `SMEMBERS` returns all members of a set.
- In **Jedis**, `sadd()` accepts multiple members as separate arguments.
- In **Glide**, `sadd()` requires an array of members.
- Both return the number of members that were added to the set (excluding members that were already present).

**Jedis**
```java
Long added = jedis.sadd("set", "a", "b", "c"); // 3 (members added)
Set<String> members = jedis.smembers("set"); // ["a", "b", "c"]
```

**Glide**
```java
Long added = client.sadd("set", new String[]{"a", "b", "c"}).get(); // 3 (members added)
String[] members = client.smembers("set").get(); // ["a", "b", "c"]
```
</details>

<details>
<summary><b style="font-size:18px;">SREM & SISMEMBER</b></summary>

The `SREM` command removes one or more members from a set, while `SISMEMBER` checks if a value is a member of a set.
- In **Jedis**, `srem()` accepts multiple members as separate arguments and returns the number of members removed.
- In **Glide**, `srem()` requires an array of members.
- For `sismember()`, **Jedis** returns true if the member exists, false if it doesn't, while **Glide** returns 1 or 0.

**Jedis**
```java
jedis.sadd("set", "a", "b", "c");
Long removed = jedis.srem("set", "a", "b"); // 2 (members removed)

Boolean isMember = jedis.sismember("set", "c"); // true (is member)
Boolean notMember = jedis.sismember("set", "a"); // false (not member)
```

**Glide**
```java
client.sadd("set", new String[]{"a", "b", "c"});
Long removed = client.srem("set", new String[]{"a", "b"}).get(); // 2 (members removed)

Long isMember = client.sismember("set", "c").get(); // 1 (is member)
Long notMember = client.sismember("set", "a").get(); // 0 (not member)
```
</details>

### Sorted Set Operations

<details>
<summary><b style="font-size:18px;">ZADD & ZRANGE</b></summary>

The `ZADD` command adds one or more members with scores to a sorted set, while `ZRANGE` retrieves members from a sorted set by index range.
- In **Jedis**, `zadd()` accepts score-member pairs as separate arguments.
- In **Glide**, `zadd()` requires an array of objects with score and member properties.
- For `zrange()` with scores, **Jedis** uses a boolean parameter, while **Glide** uses a string parameter.

**Jedis**
```java
// Add members with scores
jedis.zadd("sortedSet", 1, "one", 2, "two", 3, "three"); // 3 (members added)

// Get range of members
List<String> members = jedis.zrange("sortedSet", 0, -1); // ["one", "two", "three"]

// With scores
Map<String, Double> withScores = jedis.zrangeWithScores("sortedSet", 0, -1)
    .stream()
    .collect(Collectors.toMap(
        Tuple::getElement,
        Tuple::getScore
    )); // {one=1.0, two=2.0, three=3.0}
```

**Glide**
```java
// Add members with scores
Object[] scoreMembers = new Object[] {
    new Object[] { 1.0, "one" },
    new Object[] { 2.0, "two" },
    new Object[] { 3.0, "three" }
};
Long added = client.zadd("sortedSet", scoreMembers).get(); // 3 (members added)

// Get range of members
String[] members = client.zrange("sortedSet", 0, -1).get(); // ["one", "two", "three"]

// With scores
Object[] withScores = client.zrange("sortedSet", 0, -1, "WITHSCORES").get();
// ["one", "1", "two", "2", "three", "3"]
```
</details>

<details>
<summary><b style="font-size:18px;">ZREM & ZSCORE</b></summary>

The `ZREM` command removes one or more members from a sorted set, while `ZSCORE` returns the score of a member in a sorted set.
- In **Jedis**, `zrem()` accepts multiple members as separate arguments.
- In **Glide**, `zrem()` requires an array of members.
- Both return the number of members that were removed from the sorted set.

**Jedis**
```java
jedis.zadd("sortedSet", 1, "one", 2, "two", 3, "three");
Long removed = jedis.zrem("sortedSet", "one", "two"); // 2 (members removed)

Double score = jedis.zscore("sortedSet", "three"); // 3.0
```

**Glide**
```java
Object[] scoreMembers = new Object[] {
    new Object[] { 1.0, "one" },
    new Object[] { 2.0, "two" },
    new Object[] { 3.0, "three" }
};
client.zadd("sortedSet", scoreMembers);

Long removed = client.zrem("sortedSet", new String[]{"one", "two"}).get(); // 2 (members removed)

String score = client.zscore("sortedSet", "three").get(); // "3"
```
</details>

<details>
<summary><b style="font-size:18px;">ZRANK & ZREVRANK</b></summary>

The `ZRANK` command returns the rank (position) of a member in a sorted set, while `ZREVRANK` returns the rank in reverse order.
- Both **Jedis** and **Glide** support these commands in the same way.
- Ranks are 0-based, meaning the member with the lowest score has rank 0.
- `ZREVRANK` returns the rank in descending order, where the member with the highest score has rank 0.

**Jedis**
```java
jedis.zadd("sortedSet", 1, "one", 2, "two", 3, "three");
Long rank = jedis.zrank("sortedSet", "two"); // 1 (0-based index)
Long revRank = jedis.zrevrank("sortedSet", "two"); // 1 (0-based index from end)
```

**Glide**
```java
Object[] scoreMembers = new Object[] {
    new Object[] { 1.0, "one" },
    new Object[] { 2.0, "two" },
    new Object[] { 3.0, "three" }
};
client.zadd("sortedSet", scoreMembers);

Long rank = client.zrank("sortedSet", "two").get(); // 1 (0-based index)
Long revRank = client.zrevrank("sortedSet", "two").get(); // 1 (0-based index from end)
```
</details>

### Transactions

<details>
<summary><b style="font-size:18px;">Transactions (MULTI / EXEC)</b></summary>

The `MULTI` command starts a transaction block, while `EXEC` executes all commands issued after MULTI.
- In **Jedis**, transactions are started using `jedis.multi()`.
- In **Glide**, transactions are represented as a `Transaction` object.
- The result format differs: **Jedis** returns a list of results, while **Glide** returns an array of results.

**Jedis**
```java
// Start a transaction
Transaction transaction = jedis.multi();

// Add commands to the transaction
transaction.set("key", "value");
transaction.incr("counter");
transaction.get("key");

// Execute the transaction
List<Object> result = transaction.exec();
System.out.println(result); // [OK, 1, value]
```

**Glide**
```java
import glide.api.models.Transaction;

// Initialize a transaction object
Transaction transaction = new Transaction();

// Add commands to the transaction
transaction.set("key", "value");
transaction.incr("counter");
transaction.get("key");

// Execute the transaction
Object[] result = client.exec(transaction).get();
System.out.println(Arrays.toString(result)); // [OK, 1, value]
```
</details>

### Lua Scripts

<details>
<summary><b style="font-size:18px;">EVAL / EVALSHA</b></summary>

The `EVAL` command executes a Lua script on the server, while `EVALSHA` executes a script cached on the server using its SHA1 hash.
- In **Jedis**, these commands require specifying the number of keys and passing keys and arguments separately.
- In **Glide**, scripts are created using the `Script` class and executed with `invokeScript()`, with keys and arguments passed in a single options object.
- **Glide** automatically handles script caching, so there's no need for separate `EVALSHA` handling.

**Jedis**
```java
// EVAL
String script = "return 'Hello, Lua!'";
Object result = jedis.eval(script);
System.out.println(result); // Hello, Lua!

// With keys and arguments
String scriptWithArgs = "return {KEYS[1], ARGV[1]}";
Object resultWithArgs = jedis.eval(scriptWithArgs, 1, "key", "value");
System.out.println(resultWithArgs); // [key, value]

// EVALSHA
String sha1 = jedis.scriptLoad(scriptWithArgs);
Object shaResult = jedis.evalsha(sha1, 1, "key", "value");
System.out.println(shaResult); // [key, value]
```

**Glide**
```java
import glide.api.models.Script;
import glide.api.models.ScriptOptions;

// EVAL
String script = "return 'Hello, Lua!'";
Script luaScript = new Script(script, false);
String result = (String) client.invokeScript(luaScript).get();
System.out.println(result); // Hello, Lua!

// With keys and arguments
String scriptWithArgs = "return {KEYS[1], ARGV[1]}";
Script luaScriptWithArgs = new Script(scriptWithArgs, false);
ScriptOptions options = ScriptOptions.builder()
    .key("key")
    .arg("value")
    .build();
Object[] resultWithArgs = (Object[]) client.invokeScript(luaScriptWithArgs, options).get();
System.out.println(Arrays.toString(resultWithArgs)); // [key, value]
```
</details>

### Authentication

<details>
<summary><b style="font-size:18px;">AUTH</b></summary>

The `AUTH` command authenticates a client connection to the Valkey server.
- In **Jedis**, authentication is done using the `auth()` method.
- In **Glide**, authentication is handled using `updateConnectionPassword()`.

**Jedis**
```java
String result = jedis.auth("mypass"); // OK
```

**Glide**
```java
String result = client.updateConnectionPassword("mypass", true).get(); // OK
```
</details>

### Custom Commands

<details>
<summary><b style="font-size:18px;">Custom Commands</b></summary>

Both Jedis and Glide provide ways to execute custom commands.
- In **Jedis**, you can execute raw commands using the `sendCommand()` method.
- In **Glide**, you can execute raw commands using `customCommand()`.

**Jedis**
```java
// Execute a raw command
Object rawResult = jedis.sendCommand(Protocol.Command.SET, "key", "value");
System.out.println(rawResult); // OK
```

**Glide**
```java
// Execute a raw command
String rawResult = client.customCommand(new String[]{"SET", "key", "value"}).get();
System.out.println(rawResult); // OK
```
</details>

## Command Comparison Chart

Below is a comprehensive chart comparing common Redis commands between Jedis and Valkey Glide:

| Command | Jedis | Valkey Glide |
|---------|---------|--------------|
| **Connection** |
| Connect | `new Jedis("host", port)` | `GlideClient.createClient(config).get()` |
| Cluster | `new JedisCluster(jedisClusterNodes)` | `GlideClusterClient.createClient(config).get()` |
| Auth | `jedis.auth("pass")` | `client.updateConnectionPassword("pass", true).get()` |
| Select DB | `jedis.select(1)` | `client.select(1).get()` |
| **Strings** |
| SET | `jedis.set("key", "val")` | `client.set("key", "val")` |
| GET | `jedis.get("key")` | `client.get("key").get()` |
| SETEX | `jedis.setex("key", 10, "val")` | `client.set("key", "val", 10)` |
| SETNX | `jedis.setnx("key", "val")` | `client.set("key", "val", "NX").get()` |
| MSET | `jedis.mset(map)` | `client.mset(map)` |
| MGET | `jedis.mget("key1", "key2")` | `client.mget(new String[]{"key1", "key2"}).get()` |
| INCR | `jedis.incr("counter")` | `client.incr("counter").get()` |
| DECR | `jedis.decr("counter")` | `client.decr("counter").get()` |
| INCRBY | `jedis.incrBy("counter", 5)` | `client.incrBy("counter", 5).get()` |
| DECRBY | `jedis.decrBy("counter", 5)` | `client.decrBy("counter", 5).get()` |
| APPEND | `jedis.append("key", "val")` | `client.append("key", "val").get()` |
| GETRANGE | `jedis.getrange("key", 0, 3)` | `client.getRange("key", 0, 3).get()` |
| SETRANGE | `jedis.setrange("key", 0, "val")` | `client.setRange("key", 0, "val").get()` |
| **Keys** |
| DEL | `jedis.del("key1", "key2")` | `client.del(new String[]{"key1", "key2"}).get()` |
| EXISTS | `jedis.exists("key1", "key2")` | `client.exists(new String[]{"key1", "key2"}).get()` |
| EXPIRE | `jedis.expire("key", 10)` | `client.expire("key", 10).get()` |
| TTL | `jedis.ttl("key")` | `client.ttl("key").get()` |
| KEYS | `jedis.keys("pattern")` | `client.keys("pattern").get()` |
| SCAN | `jedis.scan(cursor)` | `client.scan(cursor).get()` |
| RENAME | `jedis.rename("old", "new")` | `client.rename("old", "new").get()` |
| RENAMENX | `jedis.renamenx("old", "new")` | `client.renameNx("old", "new").get()` |
| **Hashes** |
| HSET | `jedis.hset("hash", map)` | `client.hset("hash", map).get()` |
| HGET | `jedis.hget("hash", "field")` | `client.hget("hash", "field").get()` |
| HMSET | `jedis.hmset("hash", map)` | `client.hset("hash", map).get()` |
| HMGET | `jedis.hmget("hash", "f1", "f2")` | `client.hmget("hash", new String[]{"f1", "f2"}).get()` |
| HGETALL | `jedis.hgetAll("hash")` | `client.hgetall("hash").get()` |
| HDEL | `jedis.hdel("hash", "f1", "f2")` | `client.hdel("hash", new String[]{"f1", "f2"}).get()` |
| HEXISTS | `jedis.hexists("hash", "field")` | `client.hexists("hash", "field").get()` |
| **Lists** |
| LPUSH | `jedis.lpush("list", "a", "b")` | `client.lpush("list", new String[]{"a", "b"}).get()` |
| RPUSH | `jedis.rpush("list", "a", "b")` | `client.rpush("list", new String[]{"a", "b"}).get()` |
| LPOP | `jedis.lpop("list")` | `client.lpop("list").get()` |
| RPOP | `jedis.rpop("list")` | `client.rpop("list").get()` |
| LRANGE | `jedis.lrange("list", 0, -1)` | `client.lrange("list", 0, -1).get()` |
| **Sets** |
| SADD | `jedis.sadd("set", "a", "b")` | `client.sadd("set", new String[]{"a", "b"}).get()` |
| SMEMBERS | `jedis.smembers("set")` | `client.smembers("set").get()` |
| SREM | `jedis.srem("set", "a", "b")` | `client.srem("set", new String[]{"a", "b"}).get()` |
| SISMEMBER | `jedis.sismember("set", "a")` | `client.sismember("set", "a").get()` |
| **Sorted Sets** |
| ZADD | `jedis.zadd("zset", 1, "a", 2, "b")` | `client.zadd("zset", scoreMembers).get()` |
| ZRANGE | `jedis.zrange("zset", 0, -1)` | `client.zrange("zset", 0, -1).get()` |
| ZRANGE with scores | `jedis.zrangeWithScores("zset", 0, -1)` | `client.zrange("zset", 0, -1, "WITHSCORES").get()` |
| ZREM | `jedis.zrem("zset", "a", "b")` | `client.zrem("zset", new String[]{"a", "b"}).get()` |
| ZSCORE | `jedis.zscore("zset", "a")` | `client.zscore("zset", "a").get()` |
| ZRANK | `jedis.zrank("zset", "a")` | `client.zrank("zset", "a").get()` |
| ZREVRANK | `jedis.zrevrank("zset", "a")` | `client.zrevrank("zset", "a").get()` |
| **Transactions** |
| MULTI/EXEC | `jedis.multi().set("k", "v").exec()` | `client.exec(new Transaction().set("k", "v")).get()` |
| **Lua Scripts** |
| EVAL | `jedis.eval(script, numKeys, keys, args)` | `client.invokeScript(new Script(script), options).get()` |
| EVALSHA | `jedis.evalsha(sha, numKeys, keys, args)` | `client.invokeScript(new Script(script), options).get()` |
| **Custom Commands** |
| Raw Command | `jedis.sendCommand(Command.SET, "key", "value")` | `client.customCommand(new String[]{"SET", "key", "value"}).get()` |
