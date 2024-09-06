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

### Command String Arguments

Valkey strings are stored in its simplest form: as a sequence of bytes. GLIDE offers [GlideString](https://github.com/valkey-io/valkey-glide/blob/79fdec50bbef4310cb12e46a69f14c18378afb44/node/src/BaseClient.ts#L278) which maps to Valkey strings. Use it to pass Valkey strings as arguments to commands, or receive Valkey strings in response to commands. GlideString represents either:

1. `string`: as a UTF-8 encoded string.
2. `Buffer`: as a `byte[]`.

The return types of command API:

-   Command uses `string` instead of `GlideString` as the return type if it contains a simple string value (simple strings in Valkey are always UTF-8 encoded strings). For example, [`type`](https://github.com/valkey-io/valkey-glide/blob/79fdec50bbef4310cb12e46a69f14c18378afb44/node/src/BaseClient.ts#L4488) command returns one of pre-defined strings, or [`set`](https://github.com/valkey-io/valkey-glide/blob/79fdec50bbef4310cb12e46a69f14c18378afb44/node/src/BaseClient.ts#L1182) command which returns `"OK"`.
-   Command uses `Buffer` as the return type, because it always contains binary data. For example, `dump` and `functionDump` commands.
-   Most commands use `GlideString` as the common return type.

### Decoder

In Node.js, most users expect the responses to be in string format unless specified otherwise. Users can select which data type they expect to receive as a response. The user has the option, using [`DecoderOption`](https://github.com/valkey-io/valkey-glide/blob/79fdec50bbef4310cb12e46a69f14c18378afb44/node/src/BaseClient.ts#L295) as an extension to command option types with [`Decoder`](https://github.com/valkey-io/valkey-glide/blob/79fdec50bbef4310cb12e46a69f14c18378afb44/node/src/BaseClient.ts#L283), of converting the response into either a string or bytes for each command. In addition, as part of the client creation process, the user has the option of setting a default for all commands if no decoder argument is passed to the command.

`Decoder` is an optional parameter for all commands and it has two options

1. `Bytes`: decodes the response into a `Buffer` (byte array).
2. `String`: decodes the response into a string.

If `Decoder` is not configured, `Decoder.String` will be used as the default decoder.
Note: Using the `Decoder.String` to convert Non-UTF-8 encoded Valkey strings can lead to errors unrecoverable data lost. See: [#2221](https://github.com/valkey-io/valkey-glide/discussions/2221).

#### Example Usage

Here is an example of command implementation to outline arguments using [`DecoderOption`](https://github.com/valkey-io/valkey-glide/blob/79fdec50bbef4310cb12e46a69f14c18378afb44/node/src/BaseClient.ts#L295) and response type:

```typescript
public getdel(
        key: GlideString,
        options?: DecoderOption,
    ): Promise<GlideString | null>
```

Here's a simple example demonstrating how to use `Decoder` in command API and `Buffer.from()` to encode binary data:

```typescript
expect(await client.set(key, value)).toEqual("OK");
expect(await client.getdel(key)).toEqual(value);

const valueEncoded = Buffer.from(value);
expect(await client.set(key, value)).toEqual("OK");
expect(await client.getdel(key, { decoder: Decoder.Bytes })).toEqual(
    valueEncoded,
);
```

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

```typescript
// Initialize a transaction object
const transaction = new Transaction();

// Add commands to the transaction
transaction.set("key", "value");
transaction.select(1); // Standalone command
transaction.get("key");

// Execute the transaction
const results = await client.exec(transaction);
expect(results).toEqual(["OK", "OK", "value"]);
```

#### Decoder

Transactions use the same decoder for all commands in the transaction. For example, if a user runs `client.exec(transaction, { decoder: Decoder.Bytes })`, then all the command responses in the transaction will be encoded into `Buffer`s. There is an [issue](https://github.com/valkey-io/valkey-glide/issues/2147) to track the support of adding option to set a decoder per each command in transaction.

Here's an example demonstrating how to use `Decoder` and [`route`](https://github.com/valkey-io/valkey-glide/blob/main/node/src/GlideClusterClient.ts#L202) with transaction:

```typescript
let transaction = new ClusterTransaction().functionDump();
const result = await client.exec(transaction, {
    decoder: Decoder.Bytes,
    route: route,
});
const data = result?.[0] as Buffer;
```

#### Command Chaining

Valkey Glide supports command chaining within a transaction, allowing for a more concise and readable code. Here's how you can use chaining in transactions:

```typescript
// Initialize a cluster transaction object
const transaction = new ClusterTransaction();

// Chain commands
transaction.set(key, value)
    .get(key)
    .get(key, Decoder.Bytes);

// Execute the transaction
const results = await client.exec(transaction. { decoder: Decoder.Bytes });

expect(results).toEqual(["OK", value, Buffer.from(value)]);
```

**Cluster Mode Considerations:** When using `ClusterTransaction`, all keys in the transaction must be mapped to the same slot.

#### Detailed Steps:

**Create a Transaction Object:** Initialize either a `Transaction` or a `ClusterTransaction` object.

For a client with cluster-mode disabled:

```typescript
const transaction = new Transaction(); // For standalone mode
```

For a client with cluster-mode enabled:

```typescript
const transaction = new ClusterTransaction(); // For cluster mode
```

**Adding Commands:** Use the transaction object to queue up the desired commands.

```typescript
transaction.set("key", "value");
transaction.get("key");
```

**Executing the Transaction:** Use the `exec` method of the Valkey Glide client to execute the transaction.

```typescript
client.exec(transaction);
```

**Handling Results:** The result of the transaction execution will be a list of responses corresponding to each command in the transaction.

```typescript
const results = await client.exec(transaction);
expect(results).toEqual(["OK", "OK", "value"]);
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

```ts
// Initialize a transaction object
const transaction = new Transaction();

// Add commands to the transaction
transaction.set('key', 'value');
transaction.select(1);  // Standalone command
transaction.get('key');

// Execute the transaction
const result = await client.exec(transaction);
console.log(result); // Output: [OK, OK, null]
```

#### Command Chaining

Valkey Glide supports command chaining within a transaction, allowing for a more concise and readable code. Here's how you can use chaining in transactions:

```ts
// Initialize a cluster transaction object
const clusterTransaction = new ClusterTransaction();

// Chain commands
clusterTransaction.set('key', 'value').get('key')

// Execute the transaction
const result = await client.exec(clusterTransaction);
console.log(result); // Output: [OK, 'value']
```

**Cluster Mode Considerations:** When using `ClusterTransaction`, all keys in the transaction must be mapped to the same slot.


#### Detailed Steps:

**Creating a Transaction:** Initialize the `Transaction` or `ClusterTransaction` object.
```ts
const transaction = new Transaction();  // For standalone mode
const clusterTransaction = new ClusterTransaction();  // For cluster mode
```
**Adding Commands:** Use the transaction object to queue up the desired commands.
```ts
transaction.set('key', 'value');
transaction.get('key');
```
**Executing the Transaction:** Use the `exec` method of the Valkey Glide client to execute the transaction.
```ts
await client.exec(transaction);
```

**Handling Results:** The result of the transaction execution will be a list of responses corresponding to each command in the transaction.
```ts
const result = await client.exec(transaction)
console.log(result);  // Output: [OK, 'value']
```