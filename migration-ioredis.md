// add about npm version 9.4.1 and higher and how to install

# ioredis → Valkey Glide Migration Guide (Node.js)

This guide provides a **side-by-side comparison** of how to migrate common Valkey commands from **ioredis to Glide**.

---

## Installation

```bash
npm i @valkey/valkey-glide
```

## Constructor & Initialization


<a id="constructor"></a>
<details>
<summary><b style="font-size:22px;">Connection</b></summary>

**ioredis**
```js
const Redis = require('ioredis');
const redis = new Redis();
```

**Glide**
```js
import { createClient } from '@valkey/glide';

const client = await createClient({
  address: { host: '127.0.0.1', port: 6379 }
});
```
</details>

---

## Commands in ioredis → Glide

<a id="commands-table"></a>

### **Valkey Commands Sorted Alphabetically**

| | | |
|------|------|------|
| [AUTH](#auth) | [EXPIRE](#expire) | [MGET](#mget) |
| [DEL](#del) | [GET](#set-get) | [MULTI](#transaction) |
| [HSET](#hset) | [INCR](#incr-decr) | [RPUSH](#lpush-rpush) |
| [INCRBY](#incrby-decrby) | [LPUSH](#lpush-rpush) | [SET](#set-get) |
| [SETEX](#setex) | [SCAN](#scan) | [EXISTS](#exists) |

---

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

The `INCRBY` command increases the **value of a key** by a specified amount.  

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
await client.expire('key', 10); // 1
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
await redis.lpush('list', 'a'); // 1
await redis.rpush('list', 'z'); // 2
```

**Glide**
```js
await client.lpush('list', ['a']); // 1
await client.rpush('list', ['z']); // 2
```
</details>

<a id="scan"></a>
<details>
<summary><b style="font-size:18px;">SCAN</b></summary>

- **Both** return `[nextCursor, keys[]]` in scan loop.

**ioredis**
```js
let cursor = '0';
do {
  const [next, keys] = await redis.scan(cursor);
  cursor = next;
} while (cursor !== '0');
```

**Glide**
```js
let cursor = '0';
do {
  const [next, keys] = await client.scan(cursor);
  cursor = next;
} while (cursor !== '0');
```
</details>

<a id="transaction"></a>
<details>
<summary><b style="font-size:18px;">Transactions (MULTI/EXEC)</b></summary>

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

<a id="auth"></a>
<details>
<summary><b style="font-size:18px;">AUTH</b></summary>

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