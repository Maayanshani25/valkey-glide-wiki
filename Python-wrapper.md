## Client Initialization

Valkey GLIDE provides support for both [Cluster](https://github.com/aws/glide-for-redis/wiki/Python-wrapper#cluster) and [Standalone](https://github.com/aws/glide-for-redis/wiki/Python-wrapper#standalone) configurations. Please refer to the relevant section based on your specific setup.

### Cluster

Valkey GLIDE supports [Cluster](https://valkey.io/docs/topics/cluster-spec) deployments, where the database is partitioned across multiple primary shards, with each shard being represented by a primary node and zero or more replica nodes.


To initialize a `GlideClusterClient`, you need to provide a `GlideClusterClientConfiguration` that includes the addresses of initial seed nodes. Valkey GLIDE automatically discovers the entire cluster topology, eliminating the necessity of explicitly listing all cluster nodes.

#### **Connecting to a Cluster**

The `NodeAddress` class represents the host and port of a cluster node. The host can be either an IP address, a hostname, or a fully qualified domain name (FQDN).

#### Example - Connecting to a cluster

```python
addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses)

client = await GlideClusterClient.create(client_config)
```

#### Request Routing

In the cluster, data is divided into slots, and each primary node within the cluster is responsible for specific slots. Valkey GLIDE adheres to [Valkey OSS guidelines](https://valkey.io/docs/topics/command-tips/#:~:text=_script%20flag.-,request_policy,-This%20tip%20can) when determining the node(s) to which a command should be sent in clustering mode. 

For more details on the routing of specific commands, please refer to the documentation within the code.

#### Response Aggregation

When requests are dispatched to multiple shards in a cluster (as discussed in the Request routing section), the client needs to aggregate the responses for a given command. Valkey GLIDE follows [Valkey OSS guidelines](https://valkey.io/docs/topics/command-tips/#:~:text=the%20SCAN%20command.-,response_policy,-This%20tip%20can) for determining how to aggregate the responses from multiple shards within a cluster. 

To learn more about response aggregation for specific commands, please refer to the documentation within the code.

#### Topology Updates

The cluster's topology can change over time. New nodes can be added or removed, and the primary node owning a specific slot may change. Valkey GLIDE is designed to automatically rediscover the topology whenever the server indicates a change in slot ownership. This ensures that the Valkey GLIDE client stays in sync with the cluster's topology.

### Standalone 

Valkey GLIDE also supports Standalone deployments, where the database is hosted on a single primary node, optionally with replica nodes. To initialize a `GlideClient` for a standalone setup, you should create a `GlideClientConfiguration` that includes the addresses of primary and all replica nodes.

#### **Example - Connecting to a standalone** 

```python
addresses = [
    NodeAddress(host="primary.example.com", port=6379),
    NodeAddress(host="replica1.example.com", port=6379),
    NodeAddress(host="replica2.example.com", port=6379)
  ]
client_config = GlideClientConfiguration(addresses)

client = await GlideClient.create(client_config)
```

## Valkey commands
For information on the supported commands and their corresponding parameters, we recommend referring to the documentation in the code. This documentation provides in-depth insights into the usage and options available for each command.

## Advanced Configuration Settings

### Authentication

By default, when connecting to Valkey, Valkey GLIDEs operates in an unauthenticated mode.

Valkey GLIDE also offers support for an authenticated connection mode. 

In authenticated mode, you have the following options:

* Use both a username and password, which is recommended and configured through [ACLs](https://valkey.io/docs/topics/acl/) on the server.
* Use a password only, which is applicable if the server is configured with the [requirepass](https://valkey.io/docs/topics/security/#:~:text=all%20the%20interfaces.-,Authentication,-Valkey%20provides%20two) setting.

To provide the necessary authentication credentials to the client, you can use the `ServerCredentials` class.

#### Example - Connecting with Username and Password to a Cluster

```python
addresses = [NodeAddress(host="address.example.com", port=6379)]
credentials = ServerCredentials("passwordA", "user1")
client_config = GlideClusterClientConfiguration(addresses, credentials=credentials)

client = await GlideClusterClient.create(client_config)
```


#### Example - Connecting with Username and Password to a Standalone server

```python
addresses = [
    NodeAddress(host="primary.example.com", port=6379),
    NodeAddress(host="replica1.example.com", port=6379),
    NodeAddress(host="replica2.example.com", port=6379)
  ]
credentials = ServerCredentials("passwordA", "user1")
client_config = GlideClientConfiguration(addresses, credentials=credentials)

client = await GlideClient.create(client_config)
```

### TLS

Valkey GLIDE supports secure TLS connections to a data store.

It's important to note that TLS support in Valkey GLIDE relies on [rusttls](https://github.com/rustls/rustls). Currently, Valkey GLIDE employs the default rustls settings with no option for customization.

#### Example - Connecting with TLS Mode Enabled to a Cluster

```python
addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses, use_tls=True)

client = await GlideClusterClient.create(client_config)
```
#### Example - Connecting with TLS Mode Enabled to a Standalone server

```python
addresses = [
    NodeAddress(host="primary.example.com", port=6379),
    NodeAddress(host="replica1.example.com", port=6379),
    NodeAddress(host="replica2.example.com", port=6379)
  ]
client_config = GlideClientConfiguration(addresses, use_tls=True)

client = await GlideClient.create(client_config)
```

### Read Strategy

By default, Valkey GLIDE directs read commands to the primary node that owns a specific slot. For applications that prioritize read throughput and can tolerate possibly stale data, Valkey GLIDE provides the flexibility to route reads to replica nodes.

Valkey GLIDE provides support for next read strategies, allowing you to choose the one that best fits your specific use case.

|Strategy	|Description	|
|---	|---	|
|`PRIMARY`	|Always read from primary, in order to get the freshest data	|
|`PREFER_REPLICA`	|Spread requests between all replicas in a round robin manner. If no replica is available, route the requests to the primary	|

#### Example - Use PREFER_REPLICA Read Strategy

```python
addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses, read_from=ReadFrom.PREFER_REPLICA)

client = await GlideClusterClient.create(client_config)
await client.set("key1", "val1")
# get will read from one of the replicas
await client.get("key1")
```

### Timeouts and Reconnect Strategy

Valkey GLIDE allows you to configure timeout settings and reconnect strategies. These configurations can be applied through the `GlideClusterClientConfiguration` and `GlideClientConfiguration` parameters.


|Configuration setting	|Description	|**Default value**	|
|---	|---	|---	|
|request_timeout	|This specified time duration, measured in milliseconds, represents the period during which the client will await the completion of a request. This time frame includes the process of sending the request, waiting for a response from the node(s), and any necessary reconnection or retry attempts. If a pending request exceeds the specified timeout, it will trigger a timeout error. If no timeout value is explicitly set, a default value will be employed.	|250 milliseconds	|
|reconnect_strategy	|The reconnection strategy defines how and when reconnection attempts are made in the event of connection failures	|Exponential backoff	|

**Notes:**
1. In the case of a Standalone server, the only reconnect strategy currently supported is exponential backoff.
2. Regarding a Cluster, an exponential backoff strategy is **currently in the process of being developed**. In the event of a disconnection, a single reconnect attempt is initiated per request.

#### Example - Setting Increased Request Timeout for Long-Running Commands

```python
addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses, request_timeout=500)

client = await GlideClusterClient.create(client_config)
```


### Transaction

A transaction in Valkey Glide allows you to execute a group of commands in a single, atomic step. This ensures that all commands in the transaction are executed sequentially and without interruption. See https://valkey.io/docs/topics/transactions/


This is equivalent to the Valkey commands [MULTI](https://valkey.io/commands/multi/) / [EXEC](https://valkey.io/commands/exec/).

#### Modes of Operation

There are two primary modes for handling transactions in Glide:

1. **Standalone Mode:** Use the `Transaction` class.
2. **Cluster Mode:** Use the `ClusterTransaction` class.



#### Reusing Transaction Objects

Transaction objects can be reused. If you need to execute a particular group of commands multiple times, you can simply resend the same transaction object.


#### Example Usage

Here's a simple example demonstrating how to create and execute a transaction in standalone mode:

```python
# Initialize a transaction object
transaction = Transaction()

# Add commands to the transaction
transaction.set("key", "value")
transaction.select(1)  # Standalone command
transaction.get("key")

# Execute the transaction
await client.exec(transaction)
# Output: [OK, OK, None]
```

#### Command Chaining

Valkey Glide supports command chaining within a transaction, allowing for a more concise and readable code. Here's how you can use chaining in transactions:

```python
# Initialize a cluster transaction object
cluster_transaction = ClusterTransaction()

# Chain commands
cluster_transaction.set("key", "value").get("key")

# Execute the transaction
await client.exec(cluster_transaction)
# Output: [OK, "value"]
```

**Cluster Mode Considerations:** When using `ClusterTransaction`, all keys in the transaction must be mapped to the same slot.


#### Detailed Steps:

**Creating a Transaction:** Initialize the `Transaction` or `ClusterTransaction` object.
```python
transaction = Transaction()  # For standalone mode
cluster_transaction = ClusterTransaction()  # For cluster mode
```
**Adding Commands:** Use the transaction object to queue up the desired commands.
```python
transaction.set("key", "value")
transaction.get("key")
```
**Executing the Transaction:** Use the `exec` method of the Valkey Glide client to execute the transaction.
```python
await client.exec(transaction)
```

**Handling Results:** The result of the transaction execution will be a list of responses corresponding to each command in the transaction.
```python
result = await client.exec(transaction)
print(result)  # Output: [OK, 'value']
```