# Migration Guide: Lettuce to Valkey Glide

This guide provides a **comprehensive comparison** of how to migrate from **Lettuce to Valkey Glide**, with side-by-side code examples to make the transition as smooth as possible.

## Installation

Add the following dependency to your `pom.xml` file:

```xml
<dependency>
    <groupId>io.valkey</groupId>
    <artifactId>valkey-glide</artifactId>
    <version>1.3.1</version>
</dependency>
```

<a id="dependencies"></a>
<details>
<summary><b style="font-size:22px;">In detail</b></summary>

To use Valkey Glide, you must include a classifier to specify your platform architecture.  
This section includes setup instructions for Gradle, Maven, and SBT, with or without OS detection tools.

Gradle:
- Copy the snippet and paste it in the `build.gradle` dependencies section.
- **IMPORTANT** must include a `classifier` to specify your platform.
```groovy
// osx-aarch_64
dependencies {
    implementation group: 'io.valkey', name: 'valkey-glide', version: '1.+', classifier: 'osx-aarch_64'
}

// linux-aarch_64
dependencies {
    implementation group: 'io.valkey', name: 'valkey-glide', version: '1.+', classifier: 'linux-aarch_64'
}

// linux-x86_64
dependencies {
    implementation group: 'io.valkey', name: 'valkey-glide', version: '1.+', classifier: 'linux-x86_64'
}

// with osdetector
plugins {
    id "com.google.osdetector" version "1.7.3"
}
dependencies {
    implementation group: 'io.valkey', name: 'valkey-glide', version: '1.+', classifier: osdetector.classifier
}
```

Maven:
- **IMPORTANT** must include a `classifier`. Please use this dependency block, or both the dependency and the extension blocks if you're using `os-maven-plugin`, and add it to the pom.xml file.
```xml

<!--osx-aarch_64-->
<dependency>
   <groupId>io.valkey</groupId>
   <artifactId>valkey-glide</artifactId>
   <classifier>osx-aarch_64</classifier>
   <version>[1.0.0,2.0.0)</version>
</dependency>

<!--linux-aarch_64-->
<dependency>
   <groupId>io.valkey</groupId>
   <artifactId>valkey-glide</artifactId>
   <classifier>linux-aarch_64</classifier>
   <version>[1.0.0,2.0.0)</version>
</dependency>

<!--linux-x86_64-->
<dependency>
   <groupId>io.valkey</groupId>
   <artifactId>valkey-glide</artifactId>
   <classifier>linux-x86_64</classifier>
   <version>[1.0.0,2.0.0)</version>
</dependency>

<!--with os-maven-plugin-->
<build>
    <extensions>
        <extension>
            <groupId>kr.motd.maven</groupId>
            <artifactId>os-maven-plugin</artifactId>
        </extension>
    </extensions>
</build>
<dependencies>
    <dependency>
        <groupId>io.valkey</groupId>
        <artifactId>valkey-glide</artifactId>
        <classifier>${os.detected.classifier}</classifier>
        <version>[1.0.0,2.0.0)</version>
    </dependency>
</dependencies>
```

SBT:
- **IMPORTANT** must include a `classifier`. Please use this dependency block and add it to the build.sbt file.
```scala
// osx-aarch_64
libraryDependencies += "io.valkey" % "valkey-glide" % "1.+" classifier "osx-aarch_64"

// linux-aarch_64
libraryDependencies += "io.valkey" % "valkey-glide" % "1.+" classifier "linux-aarch_64"

// linux-x86_64
libraryDependencies += "io.valkey" % "valkey-glide" % "1.+" classifier "linux-x86_64"
```

</details>

## Connection Setup

### Constructor Differences

- **Lettuce** offers multiple constructors for different connection configurations
- **Glide** uses a **single configuration object** that comes pre-configured with best practices

Glide typically requires minimal configuration changes for:
- Timeout settings
- TLS configuration
- Read from replica settings
- User authentication (username & password)

For advanced configurations, refer to the **[Glide Wiki - Java](https://github.com/valkey-io/valkey-glide/wiki/Java-Wrapper)**.

<details>
<summary><b style="font-size:22px;">Standalone Mode</b></summary>

**Lettuce**
```java
RedisClient client = RedisClient.create("redis://localhost");
StatefulRedisConnection<String, String> connection = client.connect();
RedisCommands<String, String> syncCommands = connection.sync();

// With options
RedisURI redisUri = RedisURI.Builder.redis("localhost")
                                .withPassword("password")
                                .withDatabase(2)
                                .build();
RedisClient clientWithOptions = RedisClient.create(redisUri);
StatefulRedisConnection<String, String> connectionWithOptions = clientWithOptions.connect();
RedisCommands<String, String> syncCommandsWithOptions = connectionWithOptions.sync();
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
    .database(2)
    .build();

GlideClient clientWithOptions = GlideClient.createClient(configWithOptions).get();
```

</details>

<details>
<summary><b style="font-size:22px;">Cluster Mode</b></summary>

**Lettuce**  
```java
RedisURI redisUri = RedisURI.create("redis://localhost:7000");
RedisClusterClient clusterClient = RedisClusterClient.create(redisUri);
StatefulRedisClusterConnection<String, String> connection = clusterClient.connect();
RedisAdvancedClusterCommands<String, String> syncCommands = connection.sync();

// With multiple nodes
List<RedisURI> nodes = Arrays.asList(
    RedisURI.create("redis://localhost:7000"),
    RedisURI.create("redis://localhost:7001")
);
RedisClusterClient clusterClientMultiNodes = RedisClusterClient.create(nodes);

// With options
RedisURI redisUriWithOptions = RedisURI.Builder.redis("localhost", 7000)
                                .withPassword("password")
                                .build();
RedisClusterClient clusterClientWithOptions = RedisClusterClient.create(redisUriWithOptions);
```

**Glide**  
```java
import glide.api.GlideClusterClient;
import glide.api.models.configuration.GlideClusterClientConfiguration;
import glide.api.models.configuration.NodeAddress;
import glide.api.models.configuration.ServerCredentials;

// Simple connection
GlideClusterClientConfiguration config = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("localhost")
        .port(7000)
        .build())
    .build();

GlideClusterClient clusterClient = GlideClusterClient.createClient(config).get();

// With multiple nodes
GlideClusterClientConfiguration multiNodeConfig = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("localhost")
        .port(7000)
        .build())
    .address(NodeAddress.builder()
        .host("localhost")
        .port(7001)
        .build())
    .build();

GlideClusterClient multiNodeClient = GlideClusterClient.createClient(multiNodeConfig).get();

// With options
GlideClusterClientConfiguration configWithOptions = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("localhost")
        .port(7000)
        .build())
    .credentials(ServerCredentials.builder()
        .password("password")
        .build())
    .build();

GlideClusterClient clientWithOptions = GlideClusterClient.createClient(configWithOptions).get();
```

</details>

<details>
<summary><b style="font-size:22px;">Constructor Parameters Comparison</b></summary>

The table below compares **Lettuce constructors** with **Glide configuration parameters**:

| **Lettuce Parameter** | **Equivalent Glide Configuration** |
|--------------------------|--------------------------------------|
| `RedisURI.create("redis://host:port")` | `GlideClientConfiguration.builder().address(NodeAddress.builder().host("host").port(port).build()).build()` |
| `RedisURI.Builder.redis(host, port)` | `NodeAddress.builder().host(host).port(port).build()` |
| `withPassword("password")` | `credentials(ServerCredentials.builder().password("password").build())` |
| `withDatabase(2)` | `database(2)` |
| `withSsl(true)` | `useTLS(true)` |
| `withTimeout(Duration.ofMillis(500))` | `requestTimeout(500)` |
| `setClientName("client-name")` | Not directly supported |
| `setClientResources(clientResources)` | Not directly supported, handled internally |
| `ClusterTopologyRefreshOptions` | Not directly supported, handled internally |
| `ClusterClientOptions` | Not directly supported, handled internally |

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

## Command Comparison: Lettuce → Glide

Below is a [comprehensive list](#command-comparison-chart) of common Redis commands and how they are implemented in both Lettuce and Glide.

### Alphabetical Command Reference

| [APPEND](#append) | [GETRANGE](#getrange--setrange) | [LPUSH](#lpush--rpush) | [RENAME](#rename--renamenx) | [SREM](#srem--sismember) |
|-------------------|----------------------------------|------------------------|----------------------------|--------------------------|
| [AUTH](#auth) | [HDEL](#hdel--hexists) | [LRANGE](#lrange) | [RENAMENX](#rename--renamenx) | [TTL](#expire--ttl) |
| [Custom Commands](#custom-commands) | [HEXISTS](#hdel--hexists) | [MGET](#mset--mget-multiple-setget) | [RPOP](#lpop--rpop) | [ZADD](#zadd--zrange) |
| [DECR](#incr--decr) | [HGET](#hset--hget) | [MSET](#mset--mget-multiple-setget) | [RPUSH](#lpush--rpush) | [ZRANGE](#zadd--zrange) |
| [DECRBY](#incrby--decrby) | [HGETALL](#hgetall) | [MULTI/EXEC](#transactions-multi--exec) | [SADD](#sadd--smembers) | [ZRANK](#zrank--zrevrank) |
| [DEL](#del-delete) | [HMGET](#hmset--hmget) | [SCAN](#keys--scan) | [SETEX](#setex-set-with-expiry) | [ZREM](#zrem--zscore) |
| [EVAL / EVALSHA](#eval--evalsha) | [HMSET](#hmset--hmget) | [SET](#set--get) | [SETRANGE](#getrange--setrange) | [ZREVRANK](#zrank--zrevrank) |
| [EXISTS](#exists) | [HSET](#hset--hget) | [SETNX](#setnx-set-if-not-exists) | [SISMEMBER](#srem--sismember) | [ZSCORE](#zrem--zscore) |
| [EXPIRE & TTL](#expire--ttl) | [INCR](#incr--decr) | [KEYS](#keys--scan) | [SMEMBERS](#sadd--smembers) | |
| [GET](#set--get) | [INCRBY](#incrby--decrby) | | [LPOP](#lpop--rpop) | |

### String Operations

<a id="set-get"></a>
<details>
<summary><b style="font-size:18px;">SET & GET</b></summary>

The `SET` command stores a key-value pair in Valkey, while `GET` retrieves the value associated with a key.
- Both **Lettuce** and **Glide** support these commands in a similar way.
- **Glide** uses CompletableFuture for all operations.

**Lettuce**
```java
syncCommands.set("key", "value");
String val = syncCommands.get("key"); // "value"

// With options
syncCommands.setex("key", 60, "value"); // Set with 60 second expiry
```

**Glide**
```java
client.set("key", "value");
String val = client.get("key").get(); // "value"

// With options
client.set("key", "value", 60);
```
</details>

<a id="setex-set-with-expiry"></a>
<details>
<summary><b style="font-size:18px;">SETEX (Set with Expiry)</b></summary>

The `SETEX` command sets a key with an expiration time in seconds.
- In **Lettuce**, this is a dedicated function.
- In **Glide**, expiration is handled using an additional parameter in the `set()` command.

**Lettuce**
```java
syncCommands.setex("key", 5, "value"); // Set with 5 second expiry
```

**Glide**
```java
client.set("key", "value", 5);
```
</details>

<a id="setnx-set-if-not-exists"></a>
<details>
<summary><b style="font-size:18px;">SETNX (Set if Not Exists)</b></summary>

The `SETNX` command sets a key only if it does not already exist.
- In **Lettuce**, this is a dedicated function that returns true if the key was set, false if the key already exists.
- In **Glide**, this is handled using options within the `set()` command.

**Lettuce**
```java
boolean result = syncCommands.setnx("key", "value"); // Returns true if key was set, false if key exists
```

**Glide**
```java
String result = client.set("key", "value", "NX").get(); // Returns "OK" if key was set, null if key exists
```
</details>

<a id="mset-mget-multiple-setget"></a>
<details>
<summary><b style="font-size:18px;">MSET & MGET (Multiple Set/Get)</b></summary>

The `MSET` command sets multiple key-value pairs in a single operation, while `MGET` retrieves values for multiple keys.
- In **Lettuce**, `mset()` accepts a Map of key-value pairs.
- In **Glide**, `mset()` also accepts a Map with key-value pairs.
- For `mget()`, **Lettuce** accepts multiple keys as arguments, while **Glide** requires an array of keys.

**Lettuce**
```java
// Multiple set
Map<String, String> map = new HashMap<>();
map.put("key1", "value1");
map.put("key2", "value2");
syncCommands.mset(map);

// Multiple get
List<KeyValue<String, String>> values = syncCommands.mget("key1", "key2"); // [KeyValue[key1, value1], KeyValue[key2, value2]]
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

<a id="incr-decr"></a>
<details>
<summary><b style="font-size:18px;">INCR & DECR</b></summary>

The `INCR` command increments the value of a key by 1, while `DECR` decrements it by 1.
- Both **Lettuce** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**Lettuce**
```java
syncCommands.incr("counter"); // counter = 1
syncCommands.decr("counter"); // counter = 0
```

**Glide**
```java
client.incr("counter").get(); // counter = 1
client.decr("counter").get(); // counter = 0
```
</details>

<a id="incrby-decrby"></a>
<details>
<summary><b style="font-size:18px;">INCRBY & DECRBY</b></summary>

The `INCRBY` command increases the value of a key by a specified amount, while `DECRBY` decreases it by a specified amount.
- Both **Lettuce** and **Glide** support these commands in the same way.
- The key must contain an integer value, otherwise an error will be returned.

**Lettuce**
```java
syncCommands.incrby("counter", 5); // 5
syncCommands.decrby("counter", 2); // 3
```

**Glide**
```java
client.incrBy("counter", 5).get(); // 5
client.decrBy("counter", 2).get(); // 3
```
</details>

<a id="append"></a>
<details>
<summary><b style="font-size:18px;">APPEND</b></summary>

The `APPEND` command appends a value to the end of an existing string stored at a key.
- Both **Lettuce** and **Glide** support this command in the same way.
- Returns the length of the string after the append operation.

**Lettuce**
```java
syncCommands.set("greeting", "Hello");
syncCommands.append("greeting", " World"); // Returns length: 11
String result = syncCommands.get("greeting"); // "Hello World"
```

**Glide**
```java
client.set("greeting", "Hello");
client.append("greeting", " World").get(); // Returns length: 11
String result = client.get("greeting").get(); // "Hello World"
```
</details>

<a id="getrange-setrange"></a>
<details>
<summary><b style="font-size:18px;">GETRANGE & SETRANGE</b></summary>

The `GETRANGE` command retrieves a substring from a string value stored at a key, while `SETRANGE` overwrites part of a string at a key starting at a specified offset.
- Both **Lettuce** and **Glide** support these commands in the same way.

**Lettuce**
```java
syncCommands.set("key", "Hello World");
String result = syncCommands.getrange("key", 0, 4); // "Hello"

syncCommands.setrange("key", 6, "Redis"); // Returns length: 11
String updated = syncCommands.get("key"); // "Hello Redis"
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

<a id="del-delete"></a>
<details>
<summary><b style="font-size:18px;">DEL (Delete)</b></summary>

The `DEL` command removes one or more keys from Valkey.
- In **Lettuce**, `del()` accepts multiple keys as separate arguments.
- In **Glide**, `del()` requires an array of keys.

**Lettuce**
```java
Long deleted = syncCommands.del("key1", "key2"); // 2 (number of keys deleted)
```

**Glide**
```java
Long deleted = client.del(new String[]{"key1", "key2"}).get(); // 2 (number of keys deleted)
```
</details>

<a id="exists"></a>
<details>
<summary><b style="font-size:18px;">EXISTS</b></summary>

The `EXISTS` command checks if one or more keys exist in Valkey.
- In **Lettuce**, `exists()` accepts multiple keys as separate arguments and returns the number of keys that exist.
- In **Glide**, `exists()` requires an array of keys and also returns the number of keys that exist.

**Lettuce**
```java
Long count = syncCommands.exists("existKey", "nonExistKey"); // 1 (number of keys that exist)
```

**Glide**
```java
Long count = client.exists(new String[]{"existKey", "nonExistKey"}).get(); // 1 (number of keys that exist)
```
</details>

<a id="expire-ttl"></a>
<details>
<summary><b style="font-size:18px;">EXPIRE & TTL</b></summary>

The `EXPIRE` command sets a time-to-live (TTL) for a key, after which it will be automatically deleted. The `TTL` command returns the remaining time-to-live for a key.
- In **Lettuce**, `expire()` returns true if successful, false if the key doesn't exist or couldn't be expired.
- In **Glide**, `expire()` returns 1 if successful, 0 otherwise.

**Lettuce**
```java
Boolean success = syncCommands.expire("key", 10); // true (success)
Long ttl = syncCommands.ttl("key"); // 10 (seconds remaining)
```

**Glide**
```java
Long success = client.expire("key", 10).get(); // 1 (success)
Long ttl = client.ttl("key").get(); // 10 (seconds remaining)
```
</details>

<a id="keys-scan"></a>
<details>
<summary><b style="font-size:18px;">KEYS & SCAN</b></summary>

The `KEYS` command returns all keys matching a pattern, while `SCAN` iterates through keys in a more efficient way for production use.
- `KEYS` is not recommended for production use as it blocks the server until completion.
- `SCAN` is the preferred method for iterating through keys in production environments.

**Lettuce**
```java
// KEYS (not recommended for production)
List<String> allKeys = syncCommands.keys("*");

// SCAN (recommended for production)
ScanCursor cursor = ScanCursor.INITIAL;
ScanIterator<String> iterator = ScanIterator.scan(syncCommands, cursor);

while (iterator.hasNext()) {
    String key = iterator.next();
    System.out.println("SCAN iteration: " + key);
}
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
        System.out.println("SCAN iteration: " + Arrays.toString(keys));
    }
} while (!cursor.equals("0"));
```
</details>

<a id="rename-renamenx"></a>
<details>
<summary><b style="font-size:18px;">RENAME & RENAMENX</b></summary>

The `RENAME` command renames a key, while `RENAMENX` renames a key only if the new key does not already exist.
- In **Lettuce**, `renamenx()` returns true if successful, false if the target key already exists.
- In **Glide**, `renameNx()` returns 1 if successful, 0 if the target key already exists.

**Lettuce**
```java
syncCommands.set("oldkey", "value");
String result = syncCommands.rename("oldkey", "newkey"); // "OK"

syncCommands.set("key1", "value1");
Boolean success = syncCommands.renamenx("key1", "key2"); // true (success)
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

<a id="hset-hget"></a>
<details>
<summary><b style="font-size:18px;">HSET & HGET</b></summary>

The `HSET` command sets field-value pairs in a hash stored at a key, while `HGET` retrieves the value of a specific field.
- In **Lettuce**, `hset()` accepts field-value pairs as separate arguments or as a Map.
- In **Glide**, `hset()` accepts a Map with field-value pairs.

**Lettuce**
```java
// Set multiple fields
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
Long added = syncCommands.hset("hash", map); // 2 (fields added)

// Get a single field
String value = syncCommands.hget("hash", "key1"); // "1"
```

**Glide**
```java
// Set multiple fields
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
Long added = client.hset("hash", map).get(); // 2 (fields added)

// Get a single field
String value = client.hget("hash", "key1").get(); // "1"
```
</details>

<a id="hmset-hmget"></a>
<details>
<summary><b style="font-size:18px;">HMSET & HMGET</b></summary>

The `HMSET` command sets multiple field-value pairs in a hash, while `HMGET` retrieves values for multiple fields.
- In **Lettuce**, `hmset()` accepts a Map of field-value pairs.
- In **Glide**, there is no separate `hmset()` method; instead, `hset()` is used for setting multiple fields.
- For `hmget()`, **Lettuce** accepts multiple fields as arguments, while **Glide** requires an array of fields.

**Lettuce**
```java
// Set multiple fields
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
String result = syncCommands.hmset("hash", map); // "OK"

// Get multiple fields
List<KeyValue<String, String>> values = syncCommands.hmget("hash", "key1", "key2"); // [KeyValue[key1, 1], KeyValue[key2, 2]]
```

**Glide**
```java
// Set multiple fields (same as hset in Glide)
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
Long added = client.hset("hash", map).get(); // 2 (fields added)

// Get multiple fields
String[] values = client.hmget("hash", new String[]{"key1", "key2"}).get(); // ["1", "2"]
```
</details>

<a id="hgetall"></a>
<details>
<summary><b style="font-size:18px;">HGETALL</b></summary>

The `HGETALL` command retrieves all field-value pairs from a hash.
- In **Lettuce**, it returns a Map with field names as keys and their values.
- In **Glide**, it also returns a Map with field names as keys and their values.

**Lettuce**
```java
Map<String, String> map = new HashMap<>();
map.put("name", "John");
map.put("age", "30");
syncCommands.hset("user", map);

Map<String, String> user = syncCommands.hgetall("user"); // {name=John, age=30}
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

<a id="hdel-hexists"></a>
<details>
<summary><b style="font-size:18px;">HDEL & HEXISTS</b></summary>

The `HDEL` command removes one or more fields from a hash, while `HEXISTS` checks if a field exists in a hash.
- In **Lettuce**, `hdel()` accepts multiple fields as separate arguments and returns the number of fields removed.
- In **Glide**, `hdel()` requires an array of fields.
- For `hexists()`, **Lettuce** returns true if the field exists, false if it doesn't, while **Glide** returns 1 or 0.

**Lettuce**
```java
Map<String, String> map = new HashMap<>();
map.put("key1", "1");
map.put("key2", "2");
map.put("key3", "3");
syncCommands.hset("hash", map);

Long deleted = syncCommands.hdel("hash", "key1", "key2"); // 2 (fields deleted)

Boolean exists = syncCommands.hexists("hash", "key3"); // true (exists)
Boolean notExists = syncCommands.hexists("hash", "key1"); // false (doesn't exist)
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

<a id="lpush-rpush"></a>
<details>
<summary><b style="font-size:18px;">LPUSH & RPUSH</b></summary>

The `LPUSH` command adds elements to the beginning of a list, while `RPUSH` adds elements to the end of a list.
- In **Lettuce**, these commands accept multiple elements as separate arguments.
- In **Glide**, they require an array of elements.
- Both return the length of the list after the operation.

**Lettuce**
```java
Long lengthOfList = syncCommands.lpush("list", "a", "b", "c"); // lengthOfList = 3
lengthOfList = syncCommands.rpush("list", "d", "e"); // lengthOfList = 5
```

**Glide**
```java
Long lengthOfList = client.lpush("list", new String[]{"a", "b", "c"}).get(); // lengthOfList = 3
lengthOfList = client.rpush("list", new String[]{"d", "e"}).get(); // lengthOfList = 5
```
</details>

<a id="lpop-rpop"></a>
<details>
<summary><b style="font-size:18px;">LPOP & RPOP</b></summary>

The `LPOP` command removes and returns the first element of a list, while `RPOP` removes and returns the last element.
- Both **Lettuce** and **Glide** support these commands in the same way.
- Returns null if the list doesn't exist or is empty.

**Lettuce**
```java
syncCommands.rpush("list", "a", "b", "c");
String first = syncCommands.lpop("list"); // "a"
String last = syncCommands.rpop("list"); // "c"
```

**Glide**
```java
client.rpush("list", new String[]{"a", "b", "c"});
String first = client.lpop("list").get(); // "a"
String last = client.rpop("list").get(); // "c"
```
</details>

<a id="lrange"></a>
<details>
<summary><b style="font-size:18px;">LRANGE</b></summary>

The `LRANGE` command retrieves a range of elements from a list.
- Both **Lettuce** and **Glide** support this command in the same way.
- The range is specified by start and stop indices, where 0 is the first element, -1 is the last element.

**Lettuce**
```java
syncCommands.rpush("list", "a", "b", "c", "d", "e");
List<String> elements = syncCommands.lrange("list", 0, 2); // ["a", "b", "c"]
```

**Glide**
```java
client.rpush("list", new String[]{"a", "b", "c", "d", "e"});
String[] elements = client.lrange("list", 0, 2).get(); // ["a", "b", "c"]
```
</details>

### Set Operations

<a id="sadd-smembers"></a>
<details>
<summary><b style="font-size:18px;">SADD & SMEMBERS</b></summary>

The `SADD` command adds one or more members to a set, while `SMEMBERS` returns all members of a set.
- In **Lettuce**, `sadd()` accepts multiple members as separate arguments.
- In **Glide**, `sadd()` requires an array of members.
- Both return the number of members that were added to the set (excluding members that were already present).

**Lettuce**
```java
Long added = syncCommands.sadd("set", "a", "b", "c"); // 3 (members added)
Set<String> members = syncCommands.smembers("set"); // ["a", "b", "c"]
```

**Glide**
```java
Long added = client.sadd("set", new String[]{"a", "b", "c"}).get(); // 3 (members added)
String[] members = client.smembers("set").get(); // ["a", "b", "c"]
```
</details>

<a id="srem-sismember"></a>
<details>
<summary><b style="font-size:18px;">SREM & SISMEMBER</b></summary>

The `SREM` command removes one or more members from a set, while `SISMEMBER` checks if a value is a member of a set.
- In **Lettuce**, `srem()` accepts multiple members as separate arguments and returns the number of members removed.
- In **Glide**, `srem()` requires an array of members.
- For `sismember()`, **Lettuce** returns true if the member exists, false if it doesn't, while **Glide** returns 1 or 0.

**Lettuce**
```java
syncCommands.sadd("set", "a", "b", "c");
Long removed = syncCommands.srem("set", "a", "b"); // 2 (members removed)

Boolean isMember = syncCommands.sismember("set", "c"); // true (is member)
Boolean notMember = syncCommands.sismember("set", "a"); // false (not member)
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

<a id="zadd-zrange"></a>
<details>
<summary><b style="font-size:18px;">ZADD & ZRANGE</b></summary>

The `ZADD` command adds one or more members with scores to a sorted set, while `ZRANGE` retrieves members from a sorted set by index range.
- In **Lettuce**, `zadd()` accepts score-member pairs as separate arguments or as a Map.
- In **Glide**, `zadd()` requires an array of objects with score and member properties.
- For `zrange()` with scores, **Lettuce** uses a boolean parameter, while **Glide** uses an options object.

**Lettuce**
```java
Map<String, Double> scoreMembers = new HashMap<>();
scoreMembers.put("one", 1.0);
scoreMembers.put("two", 2.0);
scoreMembers.put("three", 3.0);
Long added = syncCommands.zadd("sortedSet", scoreMembers); // 3 (members added)

List<String> members = syncCommands.zrange("sortedSet", 0, -1); // ["one", "two", "three"]

// With scores
List<ScoredValue<String>> withScores = syncCommands.zrangeWithScores("sortedSet", 0, -1);
// [ScoredValue[score=1.0, value=one], ScoredValue[score=2.0, value=two], ScoredValue[score=3.0, value=three]]
```

**Glide**
```java
// Glide requires an array of objects with score and member properties
Object[] scoreMembers = new Object[] {
    new Object[] { 1.0, "one" },
    new Object[] { 2.0, "two" },
    new Object[] { 3.0, "three" }
};
Long added = client.zadd("sortedSet", scoreMembers).get(); // 3 (members added)

String[] members = client.zrange("sortedSet", 0, -1).get(); // ["one", "two", "three"]

// With scores
Object[] withScores = client.zrange("sortedSet", 0, -1, "WITHSCORES").get();
// ["one", "1", "two", "2", "three", "3"]
```
</details>

<a id="zrem-zscore"></a>
<details>
<summary><b style="font-size:18px;">ZREM & ZSCORE</b></summary>

The `ZREM` command removes one or more members from a sorted set, while `ZSCORE` returns the score of a member in a sorted set.
- In **Lettuce**, `zrem()` accepts multiple members as separate arguments.
- In **Glide**, `zrem()` requires an array of members.
- Both return the number of members that were removed from the sorted set.

**Lettuce**
```java
Map<String, Double> scoreMembers = new HashMap<>();
scoreMembers.put("one", 1.0);
scoreMembers.put("two", 2.0);
scoreMembers.put("three", 3.0);
syncCommands.zadd("sortedSet", scoreMembers);

Long removed = syncCommands.zrem("sortedSet", "one", "two"); // 2 (members removed)

Double score = syncCommands.zscore("sortedSet", "three"); // 3.0
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

<a id="zrank-zrevrank"></a>
<details>
<summary><b style="font-size:18px;">ZRANK & ZREVRANK</b></summary>

The `ZRANK` command returns the rank (position) of a member in a sorted set, while `ZREVRANK` returns the rank in reverse order.
- Both **Lettuce** and **Glide** support these commands in the same way.
- Ranks are 0-based, meaning the member with the lowest score has rank 0.
- `ZREVRANK` returns the rank in descending order, where the member with the highest score has rank 0.

**Lettuce**
```java
Map<String, Double> scoreMembers = new HashMap<>();
scoreMembers.put("one", 1.0);
scoreMembers.put("two", 2.0);
scoreMembers.put("three", 3.0);
syncCommands.zadd("sortedSet", scoreMembers);

Long rank = syncCommands.zrank("sortedSet", "two"); // 1 (0-based index)
Long revRank = syncCommands.zrevrank("sortedSet", "two"); // 1 (0-based index from end)
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

<a id="transactions-multi-exec"></a>
<details>
<summary><b style="font-size:18px;">Transactions (MULTI / EXEC)</b></summary>

The `MULTI` command starts a transaction block, while `EXEC` executes all commands issued after MULTI.
- In **Lettuce**, transactions are created using `syncCommands.multi()` and executed with `exec()`.
- In **Glide**, transactions are created using the `Transaction` class and executed with `client.exec()`.
- The result format differs: **Lettuce** returns a list of results, while **Glide** returns an array of results.

**Lettuce**
```java
syncCommands.multi();
syncCommands.set("key", "value");
syncCommands.get("key");
TransactionResult result = syncCommands.exec();
System.out.println(result.get(0)); // "OK"
System.out.println(result.get(1)); // "value"
```

**Glide**
```java
Transaction transaction = new Transaction();
transaction.set("key", "value");
transaction.get("key");
Object[] result = client.exec(transaction).get();
System.out.println(result[0]); // "OK"
System.out.println(result[1]); // "value"
```
</details>

### Lua Scripts

<a id="eval-evalsha"></a>
<details>
<summary><b style="font-size:18px;">EVAL / EVALSHA</b></summary>

The `EVAL` command executes a Lua script on the server, while `EVALSHA` executes a script cached on the server using its SHA1 hash.
- In **Lettuce**, these commands require specifying the number of keys and passing keys and arguments separately.
- In **Glide**, scripts are created using the `Script` class and executed with `invokeScript()`, with keys and arguments passed in a single options object.
- **Glide** automatically handles script caching, so there's no need for separate `EVALSHA` handling.

**Lettuce**
```java
// EVAL
String luaScript = "return { KEYS[1], ARGV[1] }";
List<String> keys = Collections.singletonList("foo");
List<String> args = Collections.singletonList("bar");

Object result = syncCommands.eval(luaScript, ScriptOutputType.MULTI, keys.toArray(new String[0]), args.toArray(new String[0]));
System.out.println(result); // [foo, bar]

// EVALSHA
String sha = syncCommands.scriptLoad(luaScript);
Object shaResult = syncCommands.evalsha(sha, ScriptOutputType.MULTI, keys.toArray(new String[0]), args.toArray(new String[0]));
System.out.println(shaResult); // [foo, bar]
```

**Glide**
```java
import glide.api.models.Script;
import glide.api.models.ScriptOptions;

String luaScript = "return { KEYS[1], ARGV[1] }";
Script script = new Script(luaScript, false);
ScriptOptions options = ScriptOptions.builder()
    .key("foo")
    .arg("bar")
    .build();

Object result = client.invokeScript(script, options).get();
System.out.println(Arrays.toString((Object[]) result)); // [foo, bar]
```
</details>

### Authentication

<a id="auth"></a>
<details>
<summary><b style="font-size:18px;">AUTH</b></summary>

The `AUTH` command authenticates a client connection to the Valkey server.
- In **Lettuce**, authentication is done using the `auth()` method.
- In **Glide**, authentication is handled using `updateConnectionPassword()`.

**Lettuce**
```java
String result = syncCommands.auth("mypass"); // OK
```

**Glide**
```java
String result = client.updateConnectionPassword("mypass", true).get(); // OK
```
</details>

### Custom Commands

<a id="custom-commands"></a>
<details>
<summary><b style="font-size:18px;">Custom Commands</b></summary>

Both Lettuce and Glide provide ways to execute custom commands.
- In **Lettuce**, you can execute raw commands using `dispatch()` or create custom commands using Lua scripts.
- In **Glide**, you can execute raw commands using `customCommand()` or use the `Script` class for Lua scripts.

**Lettuce**
```java
// Execute a raw command
Object rawResult = syncCommands.dispatch(CommandType.SET, new StatusOutput<>(StringCodec.UTF8),
                new CommandArgs<>(StringCodec.UTF8)
                       .addKey("key")
                       .addValue("value"));
System.out.println(rawResult); // "OK"
```

**Glide**
```java
// Execute a raw command
String rawResult = client.customCommand(new String[]{"SET", "key", "value"}).get();
System.out.println(rawResult); // "OK"
```
</details>

## Command Comparison Chart

Below is a comprehensive chart comparing common Redis commands between Lettuce and Valkey Glide:

| Command | Lettuce | Valkey Glide |
|---------|---------|--------------|
| **Connection** |
| Connect | `RedisClient.create("redis://host:port")` | `GlideClient.createClient(config)` |
| Cluster | `RedisClusterClient.create(redisUri)` | `GlideClusterClient.createClient(config)` |
| Auth | `syncCommands.auth("pass")` | `client.updateConnectionPassword("pass", true)` |
| Select DB | `syncCommands.select(1)` | `client.select(1)` |
| **Strings** |
| SET | `syncCommands.set("key", "val")` | `client.set("key", "val")` |
| GET | `syncCommands.get("key")` | `client.get("key").get()` |
| SETEX | `syncCommands.setex("key", 10, "val")` | `client.set("key", "val", 10)` |
| SETNX | `syncCommands.setnx("key", "val")` | `client.set("key", "val", "NX")` |
| MSET | `syncCommands.mset(map)` | `client.mset(map)` |
| MGET | `syncCommands.mget("key1", "key2")` | `client.mget(new String[]{"key1", "key2"})` |
| INCR | `syncCommands.incr("counter")` | `client.incr("counter")` |
| DECR | `syncCommands.decr("counter")` | `client.decr("counter")` |
| INCRBY | `syncCommands.incrby("counter", 5)` | `client.incrBy("counter", 5)` |
| DECRBY | `syncCommands.decrby("counter", 5)` | `client.decrBy("counter", 5)` |
| APPEND | `syncCommands.append("key", "val")` | `client.append("key", "val")` |
| GETRANGE | `syncCommands.getrange("key", 0, 3)` | `client.getRange("key", 0, 3)` |
| SETRANGE | `syncCommands.setrange("key", 0, "val")` | `client.setRange("key", 0, "val")` |
| **Keys** |
| DEL | `syncCommands.del("key1", "key2")` | `client.del(new String[]{"key1", "key2"})` |
| EXISTS | `syncCommands.exists("key1", "key2")` | `client.exists(new String[]{"key1", "key2"})` |
| EXPIRE | `syncCommands.expire("key", 10)` | `client.expire("key", 10)` |
| TTL | `syncCommands.ttl("key")` | `client.ttl("key")` |
| KEYS | `syncCommands.keys("pattern")` | `client.keys("pattern")` |
| SCAN | `ScanIterator.scan(syncCommands, cursor)` | `client.scan("0")` |
| RENAME | `syncCommands.rename("old", "new")` | `client.rename("old", "new")` |
| RENAMENX | `syncCommands.renamenx("old", "new")` | `client.renameNx("old", "new")` |
| **Hashes** |
| HSET | `syncCommands.hset("hash", map)` | `client.hset("hash", map)` |
| HGET | `syncCommands.hget("hash", "field")` | `client.hget("hash", "field")` |
| HMSET | `syncCommands.hmset("hash", map)` | `client.hset("hash", map)` |
| HMGET | `syncCommands.hmget("hash", "f1", "f2")` | `client.hmget("hash", new String[]{"f1", "f2"})` |
| HGETALL | `syncCommands.hgetall("hash")` | `client.hgetall("hash")` |
| HDEL | `syncCommands.hdel("hash", "f1", "f2")` | `client.hdel("hash", new String[]{"f1", "f2"})` |
| HEXISTS | `syncCommands.hexists("hash", "field")` | `client.hexists("hash", "field")` |
| **Lists** |
| LPUSH | `syncCommands.lpush("list", "a", "b")` | `client.lpush("list", new String[]{"a", "b"})` |
| RPUSH | `syncCommands.rpush("list", "a", "b")` | `client.rpush("list", new String[]{"a", "b"})` |
| LPOP | `syncCommands.lpop("list")` | `client.lpop("list")` |
| RPOP | `syncCommands.rpop("list")` | `client.rpop("list")` |
| LRANGE | `syncCommands.lrange("list", 0, -1)` | `client.lrange("list", 0, -1)` |
| **Sets** |
| SADD | `syncCommands.sadd("set", "a", "b")` | `client.sadd("set", new String[]{"a", "b"})` |
| SMEMBERS | `syncCommands.smembers("set")` | `client.smembers("set")` |
| SREM | `syncCommands.srem("set", "a", "b")` | `client.srem("set", new String[]{"a", "b"})` |
| SISMEMBER | `syncCommands.sismember("set", "a")` | `client.sismember("set", "a")` |
| **Sorted Sets** |
| ZADD | `syncCommands.zadd("zset", scoreMembers)` | `client.zadd("zset", scoreMembers)` |
| ZRANGE | `syncCommands.zrange("zset", 0, -1)` | `client.zrange("zset", 0, -1)` |
| ZRANGE with scores | `syncCommands.zrangeWithScores("zset", 0, -1)` | `client.zrange("zset", 0, -1, "WITHSCORES")` |
| ZREM | `syncCommands.zrem("zset", "a", "b")` | `client.zrem("zset", new String[]{"a", "b"})` |
| ZSCORE | `syncCommands.zscore("zset", "a")` | `client.zscore("zset", "a")` |
| ZRANK | `syncCommands.zrank("zset", "a")` | `client.zrank("zset", "a")` |
| ZREVRANK | `syncCommands.zrevrank("zset", "a")` | `client.zrevrank("zset", "a")` |
| **Transactions** |
| MULTI/EXEC | `syncCommands.multi(); syncCommands.set("k", "v"); syncCommands.exec();` | `client.exec(new Transaction().set("k", "v"))` |
| **Lua Scripts** |
| EVAL | `syncCommands.eval(script, outputType, keys, args)` | `client.invokeScript(new Script(script), options)` |
| EVALSHA | `syncCommands.evalsha(sha, outputType, keys, args)` | `client.invokeScript(new Script(script), options)` |
| **Custom Commands** |
| Raw Command | `syncCommands.dispatch(commandType, output, args)` | `client.customCommand(new String[]{"CMD", "arg1", "arg2"})` |
