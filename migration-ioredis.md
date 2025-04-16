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

- In **ioredis**, accepts one or more arguments.
- In **Glide**, expects an array of keys.

**ioredis**
```js
await redis.exists('key'); // 0 or 1
```

**Glide**
```js
await client.exists(['key']); // 0 or 1
```
</details>

<a id="incr-decr"></a>
<details>
<summary><b style="font-size:18px;">INCR / DECR</b></summary>

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

- In **ioredis**, `mget()` accepts multiple string arguments.
- In **Glide**, pass an array of strings.

**ioredis**
```js
const values = await redis.mget('k1', 'k2'); // ['v1', 'v2']
```

**Glide**
```js
const values = await client.mget(['k1', 'k2']); // ['v1', 'v2']
```
</details>

<a id="hset"></a>
<details>
<summary><b style="font-size:18px;">HSET</b></summary>

- In **ioredis**, fields and values are passed inline.
- In **Glide**, use a key-value object.

**ioredis**
```js
await redis.hset('hash', 'a', '1', 'b', '2'); // 2
```

**Glide**
```js
await client.hset('hash', { a: '1', b: '2' }); // 2
```
</details>

<a id="expire"></a>
<details>
<summary><b style="font-size:18px;">EXPIRE</b></summary>

- **Both** clients support TTL expiration using `expire`.

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

- In **ioredis**, `setex` is a dedicated function.
- In **Glide**, TTL is passed as an option to `set`.

**ioredis**
```js
await redis.setex('key', 5, 'value'); // OK
```

**Glide**
```js
await client.set('key', 'value', { expiry: { seconds: 5 } }); // OK
```
</details>

<a id="lpush-rpush"></a>
<details>
<summary><b style="font-size:18px;">LPUSH / RPUSH</b></summary>

- In **ioredis**, supports variadic arguments.
- In **Glide**, values must be passed as an array.

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

- In **ioredis**, `multi()` queues commands directly.
- In **Glide**, `multi()` returns a transaction object that is later executed with `exec(tx)`.

**ioredis**
```js
const trx = redis.multi();
trx.set('a', '1');
trx.incr('a');
const result = await trx.exec(); // ['OK', 2]
```

**Glide**
```js
const tx = client.multi();
tx.set('a', '1');
tx.incr('a');
const result = await client.exec(tx); // ['OK', 2]
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