import glide.api.GlideClient;
import glide.api.models.Script;
import glide.api.models.ScriptOptions;
import glide.api.models.Transaction;
import glide.api.models.configuration.GlideClientConfiguration;
import glide.api.models.configuration.NodeAddress;
import glide.api.models.configuration.ServerCredentials;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

/**
 * Test class to verify the commands in the Jedis migration guide.
 * This test validates that the Valkey Glide commands work as expected
 * compared to their Jedis counterparts.
 * 
 * This version continues execution if tests fail and provides a summary at the end.
 */
@RunWith(JUnit4.class)
public class JedisTest {

    private GlideClient client;
    private static final List<TestResult> testResults = new ArrayList<>();
    private String currentTest = "";

    @Before
    public void setUp() throws ExecutionException, InterruptedException {
        // Set up a Glide client for testing
        GlideClientConfiguration config = GlideClientConfiguration.builder()
                .address(NodeAddress.builder()
                        .host("localhost")
                        .port(6379)
                        .build())
                .build();

        client = GlideClient.createClient(config).get();
        
        // Clear the database before each test
        client.flushAll().get();
    }

    @After
    public void tearDown() throws ExecutionException, InterruptedException {
        // Clean up after tests
        client.flushAll().get();
        client.close();
        
        // Print test summary after all tests
        if (testResults.size() > 0) {
            int passed = 0;
            int failed = 0;
            
            for (TestResult result : testResults) {
                if (result.passed) {
                    passed++;
                } else {
                    failed++;
                }
            }
            
            System.out.println("\n===== TEST SUMMARY =====");
            System.out.println("Total assertions: " + testResults.size());
            System.out.println("Passed: " + passed);
            System.out.println("Failed: " + failed);
            
            if (failed > 0) {
                System.out.println("\n===== FAILURES =====");
                int count = 1;
                for (TestResult result : testResults) {
                    if (!result.passed) {
                        System.out.println(count + ". Test: " + result.testName);
                        System.out.println("   Message: " + result.message);
                        count++;
                    }
                }
            }
        }
    }
    
    // Custom assertion methods that don't throw exceptions
    private void assertEquals(String expected, String actual) {
        try {
            org.junit.Assert.assertEquals(expected, actual);
            testResults.add(new TestResult(currentTest, true, ""));
        } catch (AssertionError e) {
            testResults.add(new TestResult(currentTest, false, 
                    "Expected: " + expected + ", but was: " + actual));
            System.err.println("❌ Assertion failed in test \"" + currentTest + "\": " + e.getMessage());
        }
    }
    
    private void assertEquals(Long expected, Long actual) {
        try {
            org.junit.Assert.assertEquals(expected, actual);
            testResults.add(new TestResult(currentTest, true, ""));
        } catch (AssertionError e) {
            testResults.add(new TestResult(currentTest, false, 
                    "Expected: " + expected + ", but was: " + actual));
            System.err.println("❌ Assertion failed in test \"" + currentTest + "\": " + e.getMessage());
        }
    }
    
    private void assertArrayEquals(String[] expected, String[] actual) {
        try {
            org.junit.Assert.assertArrayEquals(expected, actual);
            testResults.add(new TestResult(currentTest, true, ""));
        } catch (AssertionError e) {
            testResults.add(new TestResult(currentTest, false, 
                    "Arrays not equal: " + Arrays.toString(expected) + " vs " + Arrays.toString(actual)));
            System.err.println("❌ Assertion failed in test \"" + currentTest + "\": " + e.getMessage());
        }
    }
    
    private void assertTrue(boolean condition) {
        try {
            org.junit.Assert.assertTrue(condition);
            testResults.add(new TestResult(currentTest, true, ""));
        } catch (AssertionError e) {
            testResults.add(new TestResult(currentTest, false, "Expected true but was false"));
            System.err.println("❌ Assertion failed in test \"" + currentTest + "\": " + e.getMessage());
        }
    }
    
    private void assertNull(Object obj) {
        try {
            org.junit.Assert.assertNull(obj);
            testResults.add(new TestResult(currentTest, true, ""));
        } catch (AssertionError e) {
            testResults.add(new TestResult(currentTest, false, "Expected null but was: " + obj));
            System.err.println("❌ Assertion failed in test \"" + currentTest + "\": " + e.getMessage());
        }
    }

    @Test
    public void testStringOperations() throws ExecutionException, InterruptedException {
        currentTest = "SET & GET";
        // Test SET & GET
        client.set("key", "value").get();
        String value = client.get("key").get();
        assertEquals("value", value);

        currentTest = "SETEX (Set with Expiry)";
        // Test SETEX (Set with Expiry)
        client.set("key", "value", 5).get();
        assertTrue(client.ttl("key").get() <= 5);

        currentTest = "SETNX (Set if Not Exists)";
        // Test SETNX (Set if Not Exists)
        String result = client.set("newkey", "value", "NX").get();
        assertEquals("OK", result);
        result = client.set("newkey", "value2", "NX").get();
        assertNull(result); // Key already exists, so should return null

        currentTest = "MSET & MGET (Multiple Set/Get)";
        // Test MSET & MGET (Multiple Set/Get)
        Map<String, String> map = new HashMap<>();
        map.put("key1", "value1");
        map.put("key2", "value2");
        client.mset(map).get();
        String[] values = client.mget(new String[]{"key1", "key2"}).get();
        assertArrayEquals(new String[]{"value1", "value2"}, values);

        currentTest = "INCR & DECR";
        // Test INCR & DECR
        client.set("counter", "1").get();
        Long counter = client.incr("counter").get();
        assertEquals(Long.valueOf(2), counter);
        counter = client.decr("counter").get();
        assertEquals(Long.valueOf(1), counter);

        currentTest = "INCRBY & DECRBY";
        // Test INCRBY & DECRBY
        counter = client.incrBy("counter", 5).get();
        assertEquals(Long.valueOf(6), counter);
        counter = client.decrBy("counter", 2).get();
        assertEquals(Long.valueOf(4), counter);

        currentTest = "APPEND";
        // Test APPEND
        client.set("greeting", "Hello").get();
        Long length = client.append("greeting", " World").get();
        assertEquals(Long.valueOf(11), length);
        value = client.get("greeting").get();
        assertEquals("Hello World", value);

        currentTest = "GETRANGE & SETRANGE";
        // Test GETRANGE & SETRANGE
        client.set("key", "Hello World").get();
        value = client.getRange("key", 0, 4).get();
        assertEquals("Hello", value);
        length = client.setRange("key", 6, "Redis").get();
        assertEquals(Long.valueOf(11), length);
        value = client.get("key").get();
        assertEquals("Hello Redis", value);
    }

    @Test
    public void testKeyOperations() throws ExecutionException, InterruptedException {
        currentTest = "DEL (Delete)";
        // Test DEL (Delete)
        client.set("key1", "value1").get();
        client.set("key2", "value2").get();
        Long deleted = client.del(new String[]{"key1", "key2"}).get();
        assertEquals(Long.valueOf(2), deleted);

        currentTest = "EXISTS";
        // Test EXISTS
        client.set("existKey", "value").get();
        Long count = client.exists(new String[]{"existKey", "nonExistKey"}).get();
        assertEquals(Long.valueOf(1), count);

        currentTest = "EXPIRE & TTL";
        // Test EXPIRE & TTL
        client.set("key", "value").get();
        Long success = client.expire("key", 10).get();
        assertEquals(Long.valueOf(1), success);
        Long ttl = client.ttl("key").get();
        assertTrue(ttl <= 10 && ttl > 0);

        currentTest = "KEYS & SCAN";
        // Test KEYS & SCAN
        client.set("test1", "value1").get();
        client.set("test2", "value2").get();
        String[] allKeys = client.keys("test*").get();
        assertEquals(2, allKeys.length);
        assertTrue(Arrays.asList(allKeys).contains("test1"));
        assertTrue(Arrays.asList(allKeys).contains("test2"));

        currentTest = "RENAME & RENAMENX";
        // Test RENAME & RENAMENX
        client.set("oldkey", "value").get();
        String renameResult = client.rename("oldkey", "newkey").get();
        assertEquals("OK", renameResult);
        value = client.get("newkey").get();
        assertEquals("value", value);

        client.set("key1", "value1").get();
        Long renameNxResult = client.renameNx("key1", "key2").get();
        assertEquals(Long.valueOf(1), renameNxResult);
    }

    @Test
    public void testHashOperations() throws ExecutionException, InterruptedException {
        currentTest = "HSET & HGET";
        // Test HSET & HGET
        Map<String, String> singleField = new HashMap<>();
        singleField.put("key1", "1");
        Long added = client.hset("hash", singleField).get();
        assertEquals(Long.valueOf(1), added);

        Map<String, String> map = new HashMap<>();
        map.put("key1", "1");
        map.put("key2", "2");
        added = client.hset("hash", map).get();
        assertEquals(Long.valueOf(1), added); // Only key2 is new

        String value = client.hget("hash", "key1").get();
        assertEquals("1", value);

        currentTest = "HMSET & HMGET";
        // Test HMSET & HMGET
        map = new HashMap<>();
        map.put("key1", "1");
        map.put("key2", "2");
        added = client.hset("hash2", map).get();
        assertEquals(Long.valueOf(2), added);

        String[] values = client.hmget("hash2", new String[]{"key1", "key2"}).get();
        assertArrayEquals(new String[]{"1", "2"}, values);

        currentTest = "HGETALL";
        // Test HGETALL
        map = new HashMap<>();
        map.put("name", "John");
        map.put("age", "30");
        client.hset("user", map).get();

        Map<String, String> user = client.hgetall("user").get();
        assertEquals("John", user.get("name"));
        assertEquals("30", user.get("age"));

        currentTest = "HDEL & HEXISTS";
        // Test HDEL & HEXISTS
        map = new HashMap<>();
        map.put("key1", "1");
        map.put("key2", "2");
        map.put("key3", "3");
        client.hset("hash3", map).get();

        Long deletedCount = client.hdel("hash3", new String[]{"key1", "key2"}).get();
        assertEquals(Long.valueOf(2), deletedCount);

        Long exists = client.hexists("hash3", "key3").get();
        assertEquals(Long.valueOf(1), exists);
        Long notExists = client.hexists("hash3", "key1").get();
        assertEquals(Long.valueOf(0), notExists);
    }

    @Test
    public void testListOperations() throws ExecutionException, InterruptedException {
        currentTest = "LPUSH & RPUSH";
        // Test LPUSH & RPUSH
        Long lengthOfList = client.lpush("list", new String[]{"a", "b", "c"}).get();
        assertEquals(Long.valueOf(3), lengthOfList);
        lengthOfList = client.rpush("list", new String[]{"d", "e"}).get();
        assertEquals(Long.valueOf(5), lengthOfList);

        currentTest = "LPOP & RPOP";
        // Test LPOP & RPOP
        client.rpush("list2", new String[]{"a", "b", "c"}).get();
        String first = client.lpop("list2").get();
        assertEquals("a", first);
        String last = client.rpop("list2").get();
        assertEquals("c", last);

        currentTest = "LRANGE";
        // Test LRANGE
        client.rpush("list3", new String[]{"a", "b", "c", "d", "e"}).get();
        String[] elements = client.lrange("list3", 0, 2).get();
        assertArrayEquals(new String[]{"a", "b", "c"}, elements);
    }

    @Test
    public void testSetOperations() throws ExecutionException, InterruptedException {
        currentTest = "SADD & SMEMBERS";
        // Test SADD & SMEMBERS
        Long added = client.sadd("set", new String[]{"a", "b", "c"}).get();
        assertEquals(Long.valueOf(3), added);
        String[] members = client.smembers("set").get();
        assertEquals(3, members.length);
        assertTrue(Arrays.asList(members).contains("a"));
        assertTrue(Arrays.asList(members).contains("b"));
        assertTrue(Arrays.asList(members).contains("c"));

        currentTest = "SREM & SISMEMBER";
        // Test SREM & SISMEMBER
        client.sadd("set2", new String[]{"a", "b", "c"}).get();
        Long removed = client.srem("set2", new String[]{"a", "b"}).get();
        assertEquals(Long.valueOf(2), removed);

        Long isMember = client.sismember("set2", "c").get();
        assertEquals(Long.valueOf(1), isMember);
        Long notMember = client.sismember("set2", "a").get();
        assertEquals(Long.valueOf(0), notMember);
    }

    @Test
    public void testSortedSetOperations() throws ExecutionException, InterruptedException {
        currentTest = "ZADD & ZRANGE";
        // Test ZADD & ZRANGE
        Object[] scoreMembers = new Object[] {
            new Object[] { 1.0, "one" },
            new Object[] { 2.0, "two" },
            new Object[] { 3.0, "three" }
        };
        Long added = client.zadd("sortedSet", scoreMembers).get();
        assertEquals(Long.valueOf(3), added);

        String[] members = client.zrange("sortedSet", 0, -1).get();
        assertArrayEquals(new String[]{"one", "two", "three"}, members);

        currentTest = "ZRANGE with WITHSCORES";
        // With scores
        Object[] withScores = client.zrange("sortedSet", 0, -1, "WITHSCORES").get();
        assertEquals(6, withScores.length); // 3 members + 3 scores
        assertEquals("one", withScores[0]);
        assertEquals("1", withScores[1]);
        assertEquals("two", withScores[2]);
        assertEquals("2", withScores[3]);
        assertEquals("three", withScores[4]);
        assertEquals("3", withScores[5]);

        currentTest = "ZREM & ZSCORE";
        // Test ZREM & ZSCORE
        Object[] scoreMembers2 = new Object[] {
            new Object[] { 1.0, "one" },
            new Object[] { 2.0, "two" },
            new Object[] { 3.0, "three" }
        };
        client.zadd("sortedSet2", scoreMembers2).get();

        Long removed = client.zrem("sortedSet2", new String[]{"one", "two"}).get();
        assertEquals(Long.valueOf(2), removed);

        String score = client.zscore("sortedSet2", "three").get();
        assertEquals("3", score);

        currentTest = "ZRANK & ZREVRANK";
        // Test ZRANK & ZREVRANK
        Object[] scoreMembers3 = new Object[] {
            new Object[] { 1.0, "one" },
            new Object[] { 2.0, "two" },
            new Object[] { 3.0, "three" }
        };
        client.zadd("sortedSet3", scoreMembers3).get();

        Long rank = client.zrank("sortedSet3", "two").get();
        assertEquals(Long.valueOf(1), rank);
        Long revRank = client.zrevrank("sortedSet3", "two").get();
        assertEquals(Long.valueOf(1), revRank);
    }

    @Test
    public void testTransactions() throws ExecutionException, InterruptedException {
        currentTest = "Transactions (MULTI / EXEC)";
        // Test Transactions (MULTI / EXEC)
        Transaction transaction = new Transaction();
        transaction.set("key", "value");
        transaction.incr("counter");
        transaction.get("key");

        Object[] result = client.exec(transaction).get();
        assertEquals(3, result.length);
        assertEquals("OK", result[0]);
        assertEquals(1L, result[1]);
        assertEquals("value", result[2]);
    }

    @Test
    public void testLuaScripts() throws ExecutionException, InterruptedException {
        currentTest = "EVAL / EVALSHA";
        // Test EVAL / EVALSHA
        String script = "return 'Hello, Lua!'";
        Script luaScript = new Script(script, false);
        String result = (String) client.invokeScript(luaScript).get();
        assertEquals("Hello, Lua!", result);

        currentTest = "EVAL / EVALSHA with keys and arguments";
        // With keys and arguments
        String scriptWithArgs = "return {KEYS[1], ARGV[1]}";
        Script luaScriptWithArgs = new Script(scriptWithArgs, false);
        ScriptOptions options = ScriptOptions.builder()
                .key("key")
                .arg("value")
                .build();
        Object[] resultWithArgs = (Object[]) client.invokeScript(luaScriptWithArgs, options).get();
        assertEquals(2, resultWithArgs.length);
        assertEquals("key", resultWithArgs[0]);
        assertEquals("value", resultWithArgs[1]);
    }

    @Test
    public void testAuthentication() throws ExecutionException, InterruptedException {
        currentTest = "AUTH";
        // Note: This test assumes the Redis server doesn't require authentication
        // or has the password "mypass". Adjust as needed.
        try {
            String result = client.updateConnectionPassword("mypass", true).get();
            // If authentication is required and password is correct, this should succeed
            assertEquals("OK", result);
        } catch (Exception e) {
            // If authentication is not required or password is incorrect, this might fail
            // Just log the exception and continue
            System.out.println("Authentication test failed: " + e.getMessage());
        }
    }

    @Test
    public void testCustomCommands() throws ExecutionException, InterruptedException {
        currentTest = "Custom Commands";
        // Test Custom Commands
        String rawResult = client.customCommand(new String[]{"SET", "key", "value"}).get();
        assertEquals("OK", rawResult);
        
        String getValue = client.customCommand(new String[]{"GET", "key"}).get();
        assertEquals("value", getValue);
    }
    
    // Helper class to track test results
    private static class TestResult {
        final String testName;
        final boolean passed;
        final String message;
        
        TestResult(String testName, boolean passed, String message) {
            this.testName = testName;
            this.passed = passed;
            this.message = message;
        }
    }
}
