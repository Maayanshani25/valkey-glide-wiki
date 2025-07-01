# **Migration Guide: Jedis → Glide**  

This guide provides a **side-by-side comparison** of how to migrate common Valkey commands from **Jedis to Glide**.

---

## Dependencies  

To use Valkey Glide, you must include a classifier to specify your platform architecture.  
This section includes setup instructions for Gradle, Maven, and SBT, with or without OS detection tools.

<a id="dependencies"></a>
<details>
<summary><b style="font-size:22px;">Dependency Instructions</b></summary>

```
osx-aarch_64
linux-aarch_64
linux-x86_64
```

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

---
## **Constructor**  

- In **Jedis**, multiple constructors allow for various connection configurations.  
- In **Glide**, connections are established through a **single configuration object**, which comes **pre-configured with best practices**.

Glide **requires minimal configuration changes**, typically for:  
- **Timeout settings**  
- **TLS**  
- **Read from replica**  
- **User authentication (username & password)**  

For advanced configurations, refer to the **[Glide Wiki - Java](https://github.com/valkey-io/valkey-glide/wiki/Java-Wrapper)**.

**No Connection Pool Needed:** Glide’s **async API** efficiently handles multiple requests with a **single connection**.

<a id="standalone"></a>
<details>
<summary><b style="font-size:22px;">Standalone Mode</b></summary>

**Jedis**  
```java
import redis.clients.jedis.Jedis;

Jedis jedis = new Jedis("localhost", 6379);
```

**Glide**  
```java
import glide.api.GlideClient;
import glide.api.models.configuration.GlideClientConfiguration;

GlideClientConfiguration config = GlideClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("localhost")
        .port(6379)
        .build())
    .build();

GlideClient glideClient = GlideClient.createClient(config).get();
```

---

</details>

<a id="cluster"></a>
<details>
<summary><b style="font-size:22px;">Cluster Mode</b></summary>

**Jedis**  
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

**Glide**  
```java
import glide.api.GlideClusterClient;
import glide.api.models.configuration.GlideClusterClientConfiguration;
import glide.api.models.configuration.NodeAddress;

GlideClusterClientConfiguration config =
    GlideClusterClientConfiguration.builder()
        .address(NodeAddress.builder()
            .host(HOST)
            .port(PORT)
            .build())
        .useTLS(USE_SSL)
        .build();

GlideClusterClient glideClusterClient = GlideClusterClient.createClient(clusterConfig).get();
```

---

</details>

<a id="parameters"></a>
<details>
<summary><b style="font-size:22px;">Jedis vs. Glide Constructor Parameters</b></summary>

The table below compares **Jedis constructors** with **Glide configuration parameters**:

| **Jedis Constructor** | **Equivalent Glide Configuration** |
|----------------------|--------------------------------|
| `HostAndPort(String host, int port)` | `.address(NodeAddress.builder().host(String host).port(Integer port).build())` |
| `int socketTimeout` | `.requestTimeout(Integer requestTimeout)` |
| `String password, String user` | `.credentials(ServerCredentials.builder().username(String user).password(String pwd).build())`|
| `String clientName` | `.clientName(String clientName)`|
| `boolean ssl` | `.useTLS(useTLS)` |
| `Set<HostAndPort> clusterNodes` | N/A |
| `Cache clientSideCache` | N/A |
| `CacheConfig cacheConfig` | N/A |
| `Duration topologyRefreshPeriod` | N/A |
| `Duration maxTotalRetriesDuration` | N/A |
| `JedisClientConfig clientConfig` | N/A |
| `HostAndPortMapper hostAndPortMap` | N/A |
| `int maxAttempts` | N/A |
| `GenericObjectPoolConfig<Connection> poolConfig` | N/A |

**Advanced configuration**

- **Standalone Mode** `.advancedConfiguration(AdvancedGlideClientConfiguration.builder()`
- **Cluster Mode** `.advancedConfiguration(AdvancedGlideClusterClientConfiguration.builder()`

| **Jedis Constructor** | **Equivalent Glide Configuration** |
|----------------------|--------------------------------|
| `int connectionTimeout` | `.connectionTimeout(Integer connectionTimeout)`|

</details>

---

## **Commands in Jedis → Glide**  

Below is a list of the **most commonly used Valkey commands** in Glide clients and how they compare to Jedis.  

**NOTE**: **Glide** uses asynchronous execution, so most commands return a `CompletableFuture<T>`. Use `.get()` to retrieve the result.

<a id="commands-table"></a>

### **Valkey Commands Sorted Alphabetically**  

| |  |  |
|----------|----------|----------|
| [AUTH](#auth) | [EXPIRE](#expire) | [MGET](#mget) |
| [DECR](#incr-decr) | [GET](#set-get) | [MULTI](#transaction) |
| [INCRBY](#incrby-decrby) | [HSET](#hset) | [RPUSH](#lpush-rpush) |
| [DEL](#del)  |[INCR](#incr-decr) | [SCAN](#scan) |
| [EVAL](#eval) | [INCRBY](#incrby-decrby) | [SELECT](#select) |
| [EVALSHA](#evalsha)  | [INFO](#info) | [SET](#set-get) |
| [EXISTS](#exists)  | [LPUSH](#lpush-rpush) | [SETEX](#setex) |

---
<a id="set-get"></a>
<details>
<summary><b style="font-size:18px;">SET & GET</b></summary>

- Both Jedis and Glide support this in the same way.

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
glideClient.set("key", "value").get();

// Retrieve the value
String value = glideClient.get("key").get();  // value = "value"
```

**Note:** The `.get()` is required in **Glide** because `get()` returns a **`CompletableFuture<String>`**.

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="del"></a>
<details>
<summary><b style="font-size:18px;">Delete (DEL)</b></summary>

The `DEL` command removes one or more keys from Valkey.

- In **Jedis**, `del()` takes a **single key** or **multiple keys**.
- In **Glide**, `del()` **requires an array (`String[]`)**.

**Jedis**
```java
String[] keys = { "key1", "key2" };

jedis.del(keys);

String value1 = jedis.get("key1"); // null
String value2 = jedis.get("key2"); // null
```

**Glide**
```java
String[] keys = { "key1", "key2" };

glideClient.del(keys).get();

String value1 = glideClient.get("key1").get(); // null
String value2 = glideClient.get("key2").get(); // null
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="exists"></a>
<details>
<summary><b style="font-size:18px;">EXISTS</b></summary>

The `EXISTS` command checks if a key exists in Valkey.

- In Jedis, exists(String key) returns true if the key exists. If given multiple keys (String... keys), it returns the number of existing keys.
- In **Glide**, `exists()` takes a **list of keys (`String[]`)** and returns a **Long** indicating how many of the provided keys exist.

**Single key**

**Jedis**
```java
boolean res1 = jedis.exists("new_key"); // false

// Set a key-value pair
jedis.set("new_key", "value");

boolean res2 = jedis.exists("new_key"); // true
```

**Glide**
```java
// Check if the key exists and return the number of keys that exist
Long res = glideClient.exists(new String[] { "new_key" }).get(); // 0

// Set a key-value pair
glideClient.set("new_key", "value").get();

// Check again
Long res2 = glideClient.exists(new String[] { "new_key" }).get(); // 1
```
---

**Multiple keys**

**Jedis**
```java
String[] keys = { "new_key1", "new_key2" };

long res1 = jedis.exists(keys); // 0

// Set the new keys
jedis.set("new_key1", "value1");
jedis.set("new_key2", "value2");

long res2 = jedis.exists(keys);  // 2
```

**Glide**
```java
String[] keys = { "new_key1", "new_key2" };

long res1 = glideClient.exists(keys).get(); // 0

// Set the new keys
glideClient.set("new_key1", "value1").get();
glideClient.set("new_key2", "value2").get();

long res2 = glideClient.exists(keys).get();  // 2
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="incr-decr"></a>
<details>
<summary><b style="font-size:18px;">Increment (INCR) / Decrement (DECR)</b></summary>

The `INCR` command **increments** the value of a key by **1**, while `DECR` **decrements** it by **1**.  
- Both **Jedis** and **Glide** support these commands with the same syntax and behavior.  
- The key must contain an **integer value**, otherwise, Valkey will return an error.  

**Jedis**
```java
jedis.set("key", "1");
jedis.incr("key"); // key = 2
jedis.decr("key"); // key = 1
```

**Glide**
```java
glideClient.set("key", "1").get();
glideClient.incr("key").get(); // key = 2
glideClient.decr("key").get(); // key = 1
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="incrby-decrby"></a>
<details>
<summary><b style="font-size:18px;">INCRBY / DECRBY</b></summary>

The `INCRBY` command increases the **value of a key** by a specified amount.  
- Works **the same way** in **both** Jedis and Glide.  

**Jedis**
```java
jedis.set("counter", "0");
long counter = jedis.incrBy("counter", 3); // counter: 3
counter = jedis.decrBy("counter", 2); // counter: 1
```

**Glide**
```java
glideClient.set("counter", "0").get();
long counter = glideClient.incrBy("counter", 3).get(); // counter: 3
counter = glideClient.decrBy("counter", 2).get(); // counter: 1
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="mget"></a>
<details>
<summary><b style="font-size:18px;">MGET</b></summary>

The `MGET` command retrieves the values of multiple keys from Valkey.  

- In **Jedis**, `mget()` returns a **`List<String>`**.  
- In **Glide**, `mget()` returns a **`String[]`**.  

**Jedis**  
```java
String[] keys = new String[] { "key1", "key2", "key3" };
List<String> values = jedis.mget(keys);
```

**Glide**  
```java
String[] keys = new String[] {"key1", "key2", "key3"};
String[] values = glideClient.mget(keys).get();
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="hset"></a>
<details>
<summary><b style="font-size:18px;">HSET</b></summary>

The `HSET` command sets multiple field-value pairs in a hash.  

- Both **Jedis** and **Glide** support this in the same way.  

**Jedis**  
```java
Map<String, String> map = new HashMap<>();
map.put("key1", "value1");
map.put("key2", "value2");

long result = jedis.hset("my_hash", map);
System.out.println(result); // Output: 2 - Indicates that 2 fields were successfully set in the hash "my_hash"
```

**Glide**  
```java
Map<String, String> map = new HashMap<>();
map.put("key1", "value1");
map.put("key2", "value2");

long result = glideClient.hset("my_hash", map).get();
System.out.println(result); // Output: 2 - Indicates that 2 fields were successfully set in the hash "my_hash"
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="setex"></a>
<details>
<summary><b style="font-size:18px;">SETEX</b></summary>

The `SETEX` command sets a key with an expiration time.  

- In **Jedis**, `setex()` is a dedicated function.  
- In **Glide**, expiration is handled using `SetOptions` within the `set()` command.  

**Jedis**  
```java
jedis.setex("key", 1, "value");
```

**Glide**  
```java
SetOptions options = SetOptions.builder().expiry(Expiry.Seconds(1L)).build();

glideClient.set("key", "value", options);
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="lpush-rpush"></a>
<details>
<summary><b style="font-size:18px;">LPUSH / RPUSH</b></summary>

The `LPUSH` and `RPUSH` commands add elements to a Valkey list.  
- **LPUSH** inserts at the **beginning**.  
- **RPUSH** inserts at the **end**.  
- This command works **the same way** in both **Jedis and Glide**.  

**Jedis**
```java
String[] strings = {"key1", "key2", "key3"};

long length_of_list = jedis.lpush("list", strings); // length_of_list = 3
```

**Glide**
```java
String[] elements = {"key1", "key2", "key3"};

long length_of_list = glideClient.lpush("list", elements).get(); // length_of_list = 3
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="expire"></a>
<details>
<summary><b style="font-size:18px;">EXPIRE</b></summary>

The `EXPIRE` command sets a time-to-live (TTL) for a key.

- **Both** Jedis and Glide support this **in the same way**.

**Jedis**
```java
jedis.expire("key", 2);
```

**Glide**
```java
glideClient.expire("key", 2).get();
```
<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="transaction"></a>
<details>
<summary><b style="font-size:18px;">Transactions (MULTI & EXEC)</b></summary>

The `MULTI` command starts a Valkey transaction.  
The `EXEC` command executes all queued commands in the transaction.

- In **Jedis**, transactions are started using `jedis.multi()`.
- In **Glide**, transactions are represented as a `Transaction` object.

**Standalone Mode**

**Jedis**
```java
// Start a transaction
Transaction transaction = jedis.multi();

// Add commands to the transaction
transaction.set("key", "1");
transaction.incr("key");
transaction.get("key");

// Execute the transaction
List<Object> result = transaction.exec();
System.out.println(result); // Output: [OK, 2, 2]
```

**Glide**
```java
import glide.api.models.Transaction;

// Initialize a transaction object
Transaction transaction = new Transaction();

// Add commands to the transaction
transaction.set("key", "1");
transaction.incr("key");
transaction.get("key");

// Execute the transaction
Object[] result = glideClient.exec(transaction).get();
System.out.println(Arrays.toString(result)); // Output: [OK, 2, 2]
```

---

**Cluster Mode**

**Jedis**

```java
import redis.clients.jedis.AbstractTransaction;

// Initialize a cluster transaction object
AbstractTransaction transaction = jedisCluster.multi();

// Add commands to the transaction
transaction.set("key", "value");
transaction.get("key");

// Execute the transaction
List<Object> result = transaction.exec();
System.out.println(result); // Output: [OK, "value"]
```

**Glide**

```java
import glide.api.models.ClusterTransaction;

// Initialize a cluster transaction object
ClusterTransaction transaction = new ClusterTransaction();

// Chain commands
transaction.set("key", "value").get("key");

// Execute the transaction
Object[] result = client.exec(transaction).get();
System.out.println(Arrays.toString(result)); // Output: [OK, "value"]
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="eval"></a>
<details>
<summary><b style="font-size:18px;">EVAL</b></summary>

The `EVAL` command executes Lua scripts in Valkey.

- In **Jedis**, Lua scripts are executed using `eval()`.
- In **Glide**, Lua scripts are executed via `invokeScript()` using a `Script` object.  
The `Script` class wraps the Lua script, and the second parameter (`boolean binaryOutput`) controls the output format:  
`false` returns a **String**, while `true` returns **binary data**.

**Jedis**
```java
String script = "return 'Hello, Lua!'";
Object result = jedis.eval(script);
System.out.println(result); // Output: Hello, Lua!
```

**Glide**
```java
Script luaScript = new Script("return 'Hello, Lua!'", false);
String result = (String) glideClient.invokeScript(luaScript).get();
System.out.println(result); // Output: Hello, Lua!
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="evalsha"></a>
<details>
<summary><b style="font-size:18px;">EVALSHA</b></summary>

The `EVALSHA` command is similar to `EVAL`, but instead of passing the Lua script directly, it uses a **SHA1 hash** of a pre-loaded script.

- In **Jedis**, the script must be preloaded using `scriptLoad()`.
- In **Glide**, `invokeScript()` is used with `ScriptOptions`.

**Jedis**
```java
String script = "return redis.call('set', KEYS[1], ARGV[1]);";
String sha1 = jedis.scriptLoad(script);
Object result = jedis.evalsha(sha1, Arrays.asList("myKey"), Arrays.asList("10"));
System.out.println(result); // Output: OK
```

**Glide**
```java
String script = "return server.call('set', KEYS[1], ARGV[1]);";
Script luaScript = new Script(script, false);
ScriptOptions scriptOptions = ScriptOptions.builder().key("myKey").arg("10").build();
String result = (String) glideClient.invokeScript(luaScript, scriptOptions).get();
System.out.println(result); // Output: OK
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="scan"></a>
<details>
<summary><b style="font-size:18px;">SCAN</b></summary>

The `SCAN` command iterates through **keys in the Valkey database** without blocking the server.  
- Both **Jedis** and **Glide** support scanning with or without `ScanParams`.  
- **Glide** supports **cluster mode scanning** to scan the entire cluster. [For more](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#cluster-scan).

**Jedis**
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

**Glide**
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

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="auth"></a>
<details>
<summary><b style="font-size:18px;">Authentication (AUTH)</b></summary>

The `AUTH` command is used to authenticate a Valkey connection with a password.

- In **Jedis**, authentication is done via `auth()`.
- In **Glide**, authentication is handled using `updateConnectionPassword()`.

**Jedis**
```java
// Returns OK if the password is correct, otherwise returns an error
String res = jedis.auth("111");
```

**Glide**
```java
// Returns OK if the password is correct, otherwise returns an error
glideClient.updateConnectionPassword("newPassword", true).get();
```

**Note:** Setting `immediateAuth = false` allows the client to use the new password for future connections without re-authentication.

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="info"></a>
<details>
<summary><b style="font-size:18px;">INFO</b></summary>

The `INFO` command retrieves detailed information about the Valkey server, including memory usage, connected clients, and database statistics.

- **Both** Jedis and Glide support this command **in the same way**.

**Jedis**
```java
String info = jedis.info();
```

**Glide**
```java
String info = glideClient.info().get();
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>

<a id="select"></a>
<details>
<summary><b style="font-size:18px;">Change Database (SELECT)</b></summary>

The `SELECT` command switches between Valkey databases.

- **Both** Jedis and Glide support this **in the same way**.

**Jedis**
```java
String res = jedis.select(1); // Output: OK
```

**Glide**
```java
String res = glideClient.select(1).get(); // Output: OK
```

<div style="font-size:14px; margin-top: 10px;">
  <a href="#commands-table">⬆ Back to commands table</a>
</div>

---

</details>





























