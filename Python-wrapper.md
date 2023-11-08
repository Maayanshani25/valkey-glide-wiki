# Python wrapper
## Client Initialization
Babushka provides support for both  Redis Standalone and Redis Cluster configurations. Please refer to the relevant section based on your specific setup.

### Redis Cluster
Babushka supports Redis Cluster deployments, where the Redis database is partitioned across multiple primary Redis shards, with each shard being represented by a primary node and zero or more replica nodes.

To initialize a RedisClusterClient, you need to provide a ClusterClientConfiguration that includes the addresses of initial seed nodes. Babushka automatically discovers the entire cluster topology, eliminating the necessity of explicitly listing all cluster nodes.

#### Connecting to the Cluster

The ServerAddress class represents the host and port of a Redis node. The host can be either an IP address, a hostname, or a fully qualified domain name (FQDN).

#### Request Routing

In the Redis cluster, data is divided into slots, and each primary node within the cluster is responsible for specific slots. Babushka adheres to [Redis OSS guidelines](https://redis.io/docs/reference/command-tips/#request_policy) when determining the node(s) to which a command should be sent in clustering mode. 

For more details on the routing of specific commands, please refer to the documentation within the code.

#### Response Aggregation

When requests are dispatched to multiple shards in a cluster (as discussed in the "Request routing" section), the Redis client needs to aggregate the responses for a given command. Babushka follows [Redis OSS guidelines](https://redis.io/docs/reference/command-tips/#response_policy) for determining how to aggregate the responses from multiple shards within a cluster. 

To learn more about response aggregation for specific commands, consult the documentation embedded in the code.

#### Topology Updates

The cluster's topology can change over time. New nodes can be added or removed, and the primary node responsible for a specific slot may change. Babushka is designed to automatically rediscover the topology whenever Redis indicates a change in slot ownership. This ensures that the Babushka client stays in sync with the cluster's topology.

### Redis Standalone 

Babushka also supports Redis Standalone deployments, where the Redis database is hosted on a single primary node, optionally with replica nodes. To initialize a RedisClient  for a standalone Redis setup, you should create a RedisClientConfiguration that includes the addresses of all endpoints, both primary and replica nodes.

## Advanced Options / Usage

### Authentication

By default, when connecting to Redis, Babushka operates in an unauthenticated mode.

Babushka also offers support for an authenticated connection mode. 

In authenticated mode, you have the following options:
* Use both a username and password, which is recommended and configured through [ACLs](https://redis.io/docs/management/security/acl) on the Redis server.
* Use a password only, which is applicable if Redis is configured with the [requirepass](https://redis.io/docs/management/security/#authentication) setting.

To provide the necessary authentication credentials to the client, you can use the RedisCredentials class.

### TLS

Babushka supports secure TLS connections to a Redis data store.

It's important to note that TLS support in Babushka relies on [rusttls](https://github.com/rustls/rustls). Currently, Babushka employs the default rustls settings with no option for customization.

### Read Strategy

By default, Babushka directs read commands to the primary node responsible for a specific slot. This ensures read-after-write consistency when reading from primaries. For applications that do not necessitate read-after-write consistency and seek to enhance read throughput, it is possible to route reads to replica nodes.


Babushka provides support for various read strategies, allowing you to choose the one that best fits your specific use case.
