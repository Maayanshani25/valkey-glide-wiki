## Client Initialization

Valkey GLIDE provides support for both [Cluster](https://github.com/valkey-io/valkey-glide/wiki/NodeJS-wrapper#cluster) and [Standalone](https://github.com/valkey-io/valkey-glide/wiki/NodeJS-wrapper#standalone) and configurations. Please refer to the relevant section based on your specific setup.

### Cluster

Valkey GLIDE supports [Cluster](https://valkey.io/topics/cluster-spec) deployments, where the database is partitioned across multiple primary shards, with each shard being represented by a primary node and zero or more replica nodes.


To initialize a `GlideClusterClient`, you need to provide a `GlideClusterClientConfiguration` that includes the addresses of initial seed nodes. Valkey GLIDE automatically discovers the entire cluster topology, eliminating the necessity of explicitly listing all cluster nodes.

#### **Connecting to a Cluster**

The `NodeAddress` class represents the host and port of a cluster node. The host can be either an IP address, a hostname, or a fully qualified domain name (FQDN).

#### Example - Connecting to a cluster

```typescript
const addresses = [
    {
        host: "address.example.com",
        port: 6379
    }
];

const client = await GlideClusterClient.createClient({
    addresses: addresses
});
```

#### Request Routing

In the cluster, data is divided into slots, and each primary node within the cluster is responsible for specific slots. Valkey GLIDE adheres to [Valkey OSS guidelines](https://valkey.io/topics/command-tips/#request-policy) when determining the node(s) to which a command should be sent in clustering mode. 

For more details on the routing of specific commands, please refer to the documentation within the code.

#### Response Aggregation

When requests are dispatched to multiple shards in a cluster (as discussed in the Request routing section), the client needs to aggregate the responses for a given command. Valkey GLIDE follows [Valkey OSS guidelines](https://valkey.io/topics/command-tips/#response-policy) for determining how to aggregate the responses from multiple shards within a cluster. 

To learn more about response aggregation for specific commands, please refer to the documentation within the code.

#### Topology Updates

The cluster's topology can change over time. New nodes can be added or removed, and the primary node owning a specific slot may change. GLIDE for Redis is designed to automatically rediscover the topology whenever Redis indicates a change in slot ownership. This ensures that the GLIDE for Redis client stays in sync with the cluster's topology.

### Standalone 

Valkey GLIDE also supports Standalone deployments, where the database is hosted on a single primary node, optionally with replica nodes. To initialize a `GlideClient` for a standalone setup, you should create a `GlideClientConfiguration` that includes the addresses of primary and all replica nodes.

#### **Example - Connecting to a standalone Redis** 

```typescript
const addresses = [
    {
        host: "primary.example.com",
        port: 6379
    },
    {
        host: "replica1.example.com",
        port: 6379
    },
    {
        host: "replica2.example.com",
        port: 6379
    },
];

const client = await GlideClient.createClient({
    addresses: addresses
});
```

## Valkey commands
For information on the supported commands and their corresponding parameters, we recommend referring to the documentation in the code. This documentation provides in-depth insights into the usage and options available for each command.

## Advanced Configuration Settings

### Authentication

By default, when connecting to Valkey, Valkey GLIDEs operates in an unauthenticated mode.

Valkey GLIDE also offers support for an authenticated connection mode. 

In authenticated mode, you have the following options:

* Use both a username and password, which is recommended and configured through [ACLs](https://valkey.io/topics/acl/) on the server.
* Use a password only, which is applicable if the server is configured with the [requirepass](https://valkey.io/topics/security/#authentication) setting.

To provide the necessary authentication credentials to the client, you can use the `ServerCredentials` class.

#### Example - Connecting with Username and Password to a Cluster

```typescript
const addresses = [
    {
        host: "address.example.com",
        port: 6379
    }
];

const credentials = {
    username: "user1",
    password: "passwordA"
};

const client = await GlideClusterClient.createClient({
    addresses: addresses,
    credentials: credentials
});
```


#### Example - Connecting with Username and Password to a Standalone server

```typescript
const addresses = [
    {
        host: "address.example.com",
        port: 6379
    }
];

const credentials = {
    username: "user1",
    password: "passwordA"
};

const client = await GlideClient.createClient({
    addresses: addresses,
    credentials: credentials
});
```

### TLS

Valkey GLIDE supports secure TLS connections to a data store.

It's important to note that TLS support in Valkey GLIDE relies on [rusttls](https://github.com/rustls/rustls). Currently, Valkey GLIDE employs the default rustls settings with no option for customization.

#### Example - Connecting with TLS Mode Enabled to a Cluster

```typescript
const addresses = [
    {
        host: "address.example.com",
        port: 6379
    }
];

const client = await GlideClusterClient.createClient({
    addresses: addresses,
    useTLS: true
});
```
#### Example - Connecting with TLS Mode Enabled to a Redis Standalone

```typescript
const addresses = [
    {
        host: "address.example.com",
        port: 6379
    }
];

const client = await GlideClient.createClient({
    addresses: addresses,
    useTLS: true
});
```

### Read Strategy

By default, Valkey GLIDE directs read commands to the primary node that owns a specific slot. For applications that prioritize read throughput and can tolerate possibly stale data, Valkey GLIDE provides the flexibility to route reads to replica nodes.

Valkey GLIDE provides support for next read strategies, allowing you to choose the one that best fits your specific use case.

|Strategy	|Description	|
|---	|---	|
|`primary`	|Always read from primary, in order to get the freshest data	|
|`preferReplica`	|Spread requests between all replicas in a round robin manner. If no replica is available, route the requests to the primary	|

#### Example - Use preferReplica Read Strategy

```typescript
const addresses = [
    {
        host: "address.example.com",
        port: 6379
    }
];

const client = await GlideClusterClient.createClient({
    addresses: addresses,
    readFrom: "preferReplica"
});
await client.set("key1", "val1");
/// get will read from one of the replicas
await client.get("key1");
```

### Timeouts and Reconnect Strategy

Valkey GLIDE allows you to configure timeout settings and reconnect strategies. These configurations can be applied through the `GlideClusterClientConfiguration` and `GlideClientConfiguration` parameters.


|Configuration setting	|Description	|**Default value**	|
|---	|---	|---	|
|requestTimeout	|This specified time duration, measured in milliseconds, represents the period during which the client will await the completion of a request. This time frame includes the process of sending the request, waiting for a response from the Redis node(s), and any necessary reconnection or retry attempts. If a pending request exceeds the specified timeout, it will trigger a timeout error. If no timeout value is explicitly set, a default value will be employed.	|250 milliseconds	|
|connectionBackoff	|The reconnection strategy defines how and when reconnection attempts are made in the event of connection failures	|Exponential backoff	|


#### Example - Setting Increased Request Timeout for Long-Running Commands

```typescript
const addresses = [
    {
        host: "address.example.com",
        port: 6379
    }
];

const client = await GlideClusterClient.createClient({
    addresses: addresses,
    requestTimeout: 500
});
```