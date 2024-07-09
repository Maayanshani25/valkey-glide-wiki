## Custom Command

The `custom_command` function is designed to execute a single command without checking inputs. It serves as a flexible tool for scenarios where the standard client API does not provide a suitable interface for a specific command.

#### Usage Notes:

- **Single-Response Commands Only**: This function is intended for use with commands that return a single response. Commands that do not return a response (such as SUBSCRIBE), those that potentially return multiple responses (such as XREAD), or those that alter the client's behavior (such as entering pub/sub mode on RESP2 connections) should not be executed using this function.

- **Key-Based Command Limitation**: Key-based commands should not be used with multi-node routing. Ensure that key-based commands are routed to a single node to maintain consistency and avoid unexpected behavior.


## Connection Management
Glide's API is asynchronous and uses a multiplex connection to interact with Valkey. This means all requests are sent through a single connection, taking advantage of Valkey's pipelining capabilities. Using a single connection is the recommended method to optimize performance with Valkey. Pipelining is a technique that enhances performance by issuing multiple commands at once without waiting for individual responses.
However, in some scenarios, opening multiple connections can be more beneficial. To open a new connection, a new Glide client object should be created, as each Glide client maintains a single connection per node. You should open a new client for the following use cases:
- **Blocking Commands**: Blocking commands, such as [BLPOP](https://valkey.io/commands/blpop/), block the connection until a condition is met (e.g., the list is not empty for BLPOP). Using a blocking command will prevent all subsequent commands from executing until the block is lifted. Therefore, we recommend opening a new client for each blocking command to avoid undesired blocking of other commands.
- **Reading and Writing Large Values**: Valkey has a fairness mechanism to ensure minimal impact on other clients when handling large values. With a multiplex connection, requests are processed sequentially. Thus, large requests can delay the processing of subsequent smaller requests. When dealing with large values or transactions, it is advisable to use a separate client to prevent delays for other requests.


## GLIDE PubSub feature

### Subscription

GLIDE takes responsibility of tracking topology changes in real time and ensures client is kept subscribed regardless of any connectivity issues. If the client is migrated to a new node or re-connected to a node, GLIDE will automatically re-subscribe the client.
To provide that, GLIDE gets subscription configuration at the moment of client creation. A regular command `SUBSCRIBE`/`PSUBSCRIBE`/`SSUBSCRIBE` cannot trigger connection status tracking, so such API isn't exposed. Due to the same reason, unsubscribing could be done once client closes all connections and shuts down. Unfortunately, there is no option to unsubscribe from one of the channels.

### Receiving the messages

All GLIDE clients provide following API to receive incoming messages:
1. Sync `tryGet` method which returns a message or `null`/`None` if no unread messages left.
2. Async `get` method which returns a future/promise for the next message.
3. A callback called for every incoming message.

To avoid conflicts, callback mechanism cannot be activated alongside with first two methods. Meanwhile, `tryGet` and `get` coexist and don't interfere.
A user can configure client to use the callback when client configuration is created. This configuration cannot be changed later. If callback is not configured, incoming messages are available through `tryGet` and `get`.
Callback is a function, which takes two arguments - an incoming message and an arbitrary user-defined context. The context is stored and configured together with the callback.

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
            .subscription(EXACT, "ch1")       // this forces client to submit "SUBSCRIBE ch1" command and re-submit it on reconnection
            .subscription(EXACT, "ch2")
            .subscription(PATTERN, "chat*")   // this is backed by "PSUBSCRIBE chat*" command
            .callback(callback)
             .callback(callback, context)      // callback or callback with context are configured here    
             .build())
        .build());
try (var regularClient = GlideClient.createClient(config).get()) {
    // work with client
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
    Message msg = regularClient.tryGetPubSubMessage(); // sync
    Message msg = regularClient.getPubSubMessage().get(); // async
}

```

### Python client example

#### Configuration with callback

```py
def callback (msg: CoreCommands.PubSubMsg, context: Any):
    print(f"Received {msg}, context {context}\n")

config = GlideClientConfiguration(
    [NodeAddress("localhost", 6379)],
    pubsub_subscriptions = GlideClientConfiguration.PubSubSubscriptions(          # subscriptions are configured here
        channels_and_patterns={
	    GlideClientConfiguration.PubSubChannelModes.Exact: {"ch1", "ch2"},    # this forces client to submit "SUBSCRIBE ch1 ch2" command and re-submit it on reconnection
	    GlideClientConfiguration.PubSubChannelModes.Pattern: {"chat*"}        # this is backed by "PSUBSCRIBE chat*" command
	},
        callback=callback,
        context=context,
    )
)

client = await GlideClient.create(config)

## wait for messages

await client.close()    # unsubscribe happens here
```


#### Configuration without callback

```py
config = GlideClientConfiguration(
    [NodeAddress("localhost", 6379)],
    pubsub_subscriptions = GlideClientConfiguration.PubSubSubscriptions(          # subscriptions are configured here
        {
	    GlideClientConfiguration.PubSubChannelModes.Exact: {"ch1", "ch2"},    # this forces client to submit "SUBSCRIBE ch1 ch2" command and re-submit it on reconnection
	    GlideClientConfiguration.PubSubChannelModes.Pattern: {"chat*"}        # this is backed by "PSUBSCRIBE chat*" command
	},
	None, None
    )
)

client = await GlideClient.create(config)

## wait for messages

message = client.try_get_pubsub_message()    # sync method to get next message
message = await client.get_pubsub_message()  # async method to get a message

await client.close()    # unsubscribe happens here
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
#### Python exampels:
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
#### Java exampels: 
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