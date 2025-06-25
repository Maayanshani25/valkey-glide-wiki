## Jedis Prompt

> **Task:**
> Use the attached migration guide (from [https://github.com/valkey-io/valkey-glide/wiki/Migration-Guide-Jedis](https://github.com/valkey-io/valkey-glide/wiki/Migration-Guide-Jedis)) as the source of truth.
>
> **Goal:**
> Convert the following Java code that uses **Jedis** into equivalent code using the **Valkey GLIDE** client.
>
> **Instructions:**

* Follow the migration guide closely.
* Replace each Jedis command with its GLIDE counterpart.
* Initialize and configure the client properly (e.g., using `GlideClusterClient.create()` when needed).
* Include all relevant imports and setup boilerplate.
* Ensure the resulting code is clean, idiomatic, and functional in Java.

> **Bonus Tip:**
> Assume that the original Jedis code uses a Redis **cluster** setup if it is initialized using `JedisCluster` or similar constructs. In such cases, use `GlideClusterClient` instead of the standalone client.

---

### Code to Convert:

```java
<Paste your Jedis code here>
```

---

### 🔁 Expected Output:

A fully converted Java snippet that uses Valkey GLIDE instead of Jedis, with appropriate initialization, method mappings, and comments if necessary.



## IOREDIS Prompt

> **Task:**
> Convert the following JavaScript/TypeScript code that uses **ioredis** into equivalent code using the **Valkey GLIDE** client.
>
> **Source of Truth:**
> Use **only** the official migration guide:
> [https://github.com/valkey-io/valkey-glide/wiki/Migration-Guide-ioredis](https://github.com/valkey-io/valkey-glide/wiki/Migration-Guide-ioredis)

---

> **Goal:**
> Perform a line-by-line conversion to Valkey GLIDE, mapping only what is explicitly supported in the guide.

---

### ✅ Instructions (strict):

* Use **only** methods, options, and patterns shown in the migration guide.
* If a parameter, feature, or configuration (like `dnsLookup`, `enableOfflineQueue`, or custom TLS options) is present in the source but **not mentioned in the guide**, then:

  * **Omit it** from the output
  * Or **comment it as unimplemented / unsupported**
* Preserve structure, variable names, and flow where possible.
* Assume Redis **cluster** usage when initialized with `new Redis.Cluster(...)`.

---

### 🛠 Code to Convert:

```ts
import Redis from "ioredis";

const client = new Redis.Cluster(
  [{ host: 'clustercfg.disney-test-valkey-7-r5.nra7gl.use1.cache.amazonaws.com', port: 6379 }],
  {
    dnsLookup: (address, callback) => callback(null, address),
    redisOptions: {
      tls: {},
    },
  });

(async () => {
    const setResult = await client.set("key", "value");
    console.assert(setResult === "OK");

    const getResult = await client.get("key");
    console.assert(getResult === "value");

    client.disconnect();
})();
```

---

### 🔁 Expected Output:

A converted JavaScript/TypeScript snippet using **Valkey GLIDE**
