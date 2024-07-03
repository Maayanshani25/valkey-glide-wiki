## Custom Command

The `custom_command` function is designed to execute a single command without checking inputs. It serves as a flexible tool for scenarios where the standard client API does not provide a suitable interface for a specific command.

#### Usage Notes:

- **Single-Response Commands Only**: This function is intended for use with commands that return a single response. Commands that do not return a response (such as SUBSCRIBE), those that potentially return multiple responses (such as XREAD), or those that alter the client's behavior (such as entering pub/sub mode on RESP2 connections) should not be executed using this function.

- **Key-Based Command Limitation**: Key-based commands should not be used with multi-node routing. Ensure that key-based commands are routed to a single node to maintain consistency and avoid unexpected behavior.


## Connection Management
Glide's API is asynchronous and uses a multiplex connection to interact with Valkey. This means all requests are sent through a single connection, taking advantage of Valkey's pipelining capabilities. Using a single connection is the recommended method to optimize performance with Valkey. Pipelining is a technique that enhances performance by issuing multiple commands at once without waiting for individual responses.
However, in some scenarios, opening multiple connections can be more beneficial. To open a new connection, a new Glide client object should be created, as each Glide client maintains a single connection per Redis node. You should open a new client for the following use cases:
Blocking Commands: Blocking commands, such as [BLPOP](https://valkey.io/commands/blpop/), block the connection until a condition is met (e.g., the list is not empty for BLPOP). Using a blocking command will prevent all subsequent commands from executing until the block is lifted. Therefore, we recommend opening a new client for each blocking command to avoid undesired blocking of other commands.
Reading and Writing Large Values: Valkey has a fairness mechanism to ensure minimal impact on other clients when handling large values. With a multiplex connection, requests are processed sequentially. Thus, large requests can delay the processing of subsequent smaller requests. When dealing with large values or transactions, it is advisable to use a separate client to prevent delays for other requests.


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

var regularClient =
    GlideClient.CreateClient(
            GlideClientConfiguration.builder()
                .address(NodeAddress.builder().port(6379).build())
                .requestTimeout(3000)
                .subscriptionConfiguration(               // subscriptions are configured here
                    StandaloneSubscriptionConfiguration.builder()
                        .subscription(EXACT, "ch1")       // this forces client to submit "SUBSCRIBE ch1" command and re-submit it on reconnection
                        .subscription(EXACT, "ch2")
                        .subscription(PATTERN, "chat*")   // this is backed by "PSUBSCRIBE chat*" command
                        .callback(callback)
                        .callback(callback, context)      // callback or callback with context are configured here
                        .build())
                .build())
        .get();

// work with client

regularClient.close(); // unsubscribe happens here
```

#### Configuration without callback

```java
var regularClient =
    GlideClient.CreateClient(
            GlideClientConfiguration.builder()
                .address(NodeAddress.builder().port(6379).build())
                .requestTimeout(3000)
                .subscriptionConfiguration(               // subscriptions are configured here
                    StandaloneSubscriptionConfiguration.builder()
                        .subscription(EXACT, Set.of("ch1", "ch2"))   // there is option to set multiple subscriptions at a time
                        .subscription(Map.of(PATTERN, "chat*", EXACT, Set.of("ch1", "ch2")))
                                                                     // or even all subscriptions at a time
                        .build())                                    // no callback is configured
                .build())
        .get();

// wait for messages

Message msg = regularClient.tryGetPubSubMessage(); // sync
Message msg = regularClient.getPubSubMessage().get(); // async
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
TODO: Edit, this is just a copy paste from the command doc before make it lighter
Incrementally iterates over the keys in the Cluster.
The method returns a list containing the next cursor and a list of keys.

This command is similar to the SCAN command, but it is designed to work in a Cluster environment.
The ClusterScanCursor object is used to keep track of the scan state.
Every cursor is a new state object, which mean that using the same cursor object will result the scan to handle
the same scan iteration again.
For each iteration the new cursor object should be used to continue the scan.

As the SCAN command, the method can be used to iterate over the keys in the database, the guarantee of the scan is
to return all keys the database have from the time the scan started that stay in the database till the scan ends.
The same key can be returned in multiple scans iteration.