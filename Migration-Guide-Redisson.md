# Migration Guide: Redisson to Valkey Glide

This guide provides a **comprehensive comparison** of how to migrate from **Redisson to Valkey Glide**, with side-by-side code examples to make the transition as smooth as possible.

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

- **Redisson** uses a configuration-based approach with `Config` objects and factory methods
- **Glide** uses a **single configuration object** that comes pre-configured with best practices

Glide typically requires minimal configuration changes for:
- Timeout settings
- TLS configuration
- Read from replica settings
- User authentication (username & password)

For advanced configurations, refer to the **[Glide Wiki - Java](https://github.com/valkey-io/valkey-glide/wiki/Java-Wrapper)**.

<details>
<summary><b style="font-size:22px;">Standalone Mode</b></summary>

**Redisson**
```java
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

// Simple connection
Config config = new Config();
config.useSingleServer()
    .setAddress("redis://localhost:6379");
RedissonClient redisson = Redisson.create(config);

// With options
Config configWithOptions = new Config();
configWithOptions.useSingleServer()
    .setAddress("redis://localhost:6379")
    .setPassword("password")
    .setDatabase(0)
    .setTimeout(2000);
RedissonClient redissonWithOptions = Redisson.create(configWithOptions);
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
    .requestTimeout(2000)
    .build();

GlideClient clientWithOptions = GlideClient.createClient(configWithOptions).get();
```

</details>

<details>
<summary><b style="font-size:22px;">Cluster Mode</b></summary>

**Redisson**  
```java
import org.redisson.config.Config;

// Simple cluster connection
Config config = new Config();
config.useClusterServers()
    .addNodeAddress("redis://127.0.0.1:7000")
    .addNodeAddress("redis://127.0.0.1:7001");
RedissonClient cluster = Redisson.create(config);

// With options
Config configWithOptions = new Config();
configWithOptions.useClusterServers()
    .addNodeAddress("redis://127.0.0.1:7000")
    .addNodeAddress("redis://127.0.0.1:7001")
    .setPassword("password")
    .setTimeout(2000)
    .setRetryAttempts(5);
RedissonClient clusterWithOptions = Redisson.create(configWithOptions);
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
    .requestTimeout(2000)
    .build();

GlideClusterClient clusterClientWithOptions = GlideClusterClient.createClient(configWithOptions).get();
```

</details>

<details>
<summary><b style="font-size:22px;">Constructor Parameters Comparison</b></summary>

The table below compares **Redisson configuration** with **Glide configuration parameters**:

| **Redisson Parameter** | **Equivalent Glide Configuration** |
|--------------------------|--------------------------------------|
| `setAddress("redis://host:port")` | `address(NodeAddress.builder().host(host).port(port).build())` |
| `setTimeout(timeout)` | `requestTimeout(timeout)` |
| `setPassword("password")` | `credentials(ServerCredentials.builder().password(password).build())` |
| `setUsername("user")` | `credentials(ServerCredentials.builder().username(user).build())` |
| `setDatabase(db)` | `database(db)` |
| `setUseSsl(true)` | `useTLS(true)` |
| `setRetryAttempts(attempts)` | Not directly supported, handled internally |
| `setClientName("name")` | Not directly supported |
| `addNodeAddress("redis://host:port")` | Multiple `.address()` calls |

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

## Command Comparison: Redisson → Glide

Below is a [comprehensive list](#command-comparison-chart) of common Redis commands and how they are implemented in both Redisson and Glide.

**NOTE**: **Glide** uses asynchronous execution, so most commands return a `CompletableFuture<T>`. Use `.get()` to retrieve the result.

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
- **Redisson** uses `RBucket` objects to represent string values.
- **Glide** provides direct `set()` and `get()` methods on the client.

**Redisson**
```java
// Set a key-value pair
RBucket<String> bucket = redisson.getBucket("key");
bucket.set("value");

// Retrieve the value
String value = bucket.get(); // value = "value"

// Alternative approach
redisson.getBucket("key").set("value");
String value = redisson.getBucket("key").get(); // value = "value"
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

<a id="setex-set-with-expiry"></a>
<details>
<summary><b style="font-size:18px;">SETEX (Set with Expiry)</b></summary>

The `SETEX` command sets a key with an expiration time in seconds.
- In **Redisson**, expiration is handled using `expire()` method or `setAsync()` with duration.
- In **Glide**, expiration is handled using an additional parameter in the `set()` command.

**Redisson**
```java
RBucket<String> bucket = redisson.getBucket("key");
bucket.set("value", Duration.ofSeconds(5)); // Set with 5 second expiry
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
- In **Redisson**, this is handled using `trySet()` method which returns true if the key was set.
- In **Glide**, this is handled using conditional set options within the `set()` command.

**Redisson**
```java
RBucket<String> bucket = redisson.getBucket("key");
boolean result = bucket.trySet("value"); // Returns true if key was set, false if key exists
```

**Glide**
```java
import glide.api.models.commands.SetOptions;
import glide.api.models.commands.ConditionalChange;

String result = client.set("key", "value", SetOptions.builder()
    .conditionalSet(ConditionalChange.ONLY_IF_DOES_NOT_EXIST)
    .build()).get(); // Returns "OK" if key was set, null if key exists
```
</details>

<a id="mset-mget-multiple-setget"></a>
<details>
<summary><b style="font-size:18px;">MSET & MGET (Multiple Set/Get)</b></summary>

The `MSET` command sets multiple key-value pairs in a single operation, while `MGET` retrieves values for multiple keys.
- In **Redisson**, `RBuckets` is used for bulk operations with Maps.
- In **Glide**, `mset()` accepts a Map and `mget()` requires an array of keys.

**Redisson**
```java
// Multiple set
RBuckets buckets = redisson.getBuckets();
Map<String, String> map = new HashMap<>();
map.put("key1", "value1");
map.put("key2", "value2");
buckets.set(map);

// Multiple get
Map<String, String> values = buckets.get("key1", "key2"); // {key1=value1, key2=value2}
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
- **Redisson** uses `RAtomicLong` for atomic increment/decrement operations.
- **Glide** provides direct `incr()` and `decr()` methods.

**Redisson**
```java
redisson.getBucket("counter").set("1");
RAtomicLong counter = redisson.getAtomicLong("counter");
counter.incrementAndGet(); // counter = 2
counter.decrementAndGet(); // counter = 1
```

**Glide**
```java
client.set("counter", "1");
client.incr("counter").get(); // counter = 2
client.decr("counter").get(); // counter = 1
```
</details>

<a id="incrby-decrby"></a>
<details>
<summary><b style="font-size:18px;">INCRBY & DECRBY</b></summary>

The `INCRBY` command increases the value of a key by a specified amount, while `DECRBY` decreases it by a specified amount.
- **Redisson** uses `RAtomicLong` with `addAndGet()` method.
- **Glide** provides direct `incrBy()` and `decrBy()` methods.

**Redisson**
```java
RAtomicLong counter = redisson.getAtomicLong("counter");
long result = counter.addAndGet(5); // counter: 5
result = counter.addAndGet(-2); // counter: 3
```

**Glide**
```java
long counter = client.incrBy("counter", 5).get(); // counter: 5
counter = client.decrBy("counter", 2).get(); // counter: 3
```
</details>

<a id="append"></a>
<details>
<summary><b style="font-size:18px;">APPEND</b></summary>

The `APPEND` command appends a value to the end of an existing string stored at a key.
- **Redisson** doesn't have a direct append method; you need to get, concatenate, and set.
- **Glide** provides a direct `append()` method.

**Redisson**
```java
RBucket<String> bucket = redisson.getBucket("greeting");
bucket.set("Hello");
String current = bucket.get();
bucket.set(current + " World"); // Manual append
String result = bucket.get(); // "Hello World"
```

**Glide**
```java
client.set("greeting", "Hello");
Long length = client.append("greeting", " World").get(); // Returns length: 11
String result = client.get("greeting").get(); // "Hello World"
```
</details>

<a id="getrange-setrange"></a>
<details>
<summary><b style="font-size:18px;">GETRANGE & SETRANGE</b></summary>

The `GETRANGE` command retrieves a substring from a string value stored at a key, while `SETRANGE` overwrites part of a string at a key starting at a specified offset.
- **Redisson** doesn't have direct getrange/setrange methods.
- **Glide** provides direct `getRange()` and `setRange()` methods.

**Redisson**
```java
// Redisson doesn't have direct getrange/setrange support
// You would need to implement this manually using get/set operations
RBucket<String> bucket = redisson.getBucket("key");
bucket.set("Hello World");
String value = bucket.get();
String substring = value.substring(0, 5); // "Hello" (manual implementation)
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
- In **Redisson**, individual objects have `delete()` methods, or use `RKeys` for bulk operations.
- In **Glide**, `del()` requires an array of keys.

**Redisson**
```java
// Delete single key
redisson.getBucket("key1").delete();

// Delete multiple keys
RKeys keys = redisson.getKeys();
long deleted = keys.delete("key1", "key2"); // 2 (number of keys deleted)
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
- In **Redisson**, individual objects have `isExists()` methods, or use `RKeys` for bulk operations.
- In **Glide**, `exists()` takes a list of keys and returns a **Long** indicating how many exist.

**Redisson**
```java
// Check single key
boolean exists = redisson.getBucket("key").isExists(); // true or false

// Check multiple keys
RKeys keys = redisson.getKeys();
long count = keys.countExists("key1", "key2"); // number of keys that exist
```

**Glide**
```java
Long count = client.exists(new String[]{"key1", "key2"}).get(); // number of keys that exist
```
</details>

<a id="expire-ttl"></a>
<details>
<summary><b style="font-size:18px;">EXPIRE & TTL</b></summary>

The `EXPIRE` command sets a time-to-live (TTL) for a key, after which it will be automatically deleted. The `TTL` command returns the remaining time-to-live for a key.
- In **Redisson**, objects implement `RExpirable` interface with `expire()` and `remainTimeToLive()` methods.
- In **Glide**, `expire()` and `ttl()` are direct client methods.

**Redisson**
```java
RBucket<String> bucket = redisson.getBucket("key");
bucket.set("value");
boolean success = bucket.expire(Duration.ofSeconds(10)); // true (success)
long ttl = bucket.remainTimeToLive(); // milliseconds remaining
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
- **Redisson** provides `RKeys` interface with `getKeys()` and `getKeysStream()` methods.
- **Glide** provides direct `keys()` and `scan()` methods.

**Redisson**
```java
RKeys keys = redisson.getKeys();

// KEYS (not recommended for production)
Iterable<String> allKeys = keys.getKeysByPattern("*");

// SCAN (recommended for production)
Iterable<String> keysIterable = keys.getKeysStream().toIterable();
for (String key : keysIterable) {
    System.out.println("Key: " + key);
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
        String keyList = Arrays.stream(keys)
            .map(obj -> (String) obj)
            .collect(Collectors.joining(", "));
        System.out.println("SCAN iteration: " + keyList);
    }
} while (!cursor.equals("0"));
```
</details>

<a id="rename-renamenx"></a>
<details>
<summary><b style="font-size:18px;">RENAME & RENAMENX</b></summary>

The `RENAME` command renames a key, while `RENAMENX` renames a key only if the new key does not already exist.
- In **Redisson**, objects have `rename()` and `renamenx()` methods.
- In **Glide**, `rename()` and `renameNx()` are direct client methods.

**Redisson**
```java
RBucket<String> bucket = redisson.getBucket("oldkey");
bucket.set("value");
bucket.rename("newkey"); // void

RBucket<String> bucket1 = redisson.getBucket("key1");
bucket1.set("value1");
boolean success = bucket1.renamenx("key2"); // true (success)
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
- In **Redisson**, `RMap` is used for hash operations with `put()` and `get()` methods.
- In **Glide**, `hset()` accepts a Map and `hget()` retrieves individual fields.

**Redisson**
```java
RMap<String, String> map = redisson.getMap("hash");

// Set a single field
map.put("key1", "1"); // returns previous value or null

// Set multiple fields
Map<String, String> fields = new HashMap<>();
fields.put("key1", "1");
fields.put("key2", "2");
map.putAll(fields);

// Get a single field
String value = map.get("key1"); // "1"
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

<a id="hmset-hmget"></a>
<details>
<summary><b style="font-size:18px;">HMSET & HMGET</b></summary>

The `HMSET` command sets multiple field-value pairs in a hash, while `HMGET` retrieves values for multiple fields.
- In **Redisson**, `RMap.putAll()` is used for setting multiple fields, and `getAll()` for getting multiple fields.
- In **Glide**, `hset()` is used for setting multiple fields, and `hmget()` requires an array of fields.

**Redisson**
```java
RMap<String, String> map = redisson.getMap("hash");

// Set multiple fields
Map<String, String> fields = new HashMap<>();
fields.put("key1", "1");
fields.put("key2", "2");
map.putAll(fields);

// Get multiple fields
Map<String, String> values = map.getAll(Set.of("key1", "key2")); // {key1=1, key2=2}
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

<a id="hgetall"></a>
<details>
<summary><b style="font-size:18px;">HGETALL</b></summary>

The `HGETALL` command retrieves all field-value pairs from a hash.
- **Redisson** uses `RMap.readAllMap()` to get all entries.
- **Glide** provides direct `hgetall()` method.

**Redisson**
```java
RMap<String, String> map = redisson.getMap("user");
Map<String, String> fields = new HashMap<>();
fields.put("name", "John");
fields.put("age", "30");
map.putAll(fields);

Map<String, String> user = map.readAllMap(); // {name=John, age=30}
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
- In **Redisson**, `RMap` provides `remove()` and `containsKey()` methods.
- In **Glide**, `hdel()` requires an array of fields, and `hexists()` returns 1 or 0.

**Redisson**
```java
RMap<String, String> map = redisson.getMap("hash");
Map<String, String> fields = new HashMap<>();
fields.put("key1", "1");
fields.put("key2", "2");
fields.put("key3", "3");
map.putAll(fields);

// Remove fields
map.remove("key1");
map.remove("key2");

// Check existence
boolean exists = map.containsKey("key3"); // true (exists)
boolean notExists = map.containsKey("key1"); // false (doesn't exist)
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
- In **Redisson**, `RList` provides `addFirst()` and `add()` methods.
- In **Glide**, `lpush()` and `rpush()` require arrays of elements.

**Redisson**
```java
RList<String> list = redisson.getList("list");
list.addFirst("c");
list.addFirst("b");
list.addFirst("a"); // List: [a, b, c]

list.add("d");
list.add("e"); // List: [a, b, c, d, e]
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
- In **Redisson**, `RList` provides `removeFirst()` and `removeLast()` methods.
- **Glide** provides direct `lpop()` and `rpop()` methods.

**Redisson**
```java
RList<String> list = redisson.getList("list");
list.add("a");
list.add("b");
list.add("c");

String first = list.removeFirst(); // "a"
String last = list.removeLast(); // "c"
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
- In **Redisson**, `RList` provides `range()` method.
- **Glide** provides direct `lrange()` method.

**Redisson**
```java
RList<String> list = redisson.getList("list");
list.add("a");
list.add("b");
list.add("c");
list.add("d");
list.add("e");

List<String> elements = list.range(0, 2); // [a, b, c]
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
- In **Redisson**, `RSet` provides `add()` and `readAll()` methods.
- In **Glide**, `sadd()` requires an array of members.

**Redisson**
```java
RSet<String> set = redisson.getSet("set");
boolean added1 = set.add("a"); // true
boolean added2 = set.add("b"); // true
boolean added3 = set.add("c"); // true

Set<String> members = set.readAll(); // [a, b, c]
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
- In **Redisson**, `RSet` provides `remove()` and `contains()` methods.
- In **Glide**, `srem()` requires an array of members, and `sismember()` returns 1 or 0.

**Redisson**
```java
RSet<String> set = redisson.getSet("set");
set.add("a");
set.add("b");
set.add("c");

boolean removed1 = set.remove("a"); // true
boolean removed2 = set.remove("b"); // true

boolean isMember = set.contains("c"); // true (is member)
boolean notMember = set.contains("a"); // false (not member)
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
- In **Redisson**, `RScoredSortedSet` provides `add()` and `valueRange()` methods.
- In **Glide**, `zadd()` requires an array of score-member pairs.

**Redisson**
```java
RScoredSortedSet<String> sortedSet = redisson.getScoredSortedSet("sortedSet");

// Add members with scores
sortedSet.add(1.0, "one");
sortedSet.add(2.0, "two");
sortedSet.add(3.0, "three");

// Get range of members
Collection<String> members = sortedSet.valueRange(0, -1); // [one, two, three]

// With scores
Collection<ScoredEntry<String>> withScores = sortedSet.entryRange(0, -1);
// [{one=1.0}, {two=2.0}, {three=3.0}]
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

<a id="zrem-zscore"></a>
<details>
<summary><b style="font-size:18px;">ZREM & ZSCORE</b></summary>

The `ZREM` command removes one or more members from a sorted set, while `ZSCORE` returns the score of a member in a sorted set.
- In **Redisson**, `RScoredSortedSet` provides `remove()` and `getScore()` methods.
- In **Glide**, `zrem()` requires an array of members.

**Redisson**
```java
RScoredSortedSet<String> sortedSet = redisson.getScoredSortedSet("sortedSet");
sortedSet.add(1.0, "one");
sortedSet.add(2.0, "two");
sortedSet.add(3.0, "three");

boolean removed1 = sortedSet.remove("one"); // true
boolean removed2 = sortedSet.remove("two"); // true

Double score = sortedSet.getScore("three"); // 3.0
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
- In **Redisson**, `RScoredSortedSet` provides `rank()` and `revRank()` methods.
- **Glide** provides direct `zrank()` and `zrevrank()` methods.

**Redisson**
```java
RScoredSortedSet<String> sortedSet = redisson.getScoredSortedSet("sortedSet");
sortedSet.add(1.0, "one");
sortedSet.add(2.0, "two");
sortedSet.add(3.0, "three");

Integer rank = sortedSet.rank("two"); // 1 (0-based index)
Integer revRank = sortedSet.revRank("two"); // 1 (0-based index from end)
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
- In **Redisson**, transactions are handled using `RBatch` for batching operations.
- In **Glide**, transactions are represented as a `Transaction` object.

**Redisson**
```java
// Create a batch (similar to transaction)
RBatch batch = redisson.createBatch();

// Add commands to the batch
batch.getBucket("key").setAsync("value");
batch.getAtomicLong("counter").incrementAndGetAsync();
batch.getBucket("key").getAsync();

// Execute the batch
BatchResult<?> result = batch.execute();
List<?> responses = result.getResponses();
System.out.println(responses); // [void, 1, value]
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

<a id="eval-evalsha"></a>
<details>
<summary><b style="font-size:18px;">EVAL / EVALSHA</b></summary>

The `EVAL` command executes a Lua script on the server, while `EVALSHA` executes a script cached on the server using its SHA1 hash.
- In **Redisson**, scripts are executed using `RScript` interface.
- In **Glide**, scripts are created using the `Script` class and executed with `invokeScript()`.

**Redisson**
```java
RScript script = redisson.getScript();

// EVAL
String luaScript = "return 'Hello, Lua!'";
Object result = script.eval(RScript.Mode.READ_ONLY, luaScript, RScript.ReturnType.VALUE);
System.out.println(result); // Hello, Lua!

// With keys and arguments
String scriptWithArgs = "return {KEYS[1], ARGV[1]}";
List<Object> resultWithArgs = script.eval(RScript.Mode.READ_ONLY, scriptWithArgs, 
    RScript.ReturnType.MULTI, Arrays.asList("key"), "value");
System.out.println(resultWithArgs); // [key, value]

// EVALSHA
String sha1 = script.scriptLoad(scriptWithArgs);
List<Object> shaResult = script.evalSha(RScript.Mode.READ_ONLY, sha1, 
    RScript.ReturnType.MULTI, Arrays.asList("key"), "value");
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

<a id="auth"></a>
<details>
<summary><b style="font-size:18px;">AUTH</b></summary>

The `AUTH` command authenticates a client connection to the Valkey server.
- In **Redisson**, authentication is handled in the configuration during client creation.
- In **Glide**, authentication can be updated using `updateConnectionPassword()`.

**Redisson**
```java
// Authentication is handled during configuration
Config config = new Config();
config.useSingleServer()
    .setAddress("redis://localhost:6379")
    .setPassword("mypass");
RedissonClient redisson = Redisson.create(config);
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

Both Redisson and Glide provide ways to execute custom commands.
- In **Redisson**, you can execute raw commands using the low-level command executor.
- In **Glide**, you can execute raw commands using `customCommand()`.

**Redisson**
```java
// Redisson doesn't have a direct way to execute arbitrary commands
// You would typically use the appropriate high-level API methods
// For truly custom commands, you'd need to access the underlying connection
```

**Glide**
```java
// Execute a raw command
String rawResult = client.customCommand(new String[]{"SET", "key", "value"}).get();
System.out.println(rawResult); // OK
```
</details>

## Command Comparison Chart

Below is a comprehensive chart comparing common Redis commands between Redisson and Valkey Glide:

| Command | Redisson | Valkey Glide |
|---------|---------|--------------|
| **Connection** |
| Connect | `Redisson.create(config)` | `GlideClient.createClient(config).get()` |
| Cluster | `config.useClusterServers()` | `GlideClusterClient.createClient(config).get()` |
| Auth | `config.setPassword("pass")` | `client.updateConnectionPassword("pass", true).get()` |
| Select DB | `config.setDatabase(1)` | `client.select(1).get()` |
| **Strings** |
| SET | `redisson.getBucket("key").set("val")` | `client.set("key", "val")` |
| GET | `redisson.getBucket("key").get()` | `client.get("key").get()` |
| SETEX | `bucket.set("val", Duration.ofSeconds(10))` | `client.set("key", "val", 10)` |
| SETNX | `bucket.trySet("val")` | `client.set("key", "val", SetOptions.builder().conditionalSet(ConditionalChange.ONLY_IF_DOES_NOT_EXIST).build()).get()` |
| MSET | `redisson.getBuckets().set(map)` | `client.mset(map)` |
| MGET | `redisson.getBuckets().get("k1", "k2")` | `client.mget(new String[]{"k1", "k2"}).get()` |
| INCR | `redisson.getAtomicLong("key").incrementAndGet()` | `client.incr("counter").get()` |
| DECR | `redisson.getAtomicLong("key").decrementAndGet()` | `client.decr("counter").get()` |
| INCRBY | `redisson.getAtomicLong("key").addAndGet(5)` | `client.incrBy("counter", 5).get()` |
| DECRBY | `redisson.getAtomicLong("key").addAndGet(-5)` | `client.decrBy("counter", 5).get()` |
| APPEND | Manual get/concatenate/set | `client.append("key", "val").get()` |
| GETRANGE | Manual substring operation | `client.getRange("key", 0, 3).get()` |
| SETRANGE | Manual string manipulation | `client.setRange("key", 0, "val").get()` |
| **Keys** |
| DEL | `redisson.getKeys().delete("k1", "k2")` | `client.del(new String[]{"k1", "k2"}).get()` |
| EXISTS | `redisson.getKeys().countExists("k1", "k2")` | `client.exists(new String[]{"k1", "k2"}).get()` |
| EXPIRE | `bucket.expire(Duration.ofSeconds(10))` | `client.expire("key", 10).get()` |
| TTL | `bucket.remainTimeToLive()` | `client.ttl("key").get()` |
| KEYS | `redisson.getKeys().getKeysByPattern("*")` | `client.keys("pattern").get()` |
| SCAN | `redisson.getKeys().getKeysStream()` | `client.scan(cursor).get()` |
| RENAME | `bucket.rename("newkey")` | `client.rename("old", "new").get()` |
| RENAMENX | `bucket.renamenx("newkey")` | `client.renameNx("old", "new").get()` |
| **Hashes** |
| HSET | `redisson.getMap("hash").putAll(map)` | `client.hset("hash", map).get()` |
| HGET | `redisson.getMap("hash").get("field")` | `client.hget("hash", "field").get()` |
| HMSET | `redisson.getMap("hash").putAll(map)` | `client.hset("hash", map).get()` |
| HMGET | `redisson.getMap("hash").getAll(fields)` | `client.hmget("hash", new String[]{"f1", "f2"}).get()` |
| HGETALL | `redisson.getMap("hash").readAllMap()` | `client.hgetall("hash").get()` |
| HDEL | `redisson.getMap("hash").remove("field")` | `client.hdel("hash", new String[]{"f1", "f2"}).get()` |
| HEXISTS | `redisson.getMap("hash").containsKey("field")` | `client.hexists("hash", "field").get()` |
| **Lists** |
| LPUSH | `redisson.getList("list").addFirst("val")` | `client.lpush("list", new String[]{"a", "b"}).get()` |
| RPUSH | `redisson.getList("list").add("val")` | `client.rpush("list", new String[]{"a", "b"}).get()` |
| LPOP | `redisson.getList("list").removeFirst()` | `client.lpop("list").get()` |
| RPOP | `redisson.getList("list").removeLast()` | `client.rpop("list").get()` |
| LRANGE | `redisson.getList("list").range(0, -1)` | `client.lrange("list", 0, -1).get()` |
| **Sets** |
| SADD | `redisson.getSet("set").add("val")` | `client.sadd("set", new String[]{"a", "b"}).get()` |
| SMEMBERS | `redisson.getSet("set").readAll()` | `client.smembers("set").get()` |
| SREM | `redisson.getSet("set").remove("val")` | `client.srem("set", new String[]{"a", "b"}).get()` |
| SISMEMBER | `redisson.getSet("set").contains("val")` | `client.sismember("set", "a").get()` |
| **Sorted Sets** |
| ZADD | `redisson.getScoredSortedSet("zset").add(1.0, "a")` | `client.zadd("zset", scoreMembers).get()` |
| ZRANGE | `redisson.getScoredSortedSet("zset").valueRange(0, -1)` | `client.zrange("zset", 0, -1).get()` |
| ZRANGE with scores | `redisson.getScoredSortedSet("zset").entryRange(0, -1)` | `client.zrange("zset", 0, -1, "WITHSCORES").get()` |
| ZREM | `redisson.getScoredSortedSet("zset").remove("a")` | `client.zrem("zset", new String[]{"a", "b"}).get()` |
| ZSCORE | `redisson.getScoredSortedSet("zset").getScore("a")` | `client.zscore("zset", "a").get()` |
| ZRANK | `redisson.getScoredSortedSet("zset").rank("a")` | `client.zrank("zset", "a").get()` |
| ZREVRANK | `redisson.getScoredSortedSet("zset").revRank("a")` | `client.zrevrank("zset", "a").get()` |
| **Transactions** |
| MULTI/EXEC | `redisson.createBatch().execute()` | `client.exec(new Transaction().set("k", "v")).get()` |
| **Lua Scripts** |
| EVAL | `redisson.getScript().eval(script, keys, args)` | `client.invokeScript(new Script(script), options).get()` |
| EVALSHA | `redisson.getScript().evalSha(sha, keys, args)` | `client.invokeScript(new Script(script), options).get()` |
| **Custom Commands** |
| Raw Command | Not directly supported | `client.customCommand(new String[]{"SET", "key", "value"}).get()` |

## Key Differences Summary

### Architecture
- **Redisson** provides an object-oriented abstraction layer with distributed Java objects (RBucket, RMap, RList, etc.)
- **Glide** provides a more direct, command-oriented interface similar to Redis CLI

### Asynchronous Operations
- **Redisson** supports both synchronous and asynchronous operations with separate async methods
- **Glide** is primarily asynchronous, returning `CompletableFuture<T>` for most operations

### Data Structures
- **Redisson** offers rich distributed data structures and services (locks, semaphores, queues, etc.)
- **Glide** focuses on core Redis commands with high performance

### Configuration
- **Redisson** uses a comprehensive `Config` object with many configuration options
- **Glide** uses builder pattern with focused configuration objects

### Error Handling
- **Redisson** uses Java exceptions for error handling
- **Glide** uses CompletableFuture exception handling patterns

This migration guide should help you transition from Redisson to Valkey Glide while maintaining the same functionality in your applications.
