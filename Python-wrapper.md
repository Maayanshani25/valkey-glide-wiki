## Client Initialization

Valkey GLIDE provides support for both [Cluster](https://github.com/valkey-io/valkey-glide/wiki/Python-wrapper#cluster) and [Standalone](https://github.com/valkey-io/valkey-glide/wiki/Python-wrapper#standalone) configurations. Please refer to the relevant section based on your specific setup.

### Cluster

Valkey GLIDE supports [Cluster](https://valkey.io/topics/cluster-spec) deployments, where the database is partitioned across multiple primary shards, with each shard being represented by a primary node and zero or more replica nodes.


To initialize a `GlideClusterClient`, you need to provide a `GlideClusterClientConfiguration` that includes the addresses of initial seed nodes. Valkey GLIDE automatically discovers the entire cluster topology, eliminating the necessity of explicitly listing all cluster nodes.

#### **Connecting to a Cluster**

The `NodeAddress` class represents the host and port of a cluster node. The host can be either an IP address, a hostname, or a fully qualified domain name (FQDN).

#### Example - Connecting to a cluster

```python
from glide import (
    GlideClusterClient,
    GlideClusterClientConfiguration,
    NodeAddress
)

addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses)

client = await GlideClusterClient.create(client_config)
```

#### Request Routing

In the cluster, data is divided into slots, and each primary node within the cluster is responsible for specific slots. Valkey GLIDE adheres to [Valkey OSS guidelines](https://valkey.io/topics/command-tips/#request-policy) when determining the node(s) to which a command should be sent in clustering mode. 

For more details on the routing of specific commands, please refer to the documentation within the code.

#### Response Aggregation

When requests are dispatched to multiple shards in a cluster (as discussed in the Request routing section), the client needs to aggregate the responses for a given command. Valkey GLIDE follows [Valkey OSS guidelines](https://valkey.io/topics/command-tips/#response-policy) for determining how to aggregate the responses from multiple shards within a cluster. 

To learn more about response aggregation for specific commands, please refer to the documentation within the code.

#### Topology Updates

The cluster's topology can change over time. New nodes can be added or removed, and the primary node owning a specific slot may change. Valkey GLIDE is designed to automatically rediscover the topology whenever the server indicates a change in slot ownership. This ensures that the Valkey GLIDE client stays in sync with the cluster's topology.

### Standalone 

Valkey GLIDE also supports Standalone deployments, where the database is hosted on a single primary node, optionally with replica nodes. To initialize a `GlideClient` for a standalone setup, you should create a `GlideClientConfiguration` that includes the addresses of primary and all replica nodes.

#### **Example - Connecting to a standalone** 

```python
from glide import (
    GlideClient,
    GlideClientConfiguration,
    NodeAddress
)

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

```python
from glide import Transaction

# Initialize a transaction object
transaction = Transaction()

# Add commands to the transaction
transaction.set("key", "value")
transaction.select(1)  # Standalone command
transaction.get("key")

# Execute the transaction
result = await client.exec(transaction)
print(result) # Output: [OK, OK, None]
```

#### Command Chaining

Valkey Glide supports command chaining within a transaction, allowing for a more concise and readable code. Here's how you can use chaining in transactions:

```python
from glide import ClusterTransaction

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

## Advanced Configuration Settings

### Authentication

By default, when connecting to Valkey, Valkey GLIDEs operates in an unauthenticated mode.

Valkey GLIDE also offers support for an authenticated connection mode. 

In authenticated mode, you have the following options:

* Use both a username and password, which is recommended and configured through [ACLs](https://valkey.io/topics/acl/) on the server.
* Use a password only, which is applicable if the server is configured with the [requirepass](https://valkey.io/topics/security/#authentication) setting.

To provide the necessary authentication credentials to the client, you can use the `ServerCredentials` class.

#### Example - Connecting with Username and Password to a Cluster

```python
from glide import (
    GlideClusterClient,
    GlideClusterClientConfiguration,
    ServerCredentials,
    NodeAddress
)

addresses = [NodeAddress(host="address.example.com", port=6379)]
credentials = ServerCredentials("passwordA", "user1")
client_config = GlideClusterClientConfiguration(addresses, credentials=credentials)

client = await GlideClusterClient.create(client_config)
```


#### Example - Connecting with Username and Password to a Standalone server

```python
from glide import (
    GlideClient,
    GlideClientConfiguration,
    ServerCredentials,
    NodeAddress
)

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
from glide import (
    GlideClusterClient,
    GlideClusterClientConfiguration,
    NodeAddress
)

addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses, use_tls=True)

client = await GlideClusterClient.create(client_config)
```
#### Example - Connecting with TLS Mode Enabled to a Standalone server

```python
from glide import (
    GlideClient,
    GlideClientConfiguration,
    NodeAddress
)

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
|`AZ_AFFINITY`	|Spread the read requests between replicas in the same client's availability zone in a round robin manner, falling back to other replicas or the primary if needed.	|
|`AZ_AFFINITY_REPLICAS_AND_PRIMARY`	|Spread the read requests among nodes within the client's availability zone in a round robin manner, prioritizing local replicas, then the local primary, and falling back to other replicas or the primary if needed.	|

#### Example - Use PREFER_REPLICA Read Strategy

```python
from glide import (
    GlideClusterClient,
    GlideClusterClientConfiguration,
    NodeAddress,
    ReadFrom
)

addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses, read_from=ReadFrom.PREFER_REPLICA)

client = await GlideClusterClient.create(client_config)
await client.set("key1", "val1")
# get will read from one of the replicas
await client.get("key1")
```

#### Example - Use AZ_AFFINITY Read Strategy
If ReadFrom strategy is AZ_AFFINITY, 'client_az' setting is required to ensures that readonly commands are directed to replicas within the specified AZ if exits.

```python
from glide import (
    GlideClusterClient,
    GlideClusterClientConfiguration,
    NodeAddress,
    ReadFrom
)

addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses, read_from=ReadFrom.AZ_AFFINITY, client_az="us-east-1a")

client = await GlideClusterClient.create(client_config)
await client.set("key1", "val1")
# get will read from one of the replicas in the same client's availability zone if exits.
await client.get("key1")
```

#### Example - Use AZ_AFFINITY_REPLICAS_AND_PRIMARY Read Strategy
If ReadFrom strategy is AZ_AFFINITY_REPLICAS_AND_PRIMARY, 'client_az' setting is required to ensures that readonly commands are directed to replicas or primary within the specified AZ if exits.

```python
from glide import (
    GlideClusterClient,
    GlideClusterClientConfiguration,
    NodeAddress,
    ReadFrom
)

addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses, read_from=ReadFrom.AZ_AFFINITY_REPLICAS_AND_PRIMARY, client_az="us-east-1a")

client = await GlideClusterClient.create(client_config)
await client.set("key1", "val1")
# get will read from one of the replicas or the primary in the same client's availability zone if exits.
await client.get("key1")
```

### Timeouts and Reconnect Strategy

Valkey GLIDE allows you to configure timeout settings and reconnect strategies. These configurations can be applied through the `GlideClusterClientConfiguration` and `GlideClientConfiguration` parameters.


|Configuration setting	|Description	|**Default value**	|
|---	|---	|---	|
|request_timeout	|This specified time duration, measured in milliseconds, represents the period during which the client will await the completion of a request. This time frame includes the process of sending the request, waiting for a response from the node(s), and any necessary reconnection or retry attempts. If a pending request exceeds the specified timeout, it will trigger a timeout error. If no timeout value is explicitly set, a default value will be employed.	|250 milliseconds	|
|reconnect_strategy	|The reconnection strategy defines how and when reconnection attempts are made in the event of connection failures	|Exponential backoff	|


#### Example - Setting Increased Request Timeout for Long-Running Commands

```python
from glide import (
    GlideClient,
    GlideClusterClientConfiguration,
    GlideClusterClient
)

addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses, request_timeout=500)

client = await GlideClusterClient.create(client_config)
```

### Tracking resources

GLIDE 1.2 introduces a new NONE Valkey API: `getStatistics` which returns a `Dict` with (currently) 2 properties (available for both `GlideClient` & `GlideClusterClient`):

- `total_connections` contains the number of active connections across **all** clients
- `total_clients` contains the number of active clients (regardless of its type)

```python
from glide import (
    NodeAddress,
    GlideClusterClientConfiguration,
    GlideClusterClient
)

addresses = [NodeAddress(host="address.example.com", port=6379)]
client_config = GlideClusterClientConfiguration(addresses, request_timeout=500)

client = await GlideClusterClient.create(client_config)

# Retrieve statistics
stats = await client.get_statistics()

# Example: Accessing and printing statistics
print(f"Total Connections: {stats['total_connections']}")
print(f"Total Clients: {stats['total_clients']}")
```