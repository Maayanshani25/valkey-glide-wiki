## Go Wrapper Examples

Please refer to the [README](https://github.com/valkey-io/valkey-glide/blob/main/go/README.md#installation-and-setup) of the Go examples for the instructions on how to run [Standalone Example](https://github.com/valkey-io/valkey-glide/blob/main/go/README.md#standalone-example) and [Cluster Example](https://github.com/valkey-io/valkey-glide/blob/main/go/README.md#cluster-example).

## Client Initialization

Valkey GLIDE provides support for both [Cluster](https://github.com/valkey-io/valkey-glide/wiki/Go-wrapper#cluster) and [Standalone](https://github.com/valkey-io/valkey-glide/wiki/Go-wrapper#standalone) and configurations. Please refer to the relevant section based on your specific setup.

### Cluster

Valkey GLIDE supports [Cluster](https://valkey.io/topics/cluster-spec) deployments, where the database is partitioned across multiple primary shards, with each shard being represented by a primary node and zero or more replica nodes.

To initialize a [`GlideClusterClient`](https://github.com/valkey-io/valkey-glide/blob/main/go/api/glide_cluster_client.go), you need to provide a [`GlideClusterClientConfiguration`](https://github.com/valkey-io/valkey-glide/blob/main/go/api/config.go) that includes the addresses of initial seed nodes. Valkey GLIDE automatically discovers the entire cluster topology, eliminating the necessity of explicitly listing all cluster nodes.

#### **Connecting to a Cluster**

The `NodeAddress` class represents the host and port of a cluster node. The host can be either an IP address, a hostname, or a fully qualified domain name (FQDN).

#### Example - Connecting to a cluster

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

config := api.NewGlideClusterClientConfiguration().
    WithAddress(&api.NodeAddress{Host: "address.example.com", Port: 6379})

client, err := api.NewGlideClusterClient(config)
```

#### Request Routing

In the cluster, data is divided into slots, and each primary node within the cluster is responsible for specific slots. Valkey GLIDE adheres to [Valkey OSS guidelines](https://valkey.io/topics/command-tips/#request-policy) when determining the node(s) to which a command should be sent in clustering mode. 

For more details on the routing of specific commands, please refer to [the documentation within the code](https://github.com/valkey-io/valkey-glide/blob/main/go/api/config/request_routing_config.go) for routing configuration.

#### Response Aggregation

When requests are dispatched to multiple shards in a cluster (as discussed in the Request routing section), the client needs to aggregate the responses for a given command. Valkey GLIDE follows [Valkey OSS guidelines](https://valkey.io/topics/command-tips/#response-policy) for determining how to aggregate the responses from multiple shards within a cluster. 

To learn more about response aggregation for specific commands, please refer to [the documentation within the code](https://github.com/valkey-io/valkey-glide/blob/main/go/api/response_types.go).

#### Topology Updates

The cluster's topology can change over time. New nodes can be added or removed, and the primary node owning a specific slot may change. Valkey GLIDE is designed to automatically rediscover the topology whenever the server indicates a change in slot ownership. This ensures that the Valkey GLIDE client stays in sync with the cluster's topology.

### Standalone 

Valkey GLIDE also supports Standalone deployments, where the database is hosted on a single primary node, optionally with replica nodes. To initialize a `GlideClient` for a standalone setup, you should create a `GlideClientConfiguration` that includes the addresses of primary and all replica nodes.

#### **Example - Connecting to a standalone** 

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

config := api.NewGlideClientConfiguration().
    WithAddress(&api.NodeAddress{Host: "primary.example.com", Port: 6379}).
    WithAddress(&api.NodeAddress{Host: "replica1.example.com", Port: 6379}).
    WithAddress(&api.NodeAddress{Host: "replica2.example.com", Port: 6379})

client, err := api.NewGlideClient(config)
```

## Valkey Commands

For information on the supported commands and their corresponding parameters, we recommend referring to [the documentation in the code](https://github.com/valkey-io/valkey-glide/blob/main/go/api/base_client.go). This documentation provides in-depth insights into the usage and options available for each command.


### Transaction

A transaction in Valkey Glide allows you to execute a group of commands in a single, atomic step. This ensures that all commands in the transaction are executed sequentially and without interruption. See [Valkey Transactions](https://valkey.io/topics/transactions).


This is equivalent to the Valkey commands [MULTI](https://valkey.io/commands/multi/) / [EXEC](https://valkey.io/commands/exec/).


Currently, we are working on implementing `Transactions` for the Go client.


## Client Usage

### Tracking resources

GLIDE 1.3 introduces a new NONE Valkey API: `Info` which returns a `string` with many relevant properties (available for both `GlideClient` & `GlideClusterClient`). See descriptions for the `Section` type in [command options](https://github.com/valkey-io/valkey-glide/blob/main/go/api/command_options.go).

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

config := api.NewGlideClientConfiguration().
    WithAddress(&api.NodeAddress{Host: "address.example.com", Port: 6379})

client, err := api.NewGlideClient(config)
result, err := client.Info()
// do something with the `stats`
```

## Advanced Configuration Settings

### Authentication

By default, when connecting to Valkey, Valkey GLIDEs operates in an unauthenticated mode.

Valkey GLIDE also offers support for an authenticated connection mode. 

In authenticated mode, you have the following options:

* Use both a username and password, which is recommended and configured through [ACLs](https://valkey.io/docs/topics/acl/) on the server.
* Use a password only, which is applicable if the server is configured with the [requirepass](https://valkey.io/topics/security/#authentication) setting.

To provide the necessary authentication credentials to the client, you can use the `ServerCredentials` struct.

#### Example - Connecting with Username and Password to a Cluster

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

config := api.NewGlideClusterClientConfiguration().
		WithAddress(&api.NodeAddress{Host: "address.example.com", Port: 6379}).
		WithCredentials(api.NewServerCredentials("user1", "passwordA"))

client, err := api.NewGlideClusterClient(config)
```


#### Example - Connecting with Username and Password to a Standalone

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

config := api.NewGlideClientConfiguration().
    WithAddress(&api.NodeAddress{Host: "primary.example.com", Port: 6379}).
    WithCredentials(api.NewServerCredentials("user1", "passwordA"))

client, err := api.NewGlideClient(config)
```

### TLS

Valkey GLIDE supports secure TLS connections to a data store.

It's important to note that TLS support in Valkey GLIDE relies on [rusttls](https://github.com/rustls/rustls). Currently, Valkey GLIDE employs the default rustls settings with no option for customization.

#### Example - Connecting with TLS Mode Enabled to a Cluster

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

config := api.NewGlideClusterClientConfiguration().
		WithAddress(&api.NodeAddress{Host: "address.example.com", Port: 6379}).
		WithUseTLS(true)

client, err := api.NewGlideClusterClient(config)
```

#### Example - Connecting with TLS Mode Enabled to a Standalone server

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

config := api.NewGlideClientConfiguration().
    WithAddress(&api.NodeAddress{Host: "primary.example.com", Port: 6379}).
    WithUseTLS(true)

client, err := api.NewGlideClient(config)
```

### Read Strategy

By default, Valkey GLIDE directs read commands to the primary node that owns a specific slot. For applications that prioritize read throughput and can tolerate possibly stale data, Valkey GLIDE provides the flexibility to route reads to replica nodes.

Valkey GLIDE provides support for next read strategies, allowing you to choose the one that best fits your specific use case.

|Strategy	|Description	|
|---	|---	|
|`PRIMARY`	|Always read from primary, in order to get the freshest data.	|
|`PREFER_REPLICA`	|Spread requests between all replicas in a round robin manner. If no replica is available, route the requests to the primary.	|
|`AZ_AFFINITY`	|Spread the read requests between replicas in the same client's availability zone in a round robin manner, falling back to other replicas or the primary if needed.	|

#### Example - Use PREFER_REPLICA Read Strategy

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

config := api.NewGlideClusterClientConfiguration().
    WithAddress(&api.NodeAddress{Host: "address.example.com", Port: 6379}).
    WithReadFrom(api.PreferReplica)

client, err := api.NewGlideClusterClient(config)

client.Set("key1", "val1")

// Get will read from one of the replicas
client.Get("key1")
```

#### Example - Use AZ_AFFINITY Read Strategy

Currently, we are adding support for AZ Awareness in the Go client.


### Timeouts and Reconnect Strategy

Valkey GLIDE allows you to configure timeout settings and reconnect strategies. These configurations can be applied through the [`GlideClusterClientConfiguration`](https://github.com/valkey-io/valkey-glide/blob/main/go/api/config.go) and [`GlideClientConfiguration`](https://github.com/valkey-io/valkey-glide/blob/main/go/api/config.go) parameters.


|Configuration setting	|Description	|**Default value**	|
|---	|---	|---	|
|requestTimeout	|This specified time duration, measured in milliseconds, represents the period during which the client will await the completion of a request. This time frame includes the process of sending the request, waiting for a response from the node(s), and any necessary reconnection or retry attempts. If a pending request exceeds the specified timeout, it will trigger a timeout error. If no timeout value is explicitly set, a default value will be employed.	|250 milliseconds	|
|reconnectStrategy	|The reconnection strategy defines how and when reconnection attempts are made in the event of connection failures.	|Exponential backoff	|


#### Example - Setting Increased Request Timeout for Long-Running Commands

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

config := api.NewGlideClusterClientConfiguration().
    WithAddress(&api.NodeAddress{Host: "address.example.com", Port: 6379}).
    WithRequestTimeout(500)

client, err := api.NewGlideClusterClient(config)
```

## Full Example with All Client Configurations

```go
import (
	"github.com/valkey-io/valkey-glide/go/api"
)

// GlideClient example
standaloneConfig := api.NewGlideClientConfiguration().
	WithAddress(&api.NodeAddress{Host: "primary.example.com", Port: 6379}).
	WithClientName("some client name").
	WithCredentials(api.NewServerCredentials("user1", "passwordA")).
	WithDatabaseId(1).
	WithReadFrom(api.PreferReplica).
	WithReconnectStrategy(api.NewBackoffStrategy(5, 10, 50)).
	WithRequestTimeout(500).
	WithUseTLS(true)

standaloneClient, err := api.NewGlideClient(standaloneConfig)

// GlideClusterClient example
clusterConfig := api.NewGlideClusterClientConfiguration().
	WithAddress(&api.NodeAddress{Host: "address.example.com", Port: 6379}).
	WithClientName("some client name").
	WithCredentials(api.NewServerCredentials("user1", "passwordA")).
	WithReadFrom(api.PreferReplica).
	WithRequestTimeout(500).
	WithUseTLS(true)

clusterClient, err := api.NewGlideClusterClient(clusterConfig)
```