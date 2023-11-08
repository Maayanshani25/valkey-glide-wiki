# Python wrapper
## Client Initialization
Babushka provides support for both  Redis Standalone and Redis Clusterconfigurations. Please refer to the relevant section based on your specific setup.

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