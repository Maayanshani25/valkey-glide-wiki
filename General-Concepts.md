## Custom Command

The `custom_command` function is designed to execute a single command without checking inputs. It serves as a flexible tool for scenarios where the standard client API does not provide a suitable interface for a specific command.

#### Usage Notes:

- **Single-Response Commands Only**: This function is intended for use with commands that return a single response. Commands that do not return a response (such as SUBSCRIBE), those that potentially return multiple responses (such as XREAD), or those that alter the client's behavior (such as entering pub/sub mode on RESP2 connections) should not be executed using this function.

- **Key-Based Command Limitation**: Key-based commands should not be used with multi-node routing. Ensure that key-based commands are routed to a single node to maintain consistency and avoid unexpected behavior.


## Connection Management
Glide's API is asynchronous and uses a multiplex connection to interact with Valkey. This means all requests are sent through a single connection, taking advantage of Valkey's pipelining capabilities. Using a single connection is the recommended method to optimize performance with Valkey. Pipelining is a technique that enhances performance by issuing multiple commands at once without waiting for individual responses.
However, in some scenarios, opening multiple connections can be more beneficial. To open a new connection, a new Glide client object should be created, as each Glide client maintains a single connection per node. You should open a new client for the following use cases:
- **Blocking Commands**: Blocking commands, such as [BLPOP](https://valkey.io/commands/blpop/), block the connection until a condition is met (e.g., the list is not empty for BLPOP). Using a blocking command will prevent all subsequent commands from executing until the block is lifted. Therefore, opening a new client for each blocking command is required to avoid undesired blocking of other commands.
- **WATCH/UNWATCH**: Commands like WATCH, which are used to monitor changes to keys in conjunction with transaction commands, affect the state of the connection. When these commands are executed, they can lead to interactions between threads sharing the same client, since each client utilizes a single multiplexed connection per cluster node. Consequently, threads will share the same connection, and any modifications to its state will impact how subsequent commands are processed. For example, executing WATCH on one thread will cause other threads to watch the same keys, and executing MULTI/EXEC on one thread will UNWATCH the keys for other threads as well. To prevent any issues and ensure the isolation of transactions and watched keys, it is required to create separate clients for these commands.
- **Reading and Writing Large Values**: Valkey has a fairness mechanism to ensure minimal impact on other clients when handling large values. With a multiplex connection, requests are processed sequentially. Thus, large requests can delay the processing of subsequent smaller requests. When dealing with large values or transactions, it is advisable to use a separate client to prevent delays for other requests.

## Multi-Slot Command Handling

In Valkey or Redis Cluster mode, certain commands can operate on multiple keys that may be spread across different hash slots. When these commands receive keys that map to multiple slots, they are termed as **multi-slot commands**. Glide supports efficient handling of these commands, ensuring they execute correctly across the cluster.

### What are Multi-Slot Commands?
Multi-slot commands are those which allow multiple keys as inputs, with each key potentially belonging to a different hash slot. In cluster mode, if keys within a command map to different hash slots, the command must be split according to each slot and executed separately. Examples of such commands include `MSET`, `MGET`, and `DEL`, which can target multiple keys that are not necessarily in the same slot.

For example, the command:
```
DEL {foo} {foo}1 bar
```
should be split into:
```
DEL {foo} {foo}1
DEL bar
```
Even if all slots are managed by the same shard, the command must be split by slot. However, certain commands, such as `SUNIONSTORE`, are **not** considered multi-slot because they require all keys to be in the same slot.

### Multi-Slot Command Execution in Glide

When handling multi-slot commands, Glide automatically splits the command based on the slots of the input key arguments. Each sub-command is then sent to the appropriate shard for execution. The multi-slot handling process in Glide is as follows:

1. **Command Splitting**:
   Glide determines if a command should be split based on the hash slot of each key. The command is divided into sub-commands that each target a single slot, ensuring accurate routing across the cluster.

2. **Atomicity at Slot Level**:
   Since each sub-command operates independently, multi-slot commands are atomic only at the slot level. If a command fails on one slot while succeeding on others, the entire command call will return the first encountered error. Some parts of the request may succeed, while others fail, depending on the execution per slot.

3. **Error Handling**:
   If one or more slot-specific requests fail, Glide will return the first encountered error. This behavior ensures consistency in reporting errors but may impact atomicity across the entire command if sub-requests are involved. If this behavior impacts your application logic, consider splitting the request into sub-requests per slot to ensure atomicity.

### Supported Multi-Slot Commands in Glide

The following commands are supported as multi-slot commands in Glide, meaning they can operate on keys distributed across multiple hash slots:

- `MSET`
- `MGET`
- `DEL`
- `UNLINK`
- `EXISTS`
- `TOUCH`
- `WATCH`
- `JSON.MGET`

### Example Use Case

Consider the command:
```
MSET foo1 bar1 foo2 bar2 {foo3} bar3
```
In this example, keys `foo1` and `foo2` hash to different slots from `{foo3}` due to their hash slots. Glide will split the `MSET` command into separate commands based on slot grouping to ensure each key is routed to the correct shard, and execute them asynchronously.

```
MSET foo1 bar1 foo2 bar2
MSET {foo3} bar3
```

This setup allows Glide to handle multi-slot commands efficiently across distributed nodes.

## PubSub Support

The design of the PubSub support in GLIDE aims to unify various nuances into a coherent interface, minimizing differences between Sharded, Cluster, and Standalone configurations.

Additionally, GLIDE is responsible for tracking topology changes in real time, ensuring the client remains subscribed regardless of any connectivity issues. Conceptually, the PubSub functionality can be divided into four actions: Subscribing, Publishing, Receiving, and Unsubscribing.

### Subscribing

Subscribing in GLIDE differs from the canonical RESP3 protocol. To restore subscription state after a topology change or server disconnect, the subscription configuration is immutable and provided during client creation. Thus, while it is possible to use subscription commands such as `SUBSCRIBE`/`PSUBSCRIBE`/`SSUBSCRIBE` via the custom commands interface, using them alongside this model might lead to unpredictable behavior. The subscription configuration is applied to the servers using the following logic:

- **Standalone mode:** The subscriptions are applied to a random node, either a primary or one of the replicas.
- **Cluster mode:** For both Sharded and Non-sharded subscriptions, the Sharded semantics are used; the subscription is applied to the node holding the slot for the subscription's channel/pattern.

**Best Practice:** Due to the implementation of the resubscription logic, it is recommended to use a dedicated client for PubSub subscriptions. That is, the client with subscriptions should not be the same client that issues commands. In case of topology changes, the internal connections might be reestablished to resubscribe to the correct servers.

Note: Since GLIDE implements automatic reconnections and resubscriptions on behalf of the user, there is a possibility of message loss during these activities. This is not a GLIDE-specific characteristic; similar effects will occur if the user handles such issues independently. Since the RESP protocol does not guarantee strong delivery semantics for PubSub functionality, GLIDE does not introduce additional constraints in this regard.

### Publishing

Publishing functionality is unified into a single command method with an optional/default parameter for Sharded mode (applicable only for Cluster mode clients). The routing logic for this command is as follows:

- **Standalone mode:** The command is routed to a primary node or a replica if `read-only` mode is configured.
- **Cluster mode:** The command is routed to the server holding the slot for the command's channel.

### Receiving

There are three methods for receiving messages:

- **Polling:** A non-blocking method, typically named `tryGetMessage`. It returns the next available message or nothing if no messages are available.
- **Async:** An asynchronous method, returning a CompletableFuture, typically named `getMessage`.
- **Callback:** A user-provided callback function that receives the incoming message along with the user-provided context. Note that the callback code must be thread-safe for applicable languages.

The intended method is selected during client creation with the subscription configuration. When the configuration includes a callback (and an optional context), incoming messages will be passed to that callback as they arrive. Calls to the polling/async methods are prohibited and will fail. In the case of async/polling, incoming messages will be buffered in an unbounded buffer. The user should ensure timely extraction of incoming messages to avoid straining the memory subsystem.

### Unsubscribing

Since the subscription configuration is immutable and applied upon client creation, the model does not provide methods for unsubscribing during the client's lifetime. Additionally, issuing commands such as `UNSUBSCRIBE`/`PUNSUBSCRIBE`/`SUNSUBSCRIBE` via the custom commands interface may lead to unpredictable behavior. Subscriptions will be removed from servers upon client closure, typically as a result of the client's object destructor. Note that some languages, such as Python, might require an explicit call to a cleanup method, e.g.:

```python
client.close()
```

### Java client example

#### Configuration with callback

```java
MessageCallback callback =
    (msg, context) -> System.out.printf("Received %s, context %s\n", msg, context);

GlideClientConfiguration config = GlideClientConfiguration.builder()
        .address(NodeAddress.builder().port(6379).build())
        .requestTimeout(3000)
        // subscriptions are configured here
        .subscriptionConfiguration(StandaloneSubscriptionConfiguration.builder()
            .subscription(EXACT, "ch1")       // Listens for messages published to 'ch1' channel, in unsharded mode
            .subscription(EXACT, "ch2")       // Listens for messages published to 'ch2' channel, in unsharded mode
            .subscription(PATTERN, "chat*")   // Listens for messages published to channels matched by 'chat*' glob pattern, in unsharded mode
            .callback(callback)
             .callback(callback, context)     // callback or callback with context are configured here
             .build())
        .build());
try (var regularClient = GlideClient.createClient(config).get()) {
    // Do some work/wait - the callbacks will be dispatched on incomming messages
} // unsubscribe happens here
```

#### Configuration without callback

```java
GlideClientConfiguration config = GlideClientConfiguration.builder()
        .address(NodeAddress.builder().port(6379).build())
        .requestTimeout(3000)
        // subscriptions are configured here
        .subscriptionConfiguration(StandaloneSubscriptionConfiguration.builder()
                .subscription(EXACT, Set.of("ch1", "ch2"))   // there is option to set multiple subscriptions at a time
                .subscription(Map.of(PATTERN, "chat*", EXACT, Set.of("ch1", "ch2")))
                                                             // or even all subscriptions at a time
                .build())                                    // no callback is configured
        .build())
try (var regularClient = GlideClient.createClient(config).get()) {
    Message msg = regularClient.tryGetPubSubMessage(); // sync, does not block
    Message msg = regularClient.getPubSubMessage().get(); // async, waits for the next message
} // unsubscribe happens here

```

### Python client example

#### Configuration with callback

```py
def callback (msg: CoreCommands.PubSubMsg, context: Any):
    print(f"Received {msg}, context {context}\n")

listening_config = GlideClientConfiguration(
    [NodeAddress("localhost", 6379)],
    pubsub_subscriptions = GlideClientConfiguration.PubSubSubscriptions(          # subscriptions are configured here
        channels_and_patterns={
            GlideClientConfiguration.PubSubChannelModes.Exact: {"ch1", "ch2"},    # Listens for messages published to 'ch1' and 'ch2' channel, in unsharded mode
            GlideClientConfiguration.PubSubChannelModes.Pattern: {"chat*"}        # Listens for messages published to channels matched by 'chat*' glob pattern, in unsharded mode
	    },
        callback=callback,
        context=context,
    )
)

publishing_config = GlideClientConfiguration(
    [NodeAddress("localhost", 6379)]
)

listening_client = await GlideClient.create(listening_config)
publishing_client = await GlideClient.create(publishing_config)

# publish message on ch1 channel
await publishing_client.publish("Test message", "ch1")

# Do some work/wait - the callback will receive "Test message" message

await listening_client.close()    # unsubscribe happens here
```


#### Configuration without callback

```py
listening_config = GlideClientConfiguration(
    [NodeAddress("localhost", 6379)],
    pubsub_subscriptions = GlideClientConfiguration.PubSubSubscriptions(          # subscriptions are configured here
        channels_and_patterns={
            GlideClientConfiguration.PubSubChannelModes.Exact: {"ch1", "ch2"},    # Listens for messages published to 'ch1' and 'ch2' channel, in unsharded mode
            GlideClientConfiguration.PubSubChannelModes.Pattern: {"chat*"}        # Listens for messages published to channels matched by 'chat*' glob pattern, in unsharded mode
	    },
        None,
        None,
    )
)

publishing_config = GlideClientConfiguration(
    [NodeAddress("localhost", 6379)]
)

listening_client = await GlideClient.create(listening_config)
publishing_client = await GlideClient.create(publishing_config)

# publish message on ch1 channel
await publishing_client.publish("Test message", "ch1")

# waits for "Test message" to arrive
message = await listening_client.get_pubsub_message()

# returns None since only one message was published
message = listening_client.try_get_pubsub_message()

await listening_client.close()    # unsubscribe happens here
```




## Cluster Scan

The Cluster Scan feature enhances the `SCAN` command for optimal use in a Cluster environment. While it mirrors the functionality of the `SCAN` command, it incorporates additional logic to seamlessly scan the entire cluster, providing the same experience as a standalone scan. This removes the need for users to implement their own logic to handle the complexities of a cluster setup, such as slot migration, failovers, and cluster rebalancing. The `SCAN` command guarantees that a full iteration retrieves all elements present in the collection from start to finish.

Cluster Scan achieves this through a `ScanState` object that tracks scanned slots and iterates over each cluster node. It validates the node's scan and marks the slots owned by the node as scanned. This ensures that even if a slot moves between nodes, it will be scanned.

The `ScanState` is not held as a static or global object. Instead, a `ClusterScanCursor` object, which wraps a reference counter (RC) to the `ScanState`, is returned to the user. This approach avoids extra memory copying between layers, and the `ScanState` is immediately dropped when the user drops the `ClusterScanCursor`.

### Creating a ClusterScanCursor

To start iterating, create a `ClusterScanCursor`:

In python:
```py
cursor = ClusterScanCursor()
```

In Java:
```java
ClusterScanCursor cursor = ClusterScanCursor.initalCursor();
```

Each cursor returned by an iteration is an RC to a new state object. Using the same cursor object will handle the same scan iteration again. A new cursor object should be used for each iteration to continue the scan.

### Optional Parameters
The `SCAN` command accepts three optional parameters:
* `MATCH`: Iterates over keys that match the provided pattern.
* `COUNT`: Specifies the number of keys to return in a single iteration. The actual number may vary, serving as a hint to the server on the number of steps to perform in each iteration. The default value is 10.
* `TYPE`: Filters the keys by a specific type.
### General Usage Example
#### Python examples:
```py
cursor = ClusterScanCursor()
all_keys = []
while not cursor.is_finished():
    cursor, keys = await client.scan(cursor)
    all_keys.extend(keys)
```

```py
await client.mset({b'my_key1': b'value1', b'my_key2': b'value2', b'not_my_key': b'value3', b'something_else': b'value4'})
cursor = ClusterScanCursor()
await client.scan(cursor, match=b"*key*")
# Returns matching keys such as [b'my_key1', b'my_key2', b'not_my_key']
```

```py
await client.mset({b'my_key1': b'value1', b'my_key2': b'value2', b'not_my_key': b'value3', b'something_else': b'value4'})
cursor = ClusterScanCursor()
await client.scan(cursor, count=1)
# Returns around `count` amount of keys: [b'my_key1']
```

```py
await client.mset({b'key1': b'value1', b'key2': b'value2', b'key3': b'value3'})
await client.sadd(b"this_is_a_set", [b"value4"])
cursor = ClusterScanCursor()
all_keys = []
while not cursor.is_finished():
    cursor, keys = await client.scan(cursor, type=ObjectType.STRING)
    all_keys.extend(keys)
print(all_keys)  # Output: [b'key1', b'key2', b'key3']
```
#### Java examples: 
```java
String key = "key:test_cluster_scan_simple" + UUID.randomUUID();
Map<String, String> expectedData = new LinkedHashMap<>();
for (int i = 0; i < 100; i++) {
    expectedData.put(key + ":" + i, "value " + i);
}

Set<String> result = new LinkedHashSet<>();
ClusterScanCursor cursor = ClusterScanCursor.initalCursor();
while (!cursor.isFinished()) {
     final Object[] response = clusterClient.scan(cursor).get();
     cursor.releaseCursorHandle();

     cursor = (ClusterScanCursor) response[0];
     final Object[] data = (Object[]) response[1];
     for (Object datum : data) {
         result.add(datum.toString());
      }
}
cursor.releaseCursorHandle();
```

```java
Set<String> result = new LinkedHashSet<>();
ClusterScanCursor cursor = ClusterScanCursor.initalCursor();
while (!cursor.isFinished()) {
    final Object[] response =
                    clusterClient
                            .scan(
                                    cursor,
                                    ScanOptions.builder()
                                            .matchPattern("key:*")
                                            .type(ScanOptions.ObjectType.STRING)
                                            .build())
                            .get();
    cursor.releaseCursorHandle();

     cursor = (ClusterScanCursor) response[0];
     final Object[] data = (Object[]) response[1];
     for (Object datum : data) {
           result.add(datum.toString());
      }
}
cursor.releaseCursorHandle();
```

```java
Set<String> result = new LinkedHashSet<>();
ClusterScanCursor cursor = ClusterScanCursor.initalCursor();
while (!cursor.isFinished()) {
    final Object[] response = clusterClient.scan(cursor, ScanOptions.builder().count(100L).build()).get();
    cursor.releaseCursorHandle();

     cursor = (ClusterScanCursor) response[0];
     final Object[] data = (Object[]) response[1];
      for (Object datum : data) {
           result.add(datum.toString());
      }
}
cursor.releaseCursorHandle();
```