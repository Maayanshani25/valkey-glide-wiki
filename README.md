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

---

## IOREDIS Prompt

````md

> **Task:**  
> Convert the following JavaScript/TypeScript code that uses **ioredis** into equivalent code using the **Valkey GLIDE** client.  

> **Source of Truth:**  
> Use **only** the official migration guide:  
> [https://github.com/valkey-io/valkey-glide/wiki/Migration-Guide-ioredis](https://github.com/valkey-io/valkey-glide/wiki/Migration-Guide-ioredis)

---

> **Goal:**  
> Perform a precise, line-by-line conversion to Valkey GLIDE, using **only** commands and patterns explicitly documented in the guide.

---

### ✅ Instructions (VERY STRICT):

- For **every Redis command** used in the source, first **check if it appears in the migration guide**.
- If the command is **documented** in the guide:
  - Use only the conversion syntax shown there.
- If the command is **not mentioned** in the guide:
  - Do **not** assume or guess.
  - Instead:
    - Either omit it, or
    - Leave it as a commented TODO, like:  
      `// TODO: 'SOME_COMMAND' command is not documented in the Glide migration guide`
- Do **not add**, refactor, or optimize beyond what the guide shows.
- Retain the original logic and structure unless it’s required to change for Glide compatibility.
- Assume Redis **cluster** usage if `new Redis.Cluster(...)` appears.

---

### 🛠 Code to Convert:

```ts
// Paste your code here
```

---

### 🔁 Expected Output:

A converted JavaScript/TypeScript snippet using **Valkey GLIDE**, with unsupported fields clearly marked or removed.
- Each command is only converted if its GLIDE form appears in the official guide.
- Unsupported or undocumented commands are either skipped or clearly commented as TODO.

````


### Detailed IOREDIS Prompt

````md
**Task Overview:**
You are tasked with converting a given JavaScript/TypeScript code snippet that currently utilizes the **ioredis** library into an equivalent implementation using the **Valkey GLIDE** client. This task requires meticulous attention to detail, ensuring that each command is accurately translated according to the specifications provided in the official migration guide.

**Source of Truth:**
For the conversion process, you must rely exclusively on the official migration guide available at the following link:
[Valkey GLIDE Migration Guide from ioredis](https://github.com/valkey-io/valkey-glide/wiki/Migration-Guide-ioredis). This resource outlines the necessary syntax and commands for transitioning from ioredis to Valkey GLIDE.

---

**Conversion Goal:**
Your primary objective is to achieve a precise, line-by-line transformation of the original code to Valkey GLIDE, strictly adhering to the commands and patterns documented in the migration guide.

---

### Instructions (Adherence Required):

1. **Redis Command Validation:**
   For **each Redis command** present in the provided source code (such as `lpush`, `set`, `del`, etc.), you must first verify its existence in the migration guide.

2. **Documented Commands:**

   * If a command is explicitly documented in the migration guide, utilize the exact conversion syntax provided for that command.

3. **Undocumented Commands:**

   * If a command does not appear in the guide, do not make assumptions about its functionality or syntax.
   * Instead, you should either:

     * Omit the command from the converted output.
     * Include a commented placeholder, formatted as follows:
       `// TODO: 'COMMAND_NAME' command is not documented in the Glide migration guide`

4. **Code Integrity:**

   * Ensure that you do not add, refactor, or optimize any part of the code beyond what is specified in the guide.
   * Maintain the original logic and structure of the code unless adjustments are necessary for compatibility with Valkey GLIDE.

5. **Cluster Usage Assumption:**

   * If you encounter a line of code that initializes a Redis cluster with `new Redis.Cluster(...)`, assume that the application is using a Redis cluster configuration.

---

### Code Snippet for Conversion:

```ts
// Paste your original JavaScript/TypeScript code that uses ioredis here
```

---

### Expected Output Format:

You are expected to produce a converted JavaScript/TypeScript snippet that utilizes the **Valkey GLIDE** client. The output should meet the following criteria:

* Each Redis command is only converted if its corresponding form is explicitly mentioned in the official migration guide.
* Any unsupported or undocumented commands must be clearly indicated as either omitted or commented as TODOs.
* The final implementation should reflect the functionality of the original code while being compliant with the Valkey GLIDE syntax.
````
