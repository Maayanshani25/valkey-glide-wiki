## Java Wrapper Examples

Please refer to the [README](https://github.com/valkey-io/valkey-glide/blob/main/examples/java/README.md#README) of the Java examples for the instructions on how to run [StandaloneExample](https://github.com/valkey-io/valkey-glide/blob/main/examples/java/src/main/java/glide/examples/StandaloneExample.java#StandaloneExample) and [ClusterExample](https://github.com/valkey-io/valkey-glide/blob/main/examples/java/src/main/java/glide/examples/ClusterExample.java#ClusterExample).

## Client Initialization

Valkey GLIDE provides support for both [Cluster](https://github.com/valkey-io/valkey-glide/wiki/Java-wrapper#cluster) and [Standalone](https://github.com/valkey-io/valkey-glide/wiki/Java-wrapper#standalone) and configurations. Please refer to the relevant section based on your specific setup.

### Cluster

Valkey GLIDE supports [Cluster](https://valkey.io/topics/cluster-spec) deployments, where the database is partitioned across multiple primary shards, with each shard being represented by a primary node and zero or more replica nodes.

To initialize a [`GlideClusterClient`](https://github.com/valkey-io/valkey-glide/blob/main/java/client/src/main/java/glide/api/GlideClusterClient.java), you need to provide a [`GlideClusterClientConfiguration`](https://github.com/valkey-io/valkey-glide/blob/main/java/client/src/main/java/glide/api/models/configuration/GlideClusterClientConfiguration.java) that includes the addresses of initial seed nodes. Valkey GLIDE automatically discovers the entire cluster topology, eliminating the necessity of explicitly listing all cluster nodes.

#### **Connecting to a Cluster**

The `NodeAddress` class represents the host and port of a cluster node. The host can be either an IP address, a hostname, or a fully qualified domain name (FQDN).

#### Example - Connecting to a cluster

```java
NodeAddress address = NodeAddress.builder()
    .host("address.example.com")
    .port(6379)
    .build();

GlideClusterClientConfiguration config = GlideClusterClientConfiguration.builder()
    .address(address)
    .build();

GlideClusterClient clusterClient = GlideClusterClient.createClient(config).get();
```

#### Request Routing

In the cluster, data is divided into slots, and each primary node within the cluster is responsible for specific slots. Valkey GLIDE adheres to [Valkey OSS guidelines](https://valkey.io/topics/command-tips/#request-policy) when determining the node(s) to which a command should be sent in clustering mode. 

For more details on the routing of specific commands, please refer to [the documentation within the code](https://github.com/valkey-io/valkey-glide/blob/main/java/client/src/main/java/glide/api/models/configuration/RequestRoutingConfiguration.java) for routing configuration.

#### Response Aggregation

When requests are dispatched to multiple shards in a cluster (as discussed in the Request routing section), the client needs to aggregate the responses for a given command. Valkey GLIDE follows [Valkey OSS guidelines](https://valkey.io/topics/command-tips/#response-policy) for determining how to aggregate the responses from multiple shards within a cluster. 

To learn more about response aggregation for specific commands, please refer to [the documentation within the code](https://github.com/valkey-io/valkey-glide/blob/main/java/client/src/main/java/glide/api/models/ClusterValue.java).

#### Topology Updates

The cluster's topology can change over time. New nodes can be added or removed, and the primary node owning a specific slot may change. Valkey GLIDE is designed to automatically rediscover the topology whenever the server indicates a change in slot ownership. This ensures that the Valkey GLIDE client stays in sync with the cluster's topology.

### Standalone 

Valkey GLIDE also supports Standalone deployments, where the database is hosted on a single primary node, optionally with replica nodes. To initialize a `GlideClient` for a standalone setup, you should create a `GlideClientConfiguration` that includes the addresses of primary and all replica nodes.

#### **Example - Connecting to a standalone** 

```java
GlideClientConfiguration config = GlideClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("primary.example.com")
        .port(6379)
        .build())
    .address(NodeAddress.builder()
        .host("replica1.example.com")
        .port(6379)
        .build())
    .address(NodeAddress.builder()
        .host("replica2.example.com")
        .port(6379)
        .build())
    .build();

GlideClient standaloneClient = GlideClient.createClient(config).get();
```

## Valkey Commands

For information on the supported commands and their corresponding parameters, we recommend referring to [the documentation in the code](https://github.com/valkey-io/valkey-glide/tree/main/java/client/src/main/java/glide/api/commands). This documentation provides in-depth insights into the usage and options available for each command.

### Command String Arguments
Valkey strings store sequences of bytes, that may include text, serialized objects, or binary arrays. As such, to pass Valkey strings as arguments to commands, or receive Valkey strings in responses, Glide offers two APIs:
1. `String`:  for common case `UTF-8` converted strings keys and `String` objects can be passed and receives as a Java `String`.
2. `GlideString`:  to pass `byte[]` data, a `GlideString` container object can be passed as an argument to a command or received as a response from a command.

A rule about the API:
* Command signatures either take and return `String`'s or `GlideString`'s, but not both.
* `String`'s are returned if the commands are passed in `String`'s. e.g `CompletableFuture<String[]> mget(String[] keys)`
* `GlideStrings`'s are returned if the commands are passed in `GlideStrings`'s. e.g `CompletableFuture<GlideString[]> mget(GlideString[] keys)`

Arguments for commands that require a `String` can also be substituted with `GlideString` in order to pass in or return a binary value.
* `gs()` is a static constructor that can be called with a `byte[]` or `String` argument to convert to `GlideString`. For example,
```
byte[] byteKey = Base64.getDecoder().decode("byteKey");
client.set(gs(byteKey), gs("GlideString value")).get();
```
* A `GlideString byte[]` object can be converted to `UTF-8 String` by calling `.getString()` on the `GlideString` object. For example,
```
client.get(gs(byteKey)).get();              // "GlideString value" as a GlideString
client.get(gs(byteKey)).get().getString();  // "GlideString value" as a String
```

### Transaction

A transaction in Valkey Glide allows you to execute a group of commands in a single, atomic step. This ensures that all commands in the transaction are executed sequentially and without interruption. See [Valkey Transactions](https://valkey.io/topics/transactions).


This is equivalent to the Valkey commands [MULTI](https://valkey.io/commands/multi/) / [EXEC](https://valkey.io/commands/exec/).

#### Modes of Operation

There are two primary modes for handling transactions in Glide:

1. **Standalone Mode:** Use the `Transaction` class.
2. **Cluster Mode:** Use the `ClusterTransaction` class.



#### Reusing Transaction Objects

Transaction objects can be reused. If you need to execute a particular group of commands multiple times, you can simply resend the same transaction object.


#### Example Usage

Here's a simple example demonstrating how to create and execute a transaction in standalone mode:

```java
// Initialize a transaction object
Transaction transaction = new Transaction();

// Add commands to the transaction
transaction.set("key", "value");
transaction.select(1);  // Standalone command
transaction.get("key");

// Execute the transaction
Object[] result = client.exec(transaction).get();
System.out.println(Arrays.toString(result)); // Output: [OK, OK, None]
```

#### Command Chaining

Valkey Glide supports command chaining within a transaction, allowing for a more concise and readable code. Here's how you can use chaining in transactions:

```java
// Initialize a cluster transaction object
ClusterTransaction transaction = new ClusterTransaction();

// Chain commands
transaction.set("key", "value").get("key");

// Execute the transaction
Object[] result = client.exec(transaction).get();
System.out.println(Arrays.toString(result)); // Output: [OK, "value"]
```

**Cluster Mode Considerations:** When using `ClusterTransaction`, all keys in the transaction must be mapped to the same slot.


#### Detailed Steps:

**Create a Transaction Object:** Initialize either a `Transaction` or a `ClusterTransaction` object.

For a client with cluster-mode disabled: 
```java
Transaction transaction = new Transaction();  // For standalone mode
```

For a client with cluster-mode enabled: 
```java
ClusterTransaction transaction = new ClusterTransaction();  // For cluster mode
```
**Adding Commands:** Use the transaction object to queue up the desired commands.
```java
transaction.set("key", "value");
transaction.get("key");
```
**Executing the Transaction:** Use the `exec` method of the Valkey Glide client to execute the transaction.
```java
client.exec(transaction).get();
```

**Handling Results:** The result of the transaction execution will be a list of responses corresponding to each command in the transaction.
```java
Object[] result = client.exec(transaction).get();
System.out.println(result[0]); // Output: OK
System.out.println(result[1]); // Output: "value"
```

## Advanced Configuration Settings

### Authentication

By default, when connecting to Valkey, Valkey GLIDEs operates in an unauthenticated mode.

Valkey GLIDE also offers support for an authenticated connection mode. 

In authenticated mode, you have the following options:

* Use both a username and password, which is recommended and configured through [ACLs](https://valkey.io/docs/topics/acl/) on the server.
* Use a password only, which is applicable if the server is configured with the [requirepass](https://valkey.io/topics/security/#authentication) setting.

To provide the necessary authentication credentials to the client, you can use the `ServerCredentials` class.

#### Example - Connecting with Username and Password to a Cluster

```java
GlideClusterClientConfiguration config = GlideClusterClientConfiguration.builder() 
    .address(NodeAddress.builder()
        .host("address.example.com")
        .port(6379)
        .build())
    .credentials(ServerCredentials.builder()
        .username("user1")
        .password("passwordA")
        .build())
    .build();

GlideClusterClient client = GlideClusterClient.createClient(config).get();
```


#### Example - Connecting with Username and Password to a Standalone

```java
GlideClientConfiguration config = GlideClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("primary.example.com")
        .port(6379)
        .build())
    .credentials(ServerCredentials.builder()
        .username("user1")
        .password("passwordA")
        .build())
    .build();

GlideClient client = GlideClient.createClient(config).get();
```

### TLS

Valkey GLIDE supports secure TLS connections to a data store.

It's important to note that TLS support in Valkey GLIDE relies on [rusttls](https://github.com/rustls/rustls). Currently, Valkey GLIDE employs the default rustls settings with no option for customization.

#### Example - Connecting with TLS Mode Enabled to a Cluster

```java
GlideClusterClientConfiguration config = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("adress.example.com")
        .port(6379)
        .build())
    .useTLS(true)
    .build();

GlideClusterClient client = GlideClusterClient.createClient(config).get();
```

#### Example - Connecting with TLS Mode Enabled to a Standalone server

```java
GlideClientConfiguration config = GlideClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("primary.example.com")
        .port(6379)
        .build())
    .useTLS(true)
    .build();

GlideClient client = GlideClient.createClient(config).get();
```

### Read Strategy

By default, Valkey GLIDE directs read commands to the primary node that owns a specific slot. For applications that prioritize read throughput and can tolerate possibly stale data, Valkey GLIDE provides the flexibility to route reads to replica nodes.

Valkey GLIDE provides support for next read strategies, allowing you to choose the one that best fits your specific use case.

|Strategy	|Description	|
|---	|---	|
|`PRIMARY`	|Always read from primary, in order to get the freshest data.	|
|`PREFER_REPLICA`	|Spread requests between all replicas in a round robin manner. If no replica is available, route the requests to the primary.	|
|`AZ_AFFINITY`	|Spread the read requests between replicas in the same client's Aviliablity zone in a round robin manner, falling back to other replicas or the primary if needed.	|

#### Example - Use PREFER_REPLICA Read Strategy

```java
GlideClusterClientConfiguration config = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("address.example.com")
        .port(6379)
        .build())
    .readFrom(ReadFrom.PREFER_REPLICA)
    .build()
GlideClusterClient client = GlidesClusterClient.createClient(config).get();

client.set("key1", "val1").get();

/// get will read from one of the replicas
client.get("key1").get();
```

#### Example - Use AZ_AFFINITY Read Strategy
If ReadFrom strategy is AZAffinity, 'clientAZ' setting is required to ensures that readonly commands are directed to replicas within the specified AZ if exits.

```java
GlideClusterClientConfiguration config = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("address.example.com")
        .port(6379)
        .build())
    .readFrom(ReadFrom.AZ_AFFINITY)
    .clientAZ("us-east-1a")
    .build()
GlideClusterClient client = GlidesClusterClient.createClient(config).get();

client.set("key1", "val1").get();

/// get will read from one of the replicas in the same client's availability zone if exits.
client.get("key1").get();
```


### Timeouts and Reconnect Strategy

Valkey GLIDE allows you to configure timeout settings and reconnect strategies. These configurations can be applied through the [`GlideClusterClientConfiguration`](https://github.com/valkey-io/valkey-glide/blob/main/java/client/src/main/java/glide/api/models/configuration/GlideClusterClientConfiguration.java) and [`GlideClientConfiguration`](https://github.com/valkey-io/valkey-glide/blob/main/java/client/src/main/java/glide/api/models/configuration/GlideClientConfiguration.java) parameters.


|Configuration setting	|Description	|**Default value**	|
|---	|---	|---	|
|requestTimeout	|This specified time duration, measured in milliseconds, represents the period during which the client will await the completion of a request. This time frame includes the process of sending the request, waiting for a response from the node(s), and any necessary reconnection or retry attempts. If a pending request exceeds the specified timeout, it will trigger a timeout error. If no timeout value is explicitly set, a default value will be employed.	|250 milliseconds	|
|reconnectStrategy	|The reconnection strategy defines how and when reconnection attempts are made in the event of connection failures.	|Exponential backoff	|


#### Example - Setting Increased Request Timeout for Long-Running Commands

```java
GlideClusterClient config = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("address.example.com")
        .port(6379).build())
    .requestTimeout(500)
    .build();

GlideClusterClient client = GlideClusterClient.createClient(config).get();
```

### Tracking resources

GLIDE 1.2 introduces a new NONE Valkey API: `getStatistics` which returns a `HashMap` with (currently) 2 properties (available for both `GlideClient` & `GlideClusterClient`):

- `total_connections` contains the number of active connections across **all** clients
- `total_clients` contains the number of active clients (regardless of its type)

```java
GlideClusterClient config = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("address.example.com")
        .port(6379).build())
    .requestTimeout(500)
    .build();

GlideClusterClient client = GlideClusterClient.createClient(config).get();
HashMap<String, String> stats = client.getStatistics();
// do something with the `stats`
```