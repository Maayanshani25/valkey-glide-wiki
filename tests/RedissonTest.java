import org.redisson.Redisson;
import org.redisson.api.*;
import org.redisson.config.Config;
import java.time.Duration;
import java.util.*;

/**
 * Test examples showing Redisson usage patterns for migration reference.
 * These examples demonstrate common Redisson operations that can be migrated to Valkey Glide.
 */
public class RedissonTest {
    
    private RedissonClient redisson;
    
    public void setUp() {
        Config config = new Config();
        config.useSingleServer()
            .setAddress("redis://localhost:6379");
        redisson = Redisson.create(config);
    }
    
    // String Operations
    public void testStringOperations() {
        // SET & GET
        RBucket<String> bucket = redisson.getBucket("key");
        bucket.set("value");
        String value = bucket.get(); // "value"
        
        // SETEX (Set with expiry)
        bucket.set("value", Duration.ofSeconds(5));
        
        // SETNX (Set if not exists)
        boolean result = bucket.trySet("value");
        
        // MSET & MGET
        RBuckets buckets = redisson.getBuckets();
        Map<String, String> map = new HashMap<>();
        map.put("key1", "value1");
        map.put("key2", "value2");
        buckets.set(map);
        
        Map<String, String> values = buckets.get("key1", "key2");
        
        // INCR & DECR
        RAtomicLong counter = redisson.getAtomicLong("counter");
        counter.set(1);
        counter.incrementAndGet(); // 2
        counter.decrementAndGet(); // 1
        
        // INCRBY & DECRBY
        counter.addAndGet(5); // 6
        counter.addAndGet(-2); // 4
        
        // APPEND (manual implementation)
        RBucket<String> greeting = redisson.getBucket("greeting");
        greeting.set("Hello");
        String current = greeting.get();
        greeting.set(current + " World");
    }
    
    // Key Operations
    public void testKeyOperations() {
        // DEL
        redisson.getBucket("key1").delete();
        RKeys keys = redisson.getKeys();
        long deleted = keys.delete("key1", "key2");
        
        // EXISTS
        boolean exists = redisson.getBucket("key").isExists();
        long count = keys.countExists("key1", "key2");
        
        // EXPIRE & TTL
        RBucket<String> bucket = redisson.getBucket("key");
        bucket.set("value");
        boolean success = bucket.expire(Duration.ofSeconds(10));
        long ttl = bucket.remainTimeToLive();
        
        // KEYS & SCAN
        Iterable<String> allKeys = keys.getKeysByPattern("*");
        Iterable<String> keysIterable = keys.getKeysStream().toIterable();
        
        // RENAME & RENAMENX
        bucket.rename("newkey");
        boolean renamed = bucket.renamenx("key2");
    }
    
    // Hash Operations
    public void testHashOperations() {
        RMap<String, String> map = redisson.getMap("hash");
        
        // HSET & HGET
        map.put("key1", "1");
        String value = map.get("key1");
        
        // HMSET & HMGET
        Map<String, String> fields = new HashMap<>();
        fields.put("key1", "1");
        fields.put("key2", "2");
        map.putAll(fields);
        
        Map<String, String> values = map.getAll(Set.of("key1", "key2"));
        
        // HGETALL
        Map<String, String> allFields = map.readAllMap();
        
        // HDEL & HEXISTS
        map.remove("key1");
        boolean exists = map.containsKey("key3");
    }
    
    // List Operations
    public void testListOperations() {
        RList<String> list = redisson.getList("list");
        
        // LPUSH & RPUSH
        list.addFirst("c");
        list.addFirst("b");
        list.addFirst("a"); // [a, b, c]
        
        list.add("d");
        list.add("e"); // [a, b, c, d, e]
        
        // LPOP & RPOP
        String first = list.removeFirst(); // "a"
        String last = list.removeLast(); // "e"
        
        // LRANGE
        List<String> elements = list.range(0, 2);
    }
    
    // Set Operations
    public void testSetOperations() {
        RSet<String> set = redisson.getSet("set");
        
        // SADD & SMEMBERS
        set.add("a");
        set.add("b");
        set.add("c");
        
        Set<String> members = set.readAll();
        
        // SREM & SISMEMBER
        set.remove("a");
        boolean isMember = set.contains("c");
    }
    
    // Sorted Set Operations
    public void testSortedSetOperations() {
        RScoredSortedSet<String> sortedSet = redisson.getScoredSortedSet("sortedSet");
        
        // ZADD & ZRANGE
        sortedSet.add(1.0, "one");
        sortedSet.add(2.0, "two");
        sortedSet.add(3.0, "three");
        
        Collection<String> members = sortedSet.valueRange(0, -1);
        Collection<ScoredEntry<String>> withScores = sortedSet.entryRange(0, -1);
        
        // ZREM & ZSCORE
        sortedSet.remove("one");
        Double score = sortedSet.getScore("three");
        
        // ZRANK & ZREVRANK
        Integer rank = sortedSet.rank("two");
        Integer revRank = sortedSet.revRank("two");
    }
    
    // Transactions
    public void testTransactions() {
        RBatch batch = redisson.createBatch();
        
        batch.getBucket("key").setAsync("value");
        batch.getAtomicLong("counter").incrementAndGetAsync();
        batch.getBucket("key").getAsync();
        
        BatchResult<?> result = batch.execute();
        List<?> responses = result.getResponses();
    }
    
    // Lua Scripts
    public void testLuaScripts() {
        RScript script = redisson.getScript();
        
        // EVAL
        String luaScript = "return 'Hello, Lua!'";
        Object result = script.eval(RScript.Mode.READ_ONLY, luaScript, RScript.ReturnType.VALUE);
        
        // With keys and arguments
        String scriptWithArgs = "return {KEYS[1], ARGV[1]}";
        List<Object> resultWithArgs = script.eval(RScript.Mode.READ_ONLY, scriptWithArgs, 
            RScript.ReturnType.MULTI, Arrays.asList("key"), "value");
        
        // EVALSHA
        String sha1 = script.scriptLoad(scriptWithArgs);
        List<Object> shaResult = script.evalSha(RScript.Mode.READ_ONLY, sha1, 
            RScript.ReturnType.MULTI, Arrays.asList("key"), "value");
    }
    
    // Connection and Configuration
    public void testConnectionSetup() {
        // Standalone connection
        Config config = new Config();
        config.useSingleServer()
            .setAddress("redis://localhost:6379")
            .setPassword("password")
            .setDatabase(0)
            .setTimeout(2000);
        RedissonClient redisson = Redisson.create(config);
        
        // Cluster connection
        Config clusterConfig = new Config();
        clusterConfig.useClusterServers()
            .addNodeAddress("redis://127.0.0.1:7000")
            .addNodeAddress("redis://127.0.0.1:7001")
            .setPassword("password")
            .setTimeout(2000)
            .setRetryAttempts(5);
        RedissonClient cluster = Redisson.create(clusterConfig);
    }
    
    // Advanced Features
    public void testAdvancedFeatures() {
        // Distributed Lock
        RLock lock = redisson.getLock("myLock");
        try {
            if (lock.tryLock(10, 30, java.util.concurrent.TimeUnit.SECONDS)) {
                // Do work
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
        
        // Semaphore
        RSemaphore semaphore = redisson.getSemaphore("mySemaphore");
        semaphore.trySetPermits(3);
        try {
            semaphore.acquire();
            // Do work
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            semaphore.release();
        }
        
        // CountDownLatch
        RCountDownLatch latch = redisson.getCountDownLatch("myLatch");
        latch.trySetCount(5);
        try {
            latch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Pub/Sub
        RTopic topic = redisson.getTopic("myTopic");
        topic.addListener(String.class, (channel, msg) -> {
            System.out.println("Received: " + msg);
        });
        topic.publish("Hello World");
        
        // Bloom Filter
        RBloomFilter<String> bloomFilter = redisson.getBloomFilter("myFilter");
        bloomFilter.tryInit(1000, 0.01);
        bloomFilter.add("item1");
        boolean contains = bloomFilter.contains("item1");
    }
    
    public void tearDown() {
        if (redisson != null) {
            redisson.shutdown();
        }
    }
}
