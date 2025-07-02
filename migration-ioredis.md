This guide provides a **side-by-side comparison** of how to migrate common Valkey commands from **ioredis to Glide**.

## Installation

```bash
npm i @valkey/valkey-glide
```

## Constructor

- In **ioredis**, multiple constructors allow for various connection configurations.  
- In **Glide**, connections are established through a **single configuration object**, which comes **pre-configured with best practices**.

Glide **requires minimal configuration changes**, typically for:  
- **Timeout settings**  
- **TLS**  
- **Read from replica**  
- **User authentication (username & password)**  

For advanced configurations, refer to the **[Glide Wiki - NodeJS](https://github.com/valkey-io/valkey-glide/wiki/NodeJS-Wrapper)**.


<a id="standalone"></a>
<details>
<summary><b style="font-size:22px;">Standalone Mode</b></summary>

**ioredis**
```js
const Redis = require("ioredis");

const redis = new Redis();
```

**Glide**
```js
import { GlideClient } from '@valkey/valkey-glide';

const addresses = [
        { host: "localhost", port: 6379 },
    ]; 

const client = await GlideClient.createClient({
    addresses: addresses
});
```

---

</details>

<a id="cluster"></a>
<details>
<summary><b style="font-size:22px;">Cluster Mode</b></summary>

**ioredis**  
```js
const Redis = require("ioredis");

const cluster = new Redis.Cluster([
  { host: "127.0.0.1", port: 6379 },
  { host: "127.0.0.1", port: 6380 },
]);
```

**Glide**  
```js
import { GlideClusterClient } from '@valkey/valkey-glide';

const addresses = [
    { host: "127.0.0.1", port: 6379 },
    { host: "127.0.0.1", port: 6380 },
  ];

const client = await GlideClusterClient.createClient({
  addresses: addresses
});
```

</details>

<a id="parameters"></a>
<details>
<summary><b style="font-size:22px;">ioredis vs. Glide Constructor Parameters</b></summary>

TODO: fix the table

The table below compares **ioredis constructors** with **Glide configuration parameters**:

| **ioredis Constructor** | **Equivalent Glide Configuration** |
|--------------------------|--------------------------------------|
| `port: number`           | `BaseClientConfiguration.addresses: { host: string; port?: number; }` |
| `host: string`           | `BaseClientConfiguration.addresses: { host: string; port?: number; }` |
| `path: string`           |  Not supported |
| `tls: {}`                | `BaseClientConfiguration.useTLS: true`|
| `options: RedisOptions`  | `options: GlideClientConfiguration` |

**Advanced configuration**

**Standalone Mode** uses `AdvancedGlideClientConfiguration` and **Cluster Mode** uses `AdvancedGlideClusterClientConfiguration`, 
but the usage is similar.

| **ioredis Constructor** | **Equivalent Glide Configuration** |
|----------------------|--------------------------------|
| `connectTimeout: 500` | `BaseClientConfiguration.advancedConfiguration = {connectionTimeout: 500,};`|


</details>

---

## Commands in ioredis → Glide

<a id="commands-table"></a>

Below is a list of the most commonly used Valkey commands in Glide clients and how they compare to ioredis.

### **Valkey Commands Sorted Alphabetically**

| | | | 
|-----------|----------|----------|
| [AUTH](#auth)            | [EXPIRE](#expire)        | [MULTI](#transaction)   |
| [DECR](#incr-decr)       | [GET](#set-get)          | [RPUSH](#lpush-rpush)   |
| [DECRBY](#incrby-decrby) | [HSET](#hset)            | [SCAN](#scan)           |
| [DEL](#del)              | [INCR](#incr-decr)       | [SET](#set-get)         |
| [EVAL](#eval)            | [INCRBY](#incrby-decrby) | [SETEX](#setex)         |
| [EVALSHA](#eval)         | [LPUSH](#lpush-rpush)    |                         |
| [EXISTS](#exists)        | [MGET](#mget)            |                         |


<a id="set-get"></a>
<details>
<summary><b style="font-size:18px;">SET & GET</b></summary>

- **Both** ioredis and Glide support this in the same way.

**ioredis**
```js
await redis.set('key', 'value');
const val = await redis.get('key'); // "value"
```

**Glide**
```js
await client.set('key', 'value');
const val = await client.get('key'); // "value"
```
</details>

<a id="del"></a>
<details>
<summary><b style="font-size:18px;">DEL</b></summary>

The `DEL` command removes one or more keys from Valkey.

- In **ioredis**, `del()` takes multiple arguments.
- In **Glide**, `del()` expects an array.

**ioredis**
```js
await redis.del('key1', 'key2'); // 2
```

**Glide**
```js
await client.del(['key1', 'key2']); // 2
```
</details>

<a id="exists"></a>
<details>
<summary><b style="font-size:18px;">EXISTS</b></summary>

The `EXISTS` command checks if a key exists in Valkey.

- In **ioredis**, accepts one or more arguments.
- In **Glide**, expects an array of keys.
- **Both** return the number of keys that exist.

**ioredis**
```js
await redis.exists('existKey', 'nonExistKey'); // 1
```

**Glide**
```js
await client.exists(['existKey', 'nonExistKey']); // 1
```
</details>

<a id="incr-decr"></a>
<details>
<summary><b style="font-size:18px;">INCR / DECR</b></summary>

The `INCR` command **increments** the value of a key by **1**, while `DECR` **decrements** it by **1**.  

- **Both** clients support `incr` and `decr` identically.

**ioredis**
```js
await redis.incr('counter'); // counter = 1
await redis.decr('counter'); // counter = 0
```

**Glide**
```js
await client.incr('counter'); // counter = 1
await client.decr('counter'); // counter = 0
```
</details>

<a id="incrby-decrby"></a>
<details>
<summary><b style="font-size:18px;">INCRBY / DECRBY</b></summary>

The `INCRBY` command increases the **value of a key** by a specified amount, while `DECRBY` decreases it by a specified amount.  

- **Both** behave the same: apply an integer delta to a key.

**ioredis**
```js
await redis.incrby('counter', 5); // 5
await redis.decrby('counter', 2); // 3
```

**Glide**
```js
await client.incrBy('counter', 5); // 5
await client.decrBy('counter', 2); // 3
```
</details>

<a id="mget"></a>
<details>
<summary><b style="font-size:18px;">MGET</b></summary>

The `MGET` command retrieves the values of multiple keys from Valkey.  
todo
Note:
          In cluster mode, if keys in `keys` map to different hash slots,
          the command will be split across these slots and executed separately for each.
          This means the command is atomic only at the slot level. If one or more slot-specific
          requests fail, the entire call will return the first encountered error, even
          though some requests may have succeeded while others did not.
          If this behavior impacts your application logic, consider splitting the
          request into sub-requests per slot to ensure atomicity.

- In **ioredis**, `mget()` accepts multiple string arguments.
- In **Glide**, pass an array of strings.

**ioredis**
```js
const values = await redis.mget('key1', 'key2'); // ['value1', 'value2']
```

**Glide**
```js
const values = await client.mget(['key1', 'key2']); // ['value1', value2']
```
</details>

<a id="hset"></a>
<details>
<summary><b style="font-size:18px;">HSET</b></summary>

The `HSET` command sets multiple field-value pairs in a hash.  

- In **ioredis**, fields and values are passed inline.
- In **Glide**, use a key-value object.

**ioredis**
```js
await redis.hset('hash', 'key1', '1', 'key2', '2'); // 2
```

**Glide**
```js
await client.hset('hash', { key1: '1', key2: '2' }); // 2
```
</details>

<a id="expire"></a>
<details>
<summary><b style="font-size:18px;">EXPIRE</b></summary>

The `EXPIRE` command sets a time-to-live (TTL) for a key.

- **Both** clients support TTL expiration using `expire`.
- In **ioredis**, it returns a number 1 if successful or 0 if otherwise.
- In **Glide**, it returns a boolean indicating success.

**ioredis**
```js
await redis.expire('key', 10); // 1
```

**Glide**
```js
await client.expire('key', 10); // true
```
</details>

<a id="setex"></a>
<details>
<summary><b style="font-size:18px;">SETEX</b></summary>

The `SETEX` command sets a key with an expiration time.  

- In **ioredis**, `setex` is a dedicated function.
- In **Glide**, TTL is passed as an option to `set`.

**ioredis**
```js
await redis.setex('key', 5, 'value'); // OK
```

**Glide**
```js
import { TimeUnit } from "@valkey/valkey-glide";

await client.set('key', 'value', {expiry: {type: TimeUnit.Seconds, count: 5 }}); // OK
```
</details>

<a id="lpush-rpush"></a>
<details>
<summary><b style="font-size:18px;">LPUSH / RPUSH</b></summary>

`LPUSH` adds to the start of a Valkey list, `RPUSH` to the end.

- **ioredis**: accepts multiple values, returns new list length.  
- **Glide**: values must be in an array, also returns new length.

**ioredis**
```js
let lengthOfList = await redis.lpush('list', 'a', 'b', "c");    // lengthOfList = 3
lengthOfList = await redis.rpush('list', 'd', 'e');             // lengthOfList = 5
```

**Glide**
```js
let lengthOfList = await client.lpush("list", ["a", "b", "c"]); // lengthOfList = 3
lengthOfList = await client.rpush("list", ["d", "e"]);          // lengthOfList = 5
```
</details>

<a id="scan"></a>
<details>
<summary><b style="font-size:18px;">SCAN</b></summary>

- **ioredis** ioredis uses different constructors while **Glide** uses a single `scan` method with `options`. 
- **Glide** supports **cluster mode scanning** to scan the entire cluster. [For more](https://github.com/valkey-io/valkey-glide/wiki/General-Concepts#cluster-scan).

**ioredis**
```js
let cursor = '0';
let result;
do {
    result = await client.scan(cursor);
    cursor = result[0];

    const keys = result[1];
    if (keys.length > 0) {
        console.log('SCAN iteration: ' + keys.join(', '));
    }
} while (cursor !== '0');
```

**Glide**
```js
let cursor = '0';
let result;
do {
    result = await client.scan(cursor);
    cursor = result[0].toString();

    const keys = result[1];
    if (keys.length > 0) {
        console.log('SCAN iteration: ' + keys.join(', '));
    }
} while (cursor !== '0');

```
</details>

<a id="transaction"></a>
<details>
<summary><b style="font-size:18px;">Transactions (MULTI / EXEC)</b></summary>

The `MULTI` command starts a Valkey transaction.  
The `EXEC` command executes all queued commands in the transaction.

- In **ioredis**, transactions are started using `redis.multi()`. `exec` returns `[[error, result], ...]`
- In **Glide**, transactions are represented as a `Transaction` object. `exec` returns `[result1, result2, ...]`

**ioredis**
```js
const transaction = redis.multi()
        .set("key", "value")
        .get("key");
const result = await transaction.exec(); // 
console.log(result); // Output: [ [ null, 'OK' ], [ null, 'value' ] ]
```

**Glide**
```js
import { Transaction } from "@valkey/valkey-glide";
const transaction = new Transaction()
            .set("key", "value")
            .get("key");
const result = await client.exec(transaction);
console.log(result); // Output: ['OK', 'value']
```

</details>

<a id="eval"></a>
<details>
<summary><b style="font-size:18px;">EVAL / EVALSHA</b></summary>

The `EVAL` and `EVALSHA` commands execute Lua scripts in Valkey.

- In **ioredis**, Lua scripts are executed using `eval()` or `evalsha()`.
- In **Glide**, Lua scripts are executed via `invokeScript()` using a `Script` object.  
The `Script` class wraps the Lua script.

**Jedis**
```js
// EVAL
const luaScript = `return { KEYS[1], ARGV[1] }`;
const scriptOptions = {
    keys: ["foo"],
    args: ["bar"],
};

const result = await redis.eval(luaScript, 1, ...scriptOptions.keys, ...scriptOptions.args);
console.log(result); // Output: ['foo', 'bar']
```

**Glide**
```js
import { Script } from "@valkey/valkey-glide";

const luaScript = new Script("return { KEYS[1], ARGV[1] }");
const scriptOptions = {
    keys: ["foo"],
    args: ["bar"],
};

const result = await client.invokeScript(luaScript, scriptOptions);
console.log(result); // Output: ['foo', 'bar']
```

</details>

<a id="auth"></a>
<details>
<summary><b style="font-size:18px;">AUTH</b></summary>

The `AUTH` command is used to authenticate a Valkey connection with a password.

- In **ioredis**, `auth()` is a direct method call.
- In **Glide**, use `updateConnectionPassword`.

**ioredis**
```js
await redis.auth('mypass'); // OK
```

**Glide**
```js
await client.updateConnectionPassword('mypass'); // OK
```
</details>

---

### Custom Command

The `customCommand` function lets you execute any Valkey command as a raw list of arguments, 
**without input validation**. 
It's a flexible option when the standard Glide API doesn't cover a specific command.

**Example:**

```js
await client.customCommand(['SET', 'key', 'value']);
```

This sends the raw `SET key value` command to Valkey.
