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
