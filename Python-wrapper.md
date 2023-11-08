# Python wrapper
## Client Initialization
Babushka provides support for both  Redis Standalone and Redis Clusterconfigurations. Please refer to the relevant section based on your specific setup.

### Redis Cluster
Babushka supports Redis Cluster deployments, where the Redis database is partitioned across multiple primary Redis shards, with each shard being represented by a primary node and zero or more replica nodes.

To initialize a RedisClusterClient, you need to provide a ClusterClientConfiguration that includes the addresses of initial seed nodes. Babushka automatically discovers the entire cluster topology, eliminating the necessity of explicitly listing all cluster nodes.

#### Connecting to the Cluster

The ServerAddress class represents the host and port of a Redis node. The host can be either an IP address, a hostname, or a fully qualified domain name (FQDN).