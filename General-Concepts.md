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

## Inflight Request Limit

To ensure system stability and prevent out-of-memory (OOM) errors, Valkey Glide limits the maximum number of concurrent (inflight) requests sent through each connection of a Glide client.
Excessive inflight requests can lead to queuing within the Glide infrastructure, increasing memory usage and potentially causing OOM issues.
By capping inflight requests per connection, this feature reduces the risk of excessive queuing and helps maintain reliable system performance.
The default inflight request limit is 1000 per connection, though this value can be configured in all Glide wrappers to suit application needs.

The limit is designed based on Little’s Law, ensuring that the system can operate efficiently at peak throughput while allowing a buffer for bursts. 
* Maximum request rate: 50,000 requests/second.
* Average response time: 1 millisecond.
Using Little’s Law:
* Inflight requests = (Request rate) × (Response time)
* Inflight requests = 50,000 requests/second × (1 ms/1000 ms) = 50 requests

A default value of 1000 allows for sufficient headroom above this calculated baseline, ensuring performance during short bursts of activity.
When the inflight request limit is exceeded, excess requests are immediately rejected, and errors are returned to the client.

Python example:
```python
cluster_config = GlideClusterClientConfiguration(
    <some general config>,
    inflight_requests_limit=<customer config>,
)
```

Java example:
```java
GlideClientConfiguration glideClientConfiguration =
    GlideClientConfiguration.builder()
        .address(node1address)
        .inflightRequestsLimit(<customer config>)
        .build();
)
```

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




## Dynamic Password Management

Valkey Glide introduces the ability to dynamically update the connection-configured password at runtime. \
This enhancement facilitates seamless password rotations, ensuring uninterrupted access and improved security for your applications.

### Authentication Context

Valkey/Redis-OSS supports authentication mechanisms, enabling secure connections through passwords. Proper authentication is crucial for restricting access to authorized clients and safeguarding your data.

- **Password Authentication**: Clients authenticate using a predefined password.
- **Access Control Lists (ACLs)**: Offers granular user permissions with individual passwords. For more information, refer to the [Valkey ACL documentation](https://valkey.io/topics/acl/).

*Note: ACLs provide extensive control over permissions. For detailed insights, please visit the [Valkey ACL documentation](https://valkey.io/topics/acl/).*

### Integration with AWS and GCP Services

Glide's dynamic password update feature supports integration with cloud services like Amazon ElastiCache, MemoryDB, and Google Cloud Memorystore.

- **Amazon ElastiCache**: Supports password-based and IAM authentication. AWS recommends regular password rotations.
  
  > *"Regularly rotating passwords is a best practice to minimize security risks."* - [AWS ElastiCache Authentication](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth.html)

- **Amazon MemoryDB**: Uses IAM authentication with short-lived tokens that need regular renewal.
  
  > *"IAM authentication tokens have a limited lifetime and must be refreshed regularly to maintain secure connections."* - [AWS MemoryDB Authentication](https://docs.aws.amazon.com/memorydb/latest/devguide/auth-iam.html)

- **Google Cloud Memorystore**: Offers IAM authentication with ephemeral tokens requiring periodic renewal.
  
  > *"Google Cloud Memorystore's IAM authentication requires periodic renewal of tokens to maintain secure connections."* - [GCP Memorystore IAM Authentication](https://cloud.google.com/memorystore/docs/cluster/about-iam-auth?hl=en)


In all these scenarios, frequently updating passwords or tokens is essential to maintain secure connections and handle failovers effectively. 

### Dynamic Password Update Feature

The dynamic password update functionality allows clients to update their connection passwords on-the-fly, ensuring continuous operation without the need for client restarts or reconnections. \
This feature is particularly useful for scenarios where passwords need to be rotated regularly to maintain secure connections. **Updating the password immediately when server-side password changes is crucial to avoid disconnection and reconnection issues due to password mismatch**.

For most scenarios, you can update the password without immediate re-authentication. However, for cases like IAM authentication where tokens need to be refreshed periodically (e.g., every 12 hours), you can utilize the `immediateAuth`/`immediate_auth` option to re-authenticate immediately.

In case you want to remove the password from the connection configuration, you can pass `null`/`None` as the password.

* *Note that the functionality does not rotate the password on the server-side. It only updates the client-side password to maintain secure connections.*

**Benefits:**

- **Seamless Password Update**: Update passwords without interrupting service.
- **Enhanced Security**: Regularly update passwords to mitigate unauthorized access risks.
- **Operational Efficiency**: Simplify password management and reduce maintenance overhead.

### Usage Examples

Below are examples demonstrating how to utilize the dynamic password update feature in different programming languages using Glide.

#### Java Example

```java
import com.valkey.glide.GlideClusterClient;
import com.valkey.glide.GlideClusterClientConfiguration;
import com.valkey.glide.ServerCredentials;
import com.valkey.glide.NodeAddress;

import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) throws Exception {
        // Define the list of node addresses
        List<NodeAddress> nodeList = Arrays.asList(
            new NodeAddress("localhost", 6379),
            new NodeAddress("localhost", 6380),
            new NodeAddress("localhost", 6381)
        );

        // Define your server credentials
        ServerCredentials credentials = ServerCredentials.builder()
            .username("your-username")
            .password("your-password-or-token")
            .build();

        // Create a configuration for the GlideClusterClient
        GlideClusterClientConfiguration config = new GlideClusterClientConfiguration.Builder()
            .addresses(nodeList)
            .credentials(credentials)
            .requestTimeout(5000)
            .clientName("my-client")
            .build();

        // Create the GlideClusterClient instance
        GlideClusterClient client = GlideClusterClient.createClient(config);

        // Update password dynamically
        client.updateConnectionPassword("your-new-password");
        // To perform immediate re-authentication, set the second parameter to true
        client.updateConnectionPassword("your-new-password", true);

        // Resetting password by passing null
        client.updateConnectionPassword(null); // Note: This will clear the password from the connection configuration.

        System.out.println("GlideClusterClient created and password updated.");
    }
}
```

#### Node.js Example

```typescript
import { GlideClusterClient, GlideClusterClientConfiguration, ServerCredentials } from '@valkey/valkey-glide';

async function main() {

// Define your server credentials
const credentials: ServerCredentials = {
    username: 'your-username',
    password: 'your-password-or-token'
};

// Create a configuration for the GlideClusterClient
const config: GlideClusterClientConfiguration = {
    addresses: [
        { host: 'sample-address-0001.use1.cache.amazonaws.com', port: 6379 }
    ],
    credentials: credentials,
    requestTimeout: 5000,
    clientName: 'my-client'
};

// Create the GlideClusterClient instance
const client = await GlideClusterClient.createClient(config);

// Update password dynamically
await client.updateConnectionPassword('your-new-password'); 
// To perform immediate re-authentication, set the second parameter to true
await client.updateConnectionPassword('your-new-password', true);

// Resetting password by passing null
client.updateConnectionPassword(null); // Note: This will clear the password from the connection configuration.
}
```

#### Python Example

```python
import asyncio
from glide import GlideClusterClientConfiguration, NodeAddress, GlideClusterClient

async def main():
    # Define your server credentials
    credentials = ServerCredentials(
        username='your-username',
        password='your-password-or-token'
    )
    # Define the list of node addresses
    addresses = [
        NodeAddress("my-instance.valkey.us-central1.gcp.cloud", 6379),
    ]
    # Create a configuration for the GlideClusterClient
    config = GlideClusterClientConfiguration(
        addresses=addresses,
        credentials=credentials,
        request_timeout=250,
        client_name='my-client'
    )

    # Create the GlideClusterClient instance
    client = await GlideClusterClient.create_client(config)

    # Update password dynamically
    await client.update_connection_password('your-new-password')
    # To perform immediate re-authentication, set the second parameter to true
    await client.update_connection_password('your-new-password', True)
    # Resetting password by passing None
    await client.update_connection_password(None) # Note: This will clear the password from the connection configuration.


asyncio.run(main())
```

#### Optional Username  
In scenarios where a username is not required (e.g., IAM authentication), you can omit it or set it to `null`.  

**Java Example**:  
```java
ServerCredentials credentials = ServerCredentials.builder()
    .password("your-password-or-token")
    .build();
```

**Node.js Example:**
```typescript
const credentials: ServerCredentials = {
    password: 'your-password-or-token'
};
```

**Python Example:**
```python
credentials = ServerCredentials(
    password='your-password-or-token'
)
```

#### Best Practices for Authentication

- **Regular Credential Rotation**: Frequently update passwords and tokens using the dynamic password update feature to maintain secure connections.
- **Automate Token Refreshing**: Implement automated mechanisms to refresh IAM tokens before they expire.
- **Secure Credential Storage**: Store passwords and tokens securely using environment variables or secret management tools.
- **Principle of Least Privilege**: Use ACLs to assign minimal necessary permissions to users.
- **Monitor Authentication Events**: Track authentication attempts and token renewals to detect and respond to potential security threats promptly.

By leveraging Glide's dynamic password update capability, you ensure that your applications maintain secure and uninterrupted connections to Valkey, adhering to both internal security policies and best practices recommended by cloud service providers like AWS and GCP.


## Modules API

Valkey Modules offers a way to extend the general Valkey commands and functionality, and (starting in release 1.2) Valkey-Glide offers a simple Modules API client interface to interact with common Modules API. See [Modules Introduction](https://valkey.io/topics/modules-intro/) on how to load modules into your Valkey service. 

### General Usage

Valkey Module commands are available through static calls that wrap the [custom command](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#custom-command).  The APIs definitions are strictly owned by the Module creator, so there will be some slight variation between Module behaviour.  Visit the module API pages to learn more about the behaviour of individual APIs. 

Some example Module APIs include: 

* [Amazon MemoryDB Vector search commands](https://docs.aws.amazon.com/memorydb/latest/devguide/vector-search-commands.html)
* [Amazon ElastiCache JSON commands](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/json-list-commands.html)

Use `INFO MODULES` or `MODULE LIST` command to see the status of all loaded modules.

### Usage Examples

Once the module is loaded into the server, the following examples demonstrate basic behaviour for calling module commands: 

#### Java JSON Module Example

```java
import glide.api.commands.servermodules.Json;

try (GlideClient glideClient = GlideClient.createClient(config).get()) {
    String key = "testKey";
    String path = "$";
    String jsonValue = "{\"a\": 1.0, \"b\": 2}";

    CompletableFuture<String> setResponseFuture = Json.set(glideClient, key, path, jsonValue);
    String setResponse = setResponseFuture.get(); // "OK"
    assert setResponse.equals("OK");

    CompletableFuture<String> getResponseFuture = Json.get(client, key).get();
    String getResponseFuture = setResponseFuture.get(); // jsonValue
    assert value.equals("{\"a\": 1.0, \"b\": 2}");
}
```

#### Node.js JSON Module Example

```typescript
import {GlideJson, GlideClient} from "@valkey/valkey-glide";

// Create the GlideClient instance
const client = await GlideClient.createClient(config);

const value = {a: 1.0, b:2};
const jsonStr = JSON.stringify(value);

// Sets the value at `doc` as a JSON object.
const jsonSetResponse = await GlideJson.set("doc", "$", jsonStr);
console.log(jsonSetResponse); // 'OK' - Indicates successful setting of the value at path '$' in the key stored at `doc`.

// Gets the value at path '$' in the JSON document stored at `doc`.
const jsonGetResponse = await GlideJson.get(client, "doc", {path: "$"});
console.log(JSON.stringify(jsonGetResponse)); //  [{"a": 1.0, "b": 2}] # JSON object retrieved from the key `doc`
```

#### Python JSON Module Example

```python
from glide import glide_json
import json

client = await GlideClient.create(config)
value = {'a': 1.0, 'b': 2}
json_str = json.dumps(value) # Convert Python dictionary to JSON string using json.dumps()

# Sets the value at `doc` as a JSON object.
set_response = await glide_json.set(client, "doc", "$", json_str)
print(set_response) # "OK" - Indicates successful setting of the value at path '$' in the key stored at `doc`.

# Gets the value at path '$' in the JSON document stored at `doc`.
get_response = await glide_json.get(client, "doc", "$") 
print(get_response) # b"[{\"a\":1.0,\"b\":2}]" 
json.loads(str(json_get)) # [{"a": 1.0, "b" :2}] - JSON object retrieved from the key `doc` using json.loads()
```

#### Java Vector Search Module Example

```java
import glide.api.commands.servermodules.FT;
import glide.api.models.commands.FT.FTCreateOptions.FieldInfo;
import glide.api.models.commands.FT.FTCreateOptions;
import glide.api.models.commands.FT.FTCreateOptions.*;
import glide.api.models.commands.FT.FTSearchOptions;

try (GlideClient glideClient = GlideClient.createClient(config).get()) {

    // FT.Create a Hash index with Hash values and FT.Search those values
    String prefix = "{hash}:";
    String index = prefix + "index";
    FieldInfo[] fields = new FieldInfo[] {
        new FieldInfo("vec", "VEC", VectorFieldHnsw.builder(DistanceMetric.L2, 2).build())
    };
    FTCreateOptions.builder().dataType(DataType.HASH).prefixes(new String[] {prefix}).build();
    FT.create(client, index, fields, FTCreateOptions).get(); // returns "OK"

    Map hash0 = Map.of("vec", new byte[] {
        (byte) 0, (byte) 0, (byte) 0, (byte) 0, (byte) 0, (byte) 0, (byte) 0, (byte) 0
    });
    client.hset(prefix + "0", hash0).get();
    
    Map hash1 = Map.of("vec", new byte[] {
        (byte) 0, (byte) 0, (byte) 0, (byte) 0,
        (byte) 0, (byte) 0, (byte) 0x80, (byte) 0xBF
    });
    client.hset(prefix + "1", hash1).get();

    Thread.sleep(1000); // let server digest the data and update index

    FTSearchOptions searchOptions = FTSearchOptions.builder()
        .params(Map.of("query_vec", (byte) 0, (byte) 0, (byte) 0, (byte) 0, (byte) 0, (byte) 0, (byte) 0, (byte) 0)))
        .build();
    String query = "*=>[KNN 2 @VEC $query_vec]";
    Object[] ftsearchResponse = FT.search(client, index, query, searchOptions).get();
    assert ftsearchResponse[0] == 2L;
    // ftsearchResponse[1] contains a map with "{hash}:0" and "{hash}:1" vector search results
}
```

#### Node.js Vector Search Module Example

```typescript
import {
    FtSearchOptions,
    FtSearchReturnType,
    GlideClient,
    GlideFt,
} from "@valkey/valkey-glide";

const client = await GlideClient.createClient(config);
const prefix = "{json}:";

await GlideJson.set(client, `${prefix}1`, "$", '[{"arr": 42}, {"val": "hello"}, {"val": "world"}]');

const vectorFields: VectorField[] = [
    {
        type: "NUMERIC",
        name: "$..arr",
        alias: "arr",
    },
    {
        type: "TEXT",
        name: "$..val",
        alias: "val",
    },
];
await GlideFt.create(client, `${prefix}index`, vectorFields
    {
        dataType: "JSON",
        prefixes: [prefix],
    },
);

const optionsWithLimit: FtSearchOptions = {
    returnFields: [
        { fieldIdentifier: "$..arr", alias: "myarr" },
        { fieldIdentifier: "$..val", alias: "myval" },
    ],
    timeout: 10000,
    limit: { offset: 0, count: 2 },
};
const searchResult: FtSearchReturnType = await GlideFt.search(client, `${prefix}index`, query, optionsWithLimit);
console.log(searchResult[0]); // Output: 1
console.log(searchResult[1]); // Output: An array with search result containing "{json}:1"
```

#### Python Vector Search Module Example
```python
TODO
```


