## Client Initialization

GLIDE for Redis provides support for both [Redis Cluster](https://github.com/aws/glide-for-redis/wiki/Java-wrapper#redis-cluster) and [Redis Standalone](https://github.com/aws/glide-for-redis/wiki/Java-wrapper#redis-standalone) and configurations. Please refer to the relevant section based on your specific setup.

### Redis Cluster

GLIDE for Redis supports [Redis Cluster](https://redis.io/docs/reference/cluster-spec) deployments, where the Redis database is partitioned across multiple primary Redis shards, with each shard being represented by a primary node and zero or more replica nodes.. 


To initialize a `RedisClusterClient`, you need to provide a `RedisClusterClientConfiguration` that includes the addresses of initial seed nodes. GLIDE for Redis automatically discovers the entire cluster topology, eliminating the necessity of explicitly listing all cluster nodes.

#### **Connecting to a Cluster**

The `NodeAddress` class represents the host and port of a Redis node. The host can be either an IP address, a hostname, or a fully qualified domain name (FQDN).

#### Example - Connecting to a Redis cluster

```java
RedisClusterClient clusterClient =
        RedisClusterClient.CreateClient(
                        RedisClusterClientConfiguration.builder()
                                .address(NodeAddress.builder().host("redis.example.com").port(6379).build())
                                .build())
                .get();
});
```

#### Request Routing

In the Redis cluster, data is divided into slots, and each primary node within the cluster is responsible for specific slots. GLIDE for Redis adheres to [Redis OSS guidelines](https://redis.io/docs/reference/command-tips/#request_policy) when determining the node(s) to which a command should be sent in clustering mode. 

For more details on the routing of specific commands, please refer to the documentation within the code.

#### Response Aggregation

When requests are dispatched to multiple shards in a cluster (as discussed in the Request routing section), the Redis client needs to aggregate the responses for a given command. GLIDE for Redis follows [Redis OSS guidelines](https://redis.io/docs/reference/command-tips/#response_policy) for determining how to aggregate the responses from multiple shards within a cluster. 

To learn more about response aggregation for specific commands, please refer to the documentation within the code.

#### Topology Updates

The cluster's topology can change over time. New nodes can be added or removed, and the primary node owning a specific slot may change. GLIDE for Redis is designed to automatically rediscover the topology whenever Redis indicates a change in slot ownership. This ensures that the GLIDE for Redis client stays in sync with the cluster's topology.

### Redis Standalone 

GLIDE for Redis also supports Redis Standalone deployments, where the Redis database is hosted on a single primary node, optionally with replica nodes. To initialize a `RedisClient`  for a standalone Redis setup, you should create a `RedisClientConfiguration` that includes the addresses of primary and all replica nodes.

#### **Example - Connecting to a standalone Redis** 

```java
RedisClient standaloneClient =
        RedisClient.CreateClient(
                        RedisClientConfiguration.builder()
                                .address(NodeAddress.builder().host("redis_primary.example.com").port(6379).build())
                                .address(NodeAddress.builder().host("redis_replica1.example.com").port(6379).build())
                                .address(NodeAddress.builder().host("redis_replica2.example.com").port(6379).build())
                                .build())
                .get();
```

## Redis commands
For information on the supported commands and their corresponding parameters, we recommend referring to the documentation in the code. This documentation provides in-depth insights into the usage and options available for each command.

## Advanced Configuration Settings

### Authentication

By default, when connecting to Redis, GLIDE for Redis operates in an unauthenticated mode.

GLIDE for Redis also offers support for an authenticated connection mode. 

In authenticated mode, you have the following options:

* Use both a username and password, which is recommended and configured through [ACLs](https://redis.io/docs/management/security/acl) on the Redis server.
* Use a password only, which is applicable if Redis is configured with the [requirepass](https://redis.io/docs/management/security/#authentication) setting.

To provide the necessary authentication credentials to the client, you can use the `RedisCredentials` class.

#### Example - Connecting with Username and Password to a Redis Cluster

```java
RedisClusterClient client =
        RedisClusterClient.CreateClient(
                        RedisClusterClientConfiguration.builder()
                                .address(NodeAddress.builder().host("redis.example.com").port(6379).build())
                                .credentials(RedisCredentials.builder().username("user1").password("passwordA").build())
                                .build())
                .get();
```


#### Example - Connecting with Username and Password to a Redis Standalone

```java
RedisClient client =
    RedisClient.CreateClient(
            RedisClientConfiguration.builder()
                .address(NodeAddress.builder().host("redis.example.com").port(6379).build())
                .credentials(RedisCredentials.builder().username("user1").password("passwordA").build())
                .build())
        .get();
```

### TLS

GLIDE for Redis supports secure TLS connections to a Redis data store.

It's important to note that TLS support in GLIDE for Redis relies on [rusttls](https://github.com/rustls/rustls). Currently, GLIDE for Redis employs the default rustls settings with no option for customization.

#### Example - Connecting with TLS Mode Enabled to a Redis Cluster

```java
RedisClusterClient client =
        RedisClusterClient.CreateClient(
                        RedisClusterClientConfiguration.builder()
                                .address(NodeAddress.builder().host("redis.example.com").port(6379).build())
                                .useTLS(true)
                                .build())
                .get();
```
#### Example - Connecting with TLS Mode Enabled to a Redis Standalone

```java
RedisClient client =
    RedisClient.CreateClient(
            RedisClientConfiguration.builder()
                .address(NodeAddress.builder().host("redis.example.com").port(6379).build())
                .useTLS(true)
                .build())
        .get();
```

### Read Strategy

By default, GLIDE for Redis directs read commands to the primary node that owns a specific slot. For applications that prioritize read throughput and can tolerate possibly stale data, GLIDE for Redis provides the flexibility to route reads to replica nodes.

GLIDE for Redis provides support for next read strategies, allowing you to choose the one that best fits your specific use case.

|Strategy	|Description	|
|---	|---	|
|`PRIMARY`	|Always read from primary, in order to get the freshest data	|
|`PREFER_REPLICA`	|Spread requests between all replicas in a round robin manner. If no replica is available, route the requests to the primary	|

#### Example - Use PREFER_REPLICA Read Strategy

```java
RedisClusterClient client =
    RedisClusterClient.CreateClient(
            RedisClusterClientConfiguration.builder()
                .address(NodeAddress.builder().host("redis.example.com").port(6379).build())
                .readFrom(ReadFrom.PREFER_REPLICA)
                .build())
        .get();
client.set("key1", "val1").get();
/// get will read from one of the replicas
client.get("key1").get();
```

### Timeouts and Reconnect Strategy

GLIDE for Redis allows you to configure timeout settings and reconnect strategies. These configurations can be applied through the `RedisClusterClientConfiguration` and `RedisClientConfiguration` parameters.


|Configuration setting	|Description	|**Default value**	|
|---	|---	|---	|
|requestTimeout	|This specified time duration, measured in milliseconds, represents the period during which the client will await the completion of a request. This time frame includes the process of sending the request, waiting for a response from the Redis node(s), and any necessary reconnection or retry attempts. If a pending request exceeds the specified timeout, it will trigger a timeout error. If no timeout value is explicitly set, a default value will be employed.	|250 milliseconds	|
|reconnectStrategy	|The reconnection strategy defines how and when reconnection attempts are made in the event of connection failures	|Exponential backoff	|

**Notes:**
1. In the case of Redis Standalone, the only reconnect strategy currently supported is exponential backoff.
2. Regarding Redis Cluster, an exponential backoff strategy is **currently in the process of being developed**. In the event of a disconnection, a single reconnect attempt is initiated per request.

#### Example - Setting Increased Request Timeout for Long-Running Commands

```java
RedisClusterClient client =
    RedisClusterClient.CreateClient(
            RedisClusterClientConfiguration.builder()
                .address(NodeAddress.builder().host("redis.example.com").port(6379).build())
                .requestTimeout(500)
                .build())
        .get();
```