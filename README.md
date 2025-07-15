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
Your task is to carefully convert a provided JavaScript or TypeScript code snippet that currently uses the **ioredis** library into a corresponding implementation utilizing the **Valkey GLIDE** client. This conversion process should ensure that the original functionality of the code remains unchanged while strictly adhering to the syntax and guidelines outlined in the official migration documentation.

#### Reference Material:

As you undertake this migration, you will rely solely on the official migration guide, which can be accessed at the following link:
[Valkey GLIDE Migration Guide for ioredis](https://github.com/valkey-io/valkey-glide/wiki/Migration-Guide-ioredis)

#### Goals for Conversion:

Your primary goal is to execute a thorough, step-by-step transformation of the code from using **ioredis** to **Valkey GLIDE**. The conversion must maintain the integrity of the original logic, ensuring that all commands and structures conform precisely to those specified in the migration guide.

#### Detailed Instructions (Strict Compliance Required):

1. **Command Verification**

   * For every command or functionality invoked in the original **ioredis** code, cross-reference it with the migration guide to confirm its availability in the Valkey GLIDE client.

2. **Applying Documented Commands**

   * If a specific command is documented in the migration guide, implement the conversion syntax exactly as demonstrated without introducing any deviations.

3. **Modification Restrictions**

   * Do not introduce new commands, restructure, or optimize beyond what is explicitly defined in the guide. Focus solely on a faithful line-by-line conversion.

4. **Preserving Original Logic**

   * Keep the existing structure and logic intact unless changes are required for compatibility with Valkey GLIDE.

5. **Handling Cluster Usage**

   * If the original code uses `new Redis.Cluster(...)`, assume that clustering should also be applied in the Valkey implementation, following the migration guide’s pattern.

#### Code Submission:

Paste the **ioredis** code snippet you wish to convert here:

```ts
// Paste your ioredis code here
```

#### Expected Output:

Produce a JavaScript or TypeScript code snippet rewritten for **Valkey GLIDE**. If a command is not included in the migration guide but its structure is predictable and simple (e.g. closely resembles a documented one), you may extrapolate cautiously using Valkey GLIDE conventions—clearly marking it as **inferred**. Unsupported features should be either omitted or clearly commented.

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


