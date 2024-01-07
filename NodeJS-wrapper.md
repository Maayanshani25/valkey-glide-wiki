## Client Initialization

Babushka provides support for both [Redis Cluster](https://github.com/aws/babushka/wiki/NodeJS-wrapper#redis-cluster) and [Redis Standalone](https://github.com/aws/babushka/wiki/NodeJS-wrapper#redis-standalone) and configurations. Please refer to the relevant section based on your specific setup.

### Redis Cluster

Babushka supports [Redis Cluster](https://redis.io/docs/reference/cluster-spec) deployments, where the Redis database is partitioned across multiple primary Redis shards, with each shard being represented by a primary node and zero or more replica nodes.. 


To initialize a `RedisClusterClient`, you need to provide a `ClusterClientConfiguration` that includes the addresses of initial seed nodes. Babushka automatically discovers the entire cluster topology, eliminating the necessity of explicitly listing all cluster nodes.

#### **Connecting to a Cluster**

The `NodeAddress` class represents the host and port of a Redis node. The host can be either an IP address, a hostname, or a fully qualified domain name (FQDN).

#### Example - Connecting to a Redis cluster

```typescript
const addresses = [
    {
        host: "redis.example.com",
        port: 6379
    }
];

const client = await RedisClusterClient.createClient({
    addresses: addresses
});
```

#### Request Routing

In the Redis cluster, data is divided into slots, and each primary node within the cluster is responsible for specific slots. Babushka adheres to [Redis OSS guidelines](https://redis.io/docs/reference/command-tips/#request_policy) when determining the node(s) to which a command should be sent in clustering mode. 

For more details on the routing of specific commands, please refer to the documentation within the code.

#### Response Aggregation

When requests are dispatched to multiple shards in a cluster (as discussed in the Request routing section), the Redis client needs to aggregate the responses for a given command. Babushka follows [Redis OSS guidelines](https://redis.io/docs/reference/command-tips/#response_policy) for determining how to aggregate the responses from multiple shards within a cluster. 

To learn more about response aggregation for specific commands, please refer to the documentation within the code.

#### Topology Updates

The cluster's topology can change over time. New nodes can be added or removed, and the primary node owning a specific slot may change. Babushka is designed to automatically rediscover the topology whenever Redis indicates a change in slot ownership. This ensures that the Babushka client stays in sync with the cluster's topology.

### Redis Standalone 

Babushka also supports Redis Standalone deployments, where the Redis database is hosted on a single primary node, optionally with replica nodes. To initialize a `RedisClient`  for a standalone Redis setup, you should create a `RedisClientConfiguration` that includes the addresses of primary and all replica nodes.

#### **Example - Connecting to a standalone Redis** 

```typescript
const addresses = [
    {
        host: "redis_primary.example.com",
        port: 6379
    },
    {
        host: "redis_replica1.example.com",
        port: 6379
    },
    {
        host: "redis_replica2.example.com",
        port: 6379
    },
];

const client = await RedisClient.createClient({
    addresses: addresses
});
```

## Redis commands
For information on the supported commands and their corresponding parameters, we recommend referring to the documentation in the code. This documentation provides in-depth insights into the usage and options available for each command.

## Advanced Configuration Settings

### Authentication

By default, when connecting to Redis, Babushka operates in an unauthenticated mode.

Babushka also offers support for an authenticated connection mode. 

In authenticated mode, you have the following options:

* Use both a username and password, which is recommended and configured through [ACLs](https://redis.io/docs/management/security/acl) on the Redis server.
* Use a password only, which is applicable if Redis is configured with the [requirepass](https://redis.io/docs/management/security/#authentication) setting.

To provide the necessary authentication credentials to the client, you can use the `RedisCredentials` class.

#### Example - Connecting with Username and Password to a Redis Cluster

```typescript
const addresses = [
    {
        host: "redis.example.com",
        port: 6379
    }
];

const credentials = {
    username: "user1",
    password: "passwordA"
};

const client = await RedisClusterClient.createClient({
    addresses: addresses,
    credentials: credentials
});
```


#### Example - Connecting with Username and Password to a Redis Standalone

```typescript
const addresses = [
    {
        host: "redis.example.com",
        port: 6379
    }
];

const credentials = {
    username: "user1",
    password: "passwordA"
};

const client = await RedisClient.createClient({
    addresses: addresses,
    credentials: credentials
});
```

### TLS

Babushka supports secure TLS connections to a Redis data store.

It's important to note that TLS support in Babushka relies on [rusttls](https://github.com/rustls/rustls). Currently, Babushka employs the default rustls settings with no option for customization.

#### Example - Connecting with TLS Mode Enabled to a Redis Cluster

```typescript
const addresses = [
    {
        host: "redis.example.com",
        port: 6379
    }
];

const client = await RedisClusterClient.createClient({
    addresses: addresses,
    useTLS: true
});
```
#### Example - Connecting with TLS Mode Enabled to a Redis Standalone

```typescript
const addresses = [
    {
        host: "redis.example.com",
        port: 6379
    }
];

const client = await RedisClient.createClient({
    addresses: addresses,
    useTLS: true
});
```

### Read Strategy

By default, Babushka directs read commands to the primary node that owns a specific slot. For applications that prioritize read throughput and can tolerate possibly stale data, Babushka provides the flexibility to route reads to replica nodes.

Babushka provides support for next read strategies, allowing you to choose the one that best fits your specific use case.

|Strategy	|Description	|
|---	|---	|
|`primary`	|Always read from primary, in order to get the freshest data	|
|`preferReplica`	|Spread requests between all replicas in a round robin manner. If no replica is available, route the requests to the primary	|

#### Example - Use preferReplica Read Strategy

```typescript
const addresses = [
    {
        host: "redis.example.com",
        port: 6379
    }
];

const client = await RedisClusterClient.createClient({
    addresses: addresses,
    readFrom: "preferReplica"
});
await client.set("key1", "val1");
/// get will read from one of the replicas
await client.get("key1");
```

### Timeouts and Reconnect Strategy

Babushka allows you to configure timeout settings and reconnect strategies. These configurations can be applied through the `ClusterClientConfiguration` and `RedisClientConfiguration` parameters.


|Configuration setting	|Description	|**Default value**	|
|---	|---	|---	|
|requestTimeout	|This specified time duration, measured in milliseconds, represents the period during which the client will await the completion of a request. This time frame includes the process of sending the request, waiting for a response from the Redis node(s), and any necessary reconnection or retry attempts. If a pending request exceeds the specified timeout, it will trigger a timeout error. If no timeout value is explicitly set, a default value will be employed.	|250 milliseconds	|
|connectionBackoff	|The reconnection strategy defines how and when reconnection attempts are made in the event of connection failures	|Exponential backoff	|

**Notes:**
1. In the case of Redis Standalone, the only reconnect strategy currently supported is exponential backoff.
2. Regarding Redis Cluster, an exponential backoff strategy is **currently in the process of being developed**. In the event of a disconnection, a single reconnect attempt is initiated per request.

#### Example - Setting Increased Request Timeout for Long-Running Commands

```typescript
const addresses = [
    {
        host: "redis.example.com",
        port: 6379
    }
];

const client = await RedisClusterClient.createClient({
    addresses: addresses,
    requestTimeout: 500
});
```