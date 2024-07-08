## Client Initialization

Valkey GLIDE provides support for both [Cluster](https://github.com/valkey-io/valkey-glide/wiki/Java-wrapper#cluster) and [Standalone](https://github.com/valkey-io/valkey-glide/wiki/Java-wrapper#standalone) and configurations. Please refer to the relevant section based on your specific setup.

### Cluster

Valkey GLIDE supports [Cluster](https://valkey.io/docs/topics/cluster-spec) deployments, where the database is partitioned across multiple primary shards, with each shard being represented by a primary node and zero or more replica nodes.

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

GlideClusterClient clusterClient = GlideClusterClient.CreateClient(config).get();
```

#### Request Routing

In the cluster, data is divided into slots, and each primary node within the cluster is responsible for specific slots. Valkey GLIDE adheres to [Valkey OSS guidelines](https://valkey.io/docs/topics/command-tips/#:~:text=_script%20flag.-,request_policy,-This%20tip%20can) when determining the node(s) to which a command should be sent in clustering mode. 

For more details on the routing of specific commands, please refer to [the documentation within the code](https://github.com/valkey-io/valkey-glide/blob/main/java/client/src/main/java/glide/api/models/configuration/RequestRoutingConfiguration.java) for routing configuration.

#### Response Aggregation

When requests are dispatched to multiple shards in a cluster (as discussed in the Request routing section), the client needs to aggregate the responses for a given command. Valkey GLIDE follows [Valkey OSS guidelines](https://valkey.io/docs/topics/command-tips/#:~:text=the%20SCAN%20command.-,response_policy,-This%20tip%20can) for determining how to aggregate the responses from multiple shards within a cluster. 

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

GlideClient standaloneClient = GlideClient.CreateClient(config).get();
```

## Valkey Commands

For information on the supported commands and their corresponding parameters, we recommend referring to [the documentation in the code](https://github.com/valkey-io/valkey-glide/tree/main/java/client/src/main/java/glide/api/commands). This documentation provides in-depth insights into the usage and options available for each command.

## Advanced Configuration Settings

### Authentication

By default, when connecting to Valkey, Valkey GLIDEs operates in an unauthenticated mode.

Valkey GLIDE also offers support for an authenticated connection mode. 

In authenticated mode, you have the following options:

* Use both a username and password, which is recommended and configured through [ACLs](https://valkey.io/docs/topics/acl/) on the server.
* Use a password only, which is applicable if the server is configured with the [requirepass](https://valkey.io/docs/topics/security/#:~:text=all%20the%20interfaces.-,Authentication,-Valkey%20provides%20two) setting.

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

GlideClusterClient client = GlideClusterClient.CreateClient(config).get();
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

GlideClient client = GlideClient.CreateClient(config).get();
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

GlideClusterClient client = GlideClusterClient.CreateClient(config).get();
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

GlideClient client = GlideClient.CreateClient(config).get();
```

### Read Strategy

By default, Valkey GLIDE directs read commands to the primary node that owns a specific slot. For applications that prioritize read throughput and can tolerate possibly stale data, Valkey GLIDE provides the flexibility to route reads to replica nodes.

Valkey GLIDE provides support for next read strategies, allowing you to choose the one that best fits your specific use case.

|Strategy	|Description	|
|---	|---	|
|`PRIMARY`	|Always read from primary, in order to get the freshest data.	|
|`PREFER_REPLICA`	|Spread requests between all replicas in a round robin manner. If no replica is available, route the requests to the primary.	|

#### Example - Use PREFER_REPLICA Read Strategy

```java
GlideClusterClientConfiguration config = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("address.example.com")
        .port(6379)
        .build())
    .readFrom(ReadFrom.PREFER_REPLICA)
    .build()
GlideClusterClient client = GlidesClusterClient.CreateClient(config).get();

client.set("key1", "val1").get();

/// get will read from one of the replicas
client.get("key1").get();
```

### Timeouts and Reconnect Strategy

Valkey GLIDE allows you to configure timeout settings and reconnect strategies. These configurations can be applied through the [`GlideClusterClientConfiguration`](https://github.com/valkey-io/valkey-glide/blob/main/java/client/src/main/java/glide/api/models/configuration/GlideClusterClientConfiguration.java) and [`GlideClientConfiguration`](https://github.com/valkey-io/valkey-glide/blob/main/java/client/src/main/java/glide/api/models/configuration/GlideClientConfiguration.java) parameters.


|Configuration setting	|Description	|**Default value**	|
|---	|---	|---	|
|requestTimeout	|This specified time duration, measured in milliseconds, represents the period during which the client will await the completion of a request. This time frame includes the process of sending the request, waiting for a response from the Redis node(s), and any necessary reconnection or retry attempts. If a pending request exceeds the specified timeout, it will trigger a timeout error. If no timeout value is explicitly set, a default value will be employed.	|250 milliseconds	|
|reconnectStrategy	|The reconnection strategy defines how and when reconnection attempts are made in the event of connection failures.	|Exponential backoff	|


#### Example - Setting Increased Request Timeout for Long-Running Commands

```java
GlideClusterClient config = GlideClusterClientConfiguration.builder()
    .address(NodeAddress.builder()
        .host("address.example.com")
        .port(6379).build())
    .requestTimeout(500)
    .build();

GlideClusterClient client = GlideClusterClient.CreateClient(config).get();
```