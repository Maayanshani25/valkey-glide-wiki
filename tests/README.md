# Valkey Glide Migration Tests

This directory contains test files that validate the migration guides for different Redis client libraries to Valkey Glide. These tests ensure that the commands described in the migration guides work as expected.

## Overview

The tests cover the following Redis client libraries:

- **Jedis** (Java): `JedisTest.java`
- **ioredis** (JavaScript): `IoredisTest.js`
- **Lettuce** (Java): `LettuceTest.java`

Each test file validates the commands described in the corresponding migration guide.

## Prerequisites

### For All Tests

- A running Redis or Valkey server on `localhost:6379`
- Git (to clone the repository)

### For Java Tests (Jedis and Lettuce)

- Java Development Kit (JDK) 8 or higher
- Maven

### For JavaScript Tests (ioredis)

- Node.js (version 14 or higher)
- npm or yarn

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/valkey-io/valkey-glide.git
   cd valkey-glide
   ```

2. Start a Redis or Valkey server on localhost:6379 if not already running:
   ```bash
   # Using Redis
   redis-server

   # Or using Valkey
   valkey-server
   ```

## Running the Tests

### Java Tests (Jedis and Lettuce)

1. Navigate to the project root directory:
   ```bash
   cd valkey-glide
   ```

2. Build the project with Maven:
   ```bash
   mvn clean install -DskipTests
   ```

3. Run the specific test:
   ```bash
   # To run Jedis tests
   mvn test -Dtest=JedisTest

   # To run Lettuce tests
   mvn test -Dtest=LettuceTest
   ```

### JavaScript Tests (ioredis)

1. Navigate to the Node.js directory:
   ```bash
   cd valkey-glide/node
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the ioredis tests:
   ```bash
   npm test -- tests/IoredisTest.js
   # or
   yarn test tests/IoredisTest.js
   ```

## What the Tests Validate

Each test file validates the following Redis operations:

- **String Operations**: SET, GET, SETEX, SETNX, MSET, MGET, INCR, DECR, INCRBY, DECRBY, APPEND, GETRANGE, SETRANGE
- **Key Operations**: DEL, EXISTS, EXPIRE, TTL, KEYS, SCAN, RENAME, RENAMENX
- **Hash Operations**: HSET, HGET, HMSET, HMGET, HGETALL, HDEL, HEXISTS
- **List Operations**: LPUSH, RPUSH, LPOP, RPOP, LRANGE
- **Set Operations**: SADD, SMEMBERS, SREM, SISMEMBER
- **Sorted Set Operations**: ZADD, ZRANGE, ZREM, ZSCORE, ZRANK, ZREVRANK
- **Transactions**: MULTI/EXEC
- **Lua Scripts**: EVAL/EVALSHA
- **Authentication**: AUTH
- **Custom Commands**: Executing raw Redis commands

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure Redis/Valkey server is running on localhost:6379
   ```bash
   # Check if Redis/Valkey is running
   redis-cli ping
   # Should return PONG
   ```

2. **Authentication Failed**: If your Redis/Valkey server requires authentication, modify the test files to include the correct password.

3. **Test Failures**: If tests fail, check the Redis/Valkey server logs for any errors:
   ```bash
   # View Redis/Valkey server logs
   tail -f /var/log/redis/redis-server.log
   # or wherever your logs are stored
   ```

### Java-specific Issues

1. **Compilation Errors**: Ensure you have the correct version of the JDK installed:
   ```bash
   java -version
   ```

2. **Maven Errors**: Make sure Maven is correctly installed:
   ```bash
   mvn -version
   ```

### JavaScript-specific Issues

1. **Module Not Found**: Ensure all dependencies are installed:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Node Version Issues**: Check your Node.js version:
   ```bash
   node -v
   ```

## Contributing

If you find any issues with the tests or want to add more test cases:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes
4. Submit a pull request

## License

See the main project license file for details.

## Using Valkey Glide as a User

This section explains how to use Valkey Glide as a dependency in your projects, rather than in development mode.

### Python

1. Install from PyPI:
   ```bash
   pip install valkey-glide
   ```

2. Use in your code:
   ```python
   from valkey_glide import GlideClient

   # Connect to Redis/Valkey server
   client = GlideClient(host="localhost", port=6379)

   # Use the client
   client.set("key", "value")
   value = client.get("key")
   print(value)  # Outputs: value

   # Close the connection
   client.close()
   ```

### Node.js

1. Install from npm:
   ```bash
   npm install valkey-glide
   # or
   yarn add valkey-glide
   ```

2. Use in your code:
   ```javascript
   const { GlideClient } = require('valkey-glide');
   // or using ES modules
   // import { GlideClient } from 'valkey-glide';

   async function main() {
     // Connect to Redis/Valkey server
     const client = new GlideClient({
       host: 'localhost',
       port: 6379
     });

     // Use the client
     await client.set('key', 'value');
     const value = await client.get('key');
     console.log(value);  // Outputs: value

     // Close the connection
     await client.quit();
   }

   main().catch(console.error);
   ```

### Java

1. Add the dependency to your build.gradle file:
   ```groovy
   dependencies {
       implementation 'io.valkey:valkey-glide:x.y.z'  // Replace x.y.z with the latest version
   }
   ```

   Or to your Maven pom.xml:
   ```xml
   <dependency>
       <groupId>io.valkey</groupId>
       <artifactId>valkey-glide</artifactId>
       <version>x.y.z</version>  <!-- Replace x.y.z with the latest version -->
   </dependency>
   ```

2. Use in your code:
   ```java
   import io.valkey.glide.GlideClient;
   import io.valkey.glide.config.GlideClientConfig;

   public class Example {
       public static void main(String[] args) {
           // Create configuration
           GlideClientConfig config = GlideClientConfig.builder()
               .host("localhost")
               .port(6379)
               .build();

           // Create client
           try (GlideClient client = GlideClient.create(config)) {
               // Use the client
               client.set("key", "value");
               String value = client.get("key");
               System.out.println(value);  // Outputs: value
           }
       }
   }
   ```

### C#

1. Add the NuGet package:
   ```bash
   dotnet add package Valkey.Glide
   ```

2. Use in your code:
   ```csharp
   using Valkey.Glide;

   // Create client
   using var client = new GlideClient("localhost", 6379);

   // Use the client
   await client.SetAsync("key", "value");
   var value = await client.GetAsync("key");
   Console.WriteLine(value);  // Outputs: value
   ```
