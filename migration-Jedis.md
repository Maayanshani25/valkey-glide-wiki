# **Migration Guide: Jedis → Glide**  

This guide provides a **side-by-side comparison** of how to migrate common Valkey commands from **Jedis to Glide**.

---

## **Dependencies**  

To use **Glide**, add the following dependency to your `pom.xml` file:  

```xml
<dependency>
    <groupId>io.valkey</groupId>
    <artifactId>valkey-glide</artifactId>
    <version>1.3.1</version>
</dependency>
```

---

## **Constructor**  

- In **Jedis**, multiple constructors allow for various connection configurations.  
- In **Glide**, connections are established through a **single configuration object**, which comes **pre-configured with best practices**.

Glide **requires minimal configuration changes**, typically for:  
- **Timeout settings**  
- **TLS**  
- **Read from replica**  
- **User authentication (username & password)**  
- **Connection timeout**  

For advanced configurations, refer to the **[Glide Wiki](https://github.com/valkey-io/valkey-glide/wiki)**.

**No Connection Pool Needed:** Glide’s **async API** efficiently handles multiple requests with a **single connection**.

---

### Standalone Mode

### **Jedis**  
```java
import redis.clients.jedis.Jedis;

Jedis jedis = new Jedis("localhost", 6379);
```

### **Glide**  
```java
import glide.api.models.configuration.GlideClientConfiguration;
import glide.api.GlideClient;

GlideClientConfiguration config = GlideClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("localhost")
        .port(6379)
        .build())
    .build();

GlideClient glideClient = GlideClient.createClient(config).get();

```

---
### Cluster Mode

### **Jedis**  
```java
import redis.clients.jedis.DefaultJedisClientConfig;
import redis.clients.jedis.JedisCluster;

JedisCluster jedisCluster = new JedisCluster(
    Set.of(new HostAndPort(HOST, PORT)),
    DefaultJedisClientConfig.builder()
        .ssl(USE_SSL)
        .build()
);

```

### **Glide**  
```java


```

---

## **Jedis vs. Glide Constructor Parameters**  

**NEED TO BE DONE**

The table below compares **Jedis constructors** with **Glide configuration parameters**:

| **Jedis Constructor** | **Equivalent Glide Configuration** |
|----------------------|--------------------------------|
| `HostAndPort(String host, int port)` | `.address(NodeAddress.builder().host(cluster.getConfigurationEndpoint()).port(PORT).build())` |
| `int timeout` | N/A |
| `int maxAttempts` | N/A |
| `GenericObjectPoolConfig<Connection> poolConfig` | N/A |
| `String password` | N/A |
| `String user` | N/A |
| `String clientName` | N/A |
| `boolean ssl` | `.useTLS(useTLS)` |
| `Set<HostAndPort> clusterNodes` | N/A |
| `Cache clientSideCache` | N/A |
| `CacheConfig cacheConfig` | N/A |
| `Duration topologyRefreshPeriod` | N/A |
| `Duration maxTotalRetriesDuration` | N/A |
| `JedisClientConfig clientConfig` | N/A |
| `HostAndPortMapper hostAndPortMap` | N/A |

---

## **Commands in Jedis → Glide**  

Below is a list of the **most commonly used Valkey commands** in Glide clients and how they compare to Jedis.  

**NOTE**: **Glide** uses asynchronous execution, so most commands return a `CompletableFuture<T>`. Use `.get()` to retrieve the result.

### **Valkey Commands Sorted Alphabetically**  

| |  |  |
|----------|----------|----------|
| [AUTH](#6-authentication-auth) | [EXPIRE](#7-expire) | [MGET](#15-mget) |
| [BGSAVE](#16-bgsave) | [GET](#1-set--get) | [MULTI](#5-multi--exec-transactions) |
| [DECR](#4-increment-incr--decrement-decr) | [HSET](#17-hset) | [RPUSH](#12-lpush--rpush) |
| [DEL](#2-delete-del) | [INCR](#4-increment-incr--decrement-decr) | [SCAN](#14-scan) |
| [EVAL](#10-eval) | [INCRBY](#13-incrby) | [SELECT](#9-select-change-database) |
| [EVALSHA](#11-evalsha) | [INFO](#8-info) | [SET](#1-set--get) |
| [EXISTS](#3-exists) | [LPUSH](#12-lpush--rpush) | [SETEX](#18-setex) |

---

## **1. Set & Get**  

- Both Jedis and Glide support this in the same way.

### **Jedis**
```java
// Set a key-value pair
jedis.set("key", "value");

// Retrieve the value
String value = jedis.get("key");  // value = "value"
```

### **Glide**
```java
// Set a key-value pair
glideClient.set("key", "value");

// Retrieve the value
String value = glideClient.get("key").get();  // value = "value"
```

**Note:** The `.get()` is required in **Glide** because `get()` returns a **`CompletableFuture<String>`**.

---

## 2. Delete (DEL)

The `DEL` command removes one or more keys from Valkey.

- In **Jedis**, `del()` takes a **single key** or **multiple keys**.
- In **Glide**, `del()` **requires an array (`String[]`)**, even for a single key.

### Jedis
```java
jedis.set("key", "value");

// Delete the key
jedis.del("key");

// Retrieve the value
String value = jedis.get("key");
```

### Glide
```java
glideClient.set("key", "value");

// Delete a list of keys
glideClient.del(new String[] { "key" });

// Retrieve the value (should be "null")
String value = glideClient.get("key").get();
```

---

## 3. Exists

The `EXISTS` command checks if a key exists in Valkey.

- In Jedis, exists(String key) returns true if the key exists. If given multiple keys (String... keys), it returns the number of existing keys.
- In **Glide**, `exists()` takes a **list of keys (`String[]`)** and returns a **Long** indicating how many of the provided keys exist.

### Jedis
```java
boolean res1 = jedis.exists("new_key");
System.out.println("Key exists: " + res1); // false

// Set a key-value pair
jedis.set("new_key", "value");

boolean res2 = jedis.exists("new_key");
System.out.println("Key exists: " + res2); // true
```

### Glide
```java
// Check if the key exists and return the number of keys that exist
Long res = glideClient.exists(new String[] { "new_key" }).get();
System.out.println("Number of keys existing: " + res); // 0

// Set a key-value pair
glideClient.set("new_key", "value");

// Check again
Long res2 = glideClient.exists(new String[] { "new_key" }).get();
System.out.println("Number of keys existing: " + res2); // 1
```

---

## **4. Increment (INCR) / Decrement (DECR)**  

The `INCR` command **increments** the value of a key by **1**, while `DECR` **decrements** it by **1**.  
- Both **Jedis** and **Glide** support these commands with the same syntax and behavior.  
- The key must contain an **integer value**, otherwise, Valkey will return an error.  

### **Jedis**
```java
jedis.set("key", "1");
jedis.incr("key"); // key = 2
jedis.decr("key"); // key = 1
```

### **Glide**
```java
glideClient.set("key", "1");
glideClient.incr("key"); // key = 2
glideClient.decr("key"); // key = 1
```

---

## 5. Multi & Exec (Transactions)

The `MULTI` command starts a Valkey transaction.  
The `EXEC` command executes all queued commands in the transaction.

- In **Jedis**, transactions are started using `jedis.multi()`.
- In **Glide**, transactions are represented as a `Transaction` object.

### Jedis
```java
// Start a transaction
Transaction transaction = jedis.multi();

// Add commands to the transaction
transaction.set("key", "value");
transaction.incr("counter");
transaction.get("key");

// Execute the transaction
List<Object> result = transaction.exec();
System.out.println(result); // Output: [OK, 1, value]
```

### Glide
```java
// Initialize a transaction object
Transaction transaction = new Transaction();

// Add commands to the transaction
transaction.set("key", "value");
transaction.incr("counter");
transaction.get("key");

// Execute the transaction
Object[] result = glideClient.exec(transaction).get();
System.out.println(Arrays.toString(result)); // Output: [OK, 1, value]
```

---

## 6. Authentication (AUTH)

The `AUTH` command is used to authenticate a Valkey connection with a password.

- In **Jedis**, authentication is done via `auth()`.
- In **Glide**, authentication is handled using `updateConnectionPassword()`.

### Jedis
```java
// Returns OK if the password is correct, otherwise returns an error
String res = jedis.auth("111");
```

### Glide
```java
// Returns OK if the password is correct, otherwise returns an error
glideClient.updateConnectionPassword("newPassword", true);
```

**Note:** Setting `immediateAuth = false` allows the client to use the new password for future connections without re-authentication.

---

## 7. Expire

The `EXPIRE` command sets a time-to-live (TTL) for a key.

- **Both** Jedis and Glide support this **in the same way**.

### Jedis
```java
jedis.expire("key", 2);
```

### Glide
```java
glideClient.expire("key", 2);
```

---

## 8. Info

The `INFO` command retrieves detailed information about the Valkey server, including memory usage, connected clients, and database statistics.

- **Both** Jedis and Glide support this command **in the same way**.

### Jedis
```java
String info = jedis.info();
```

### Glide
```java
String info = glideClient.info().get();
```

---

## 9. Select (Change Database)

The `SELECT` command switches between Valkey databases.

- **Both** Jedis and Glide support this **in the same way**.

### Jedis
```java
String res = jedis.select(1); // Output: OK
```

### Glide
```java
String res = glideClient.select(1).get(); // Output: OK
```

---

## 10. Eval

The `EVAL` command executes Lua scripts in Valkey.

- In **Jedis**, Lua scripts are executed using `eval()`.
- In **Glide**, Lua scripts are executed via `invokeScript()` using a `Script` object.  
The `Script` class wraps the Lua script, and the second parameter (`boolean binaryOutput`) controls the output format:  
`false` returns a **String**, while `true` returns **binary data**.

### Jedis
```java
String script = "return 'Hello, Lua!'";
Object result = jedis.eval(script);
System.out.println(result); // Output: Hello, Lua!
```

### Glide
```java
Script luaScript = new Script("return 'Hello, Lua!'", false);
String result = (String) glideClient.invokeScript(luaScript).get();
System.out.println(result); // Output: Hello, Lua!
```

---

## 11. Evalsha

The `EVALSHA` command is similar to `EVAL`, but instead of passing the Lua script directly, it uses a **SHA1 hash** of a pre-loaded script.

- In **Jedis**, the script must be preloaded using `scriptLoad()`.
- In **Glide**, `invokeScript()` is used with `ScriptOptions`.

### Jedis
```java
String script = "return redis.call('set', KEYS[1], ARGV[1]);";
String sha1 = jedis.scriptLoad(script);
Object result = jedis.evalsha(sha1, Arrays.asList("myKey"), Arrays.asList("10"));
System.out.println(result); // Output: OK
```

### Glide
```java
String script = "return server.call('set', KEYS[1], ARGV[1]);";
Script luaScript = new Script(script, false);
ScriptOptions scriptOptions = ScriptOptions.builder().key("myKey").arg("10").build();
String result = (String) glideClient.invokeScript(luaScript, scriptOptions).get();
System.out.println(result); // Output: OK
```

---

## 12. Lpush / Rpush

The `LPUSH` and `RPUSH` commands add elements to a Valkey list.  
- **LPUSH** inserts at the **beginning**.  
- **RPUSH** inserts at the **end**.  
- This command works **the same way** in both **Jedis and Glide**.  

### **Jedis**
```java
String[] strings = {"key1", "key2", "key3"};

long length_of_list = jedis.lpush("list", strings); // length_of_list = 3
```

### **Glide**
```java
String[] elements = {"key1", "key2", "key3"};

long length_of_list = glideClient.lpush("list", elements).get(); // length_of_list = 3
```

---

## 13. IncrBy

The `INCRBY` command increases the **value of a key** by a specified amount.  
- Works **the same way** in **both** Jedis and Glide.  

### **Jedis**
```java
long counter = jedis.incrBy("counter", 3); // counter: 3
```

### **Glide**
```java
long res = glideClient.incrBy("counter", 3).get(); // counter: 3
```

---

## 14. Scan  

The `SCAN` command iterates through **keys in the Valkey database** without blocking the server.  
- Both **Jedis** and **Glide** support scanning with or without `ScanParams`.  
- **Glide** supports **cluster mode scanning** to scan the entire cluster. [For more](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#cluster-scan).

### **Jedis**
```java
String cursor = ScanParams.SCAN_POINTER_START;
ScanResult<String> scanResult;

do {
    scanResult = jedis.scan(cursor);
    cursor = scanResult.getCursor();

    List<String> keys = scanResult.getResult();
    String keyList = String.join(", ", keys);

    System.out.println("\nSCAN iteration: " + keyList);
} while (!cursor.equals(ScanParams.SCAN_POINTER_START));
```

### **Glide**
```java
String cursor = "0";
Object[] result;

do {
    result = glideClient.scan(cursor).get();
    cursor = result[0].toString();

    Object[] stringResults = (Object[]) result[1];
    String keyList = Arrays.stream(stringResults)
        .map(obj -> (String) obj)
        .collect(Collectors.joining(", "));

    System.out.println("\nSCAN iteration: " + keyList);
} while (!cursor.equals("0"));
```

---

## 15. **Mget**  

The `MGET` command retrieves the values of multiple keys from Valkey.  

- In **Jedis**, `mget()` returns a **`List<String>`**.  
- In **Glide**, `mget()` returns a **`String[]`**.  

### **Jedis**  
```java
String[] keys = new String[] { "key1", "key2", "key3" };
List<String> values = jedis.mget(keys);
```

### **Glide**  
```java
String[] keys = new String[] {"key1", "key2", "key3"};
String[] values = glideClient.mget(keys).get();
```

---

## 16. **Bgsave**  

The `BGSAVE` command asynchronously saves the dataset to disk without blocking operations.  

- **Jedis:** Supports `bgsave()`.  
- **Glide:** Not available. Let us know if you’d like this feature added.  

### **Jedis**  
```java
jedis.bgsave();
```

### **Glide**  
Currently unavailable in Glide.

---

## 17. **Hset**  

The `HSET` command sets multiple field-value pairs in a hash.  

- Both **Jedis** and **Glide** support this in the same way.  

### **Jedis**  
```java
Map<String, String> map = new HashMap<>();
map.put("key1", "value1");
map.put("key2", "value2");

long result = jedis.hset("my_hash", map);
System.out.println(result); // Output: 2 - Indicates that 2 fields were successfully set in the hash "my_hash"
```

### **Glide**  
```java
Map<String, String> map = new HashMap<>();
map.put("key1", "value1");
map.put("key2", "value2");

long result = glideClient.hset("my_hash", map).get();
System.out.println(result); // Output: 2 - Indicates that 2 fields were successfully set in the hash "my_hash"
```

---

## 18. **Setex**  

The `SETEX` command sets a key with an expiration time.  

- In **Jedis**, `setex()` is a dedicated function.  
- In **Glide**, expiration is handled using `SetOptions` within the `set()` command.  

### **Jedis**  
```java
jedis.setex("key", 1, "value");
```

### **Glide**  
```java
SetOptions options = SetOptions.builder().expiry(Expiry.Seconds(1L)).build();

glideClient.set("key", "value", options);
```

