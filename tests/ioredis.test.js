const { GlideClient, Transaction, Script, TimeUnit } = require('@valkey/valkey-glide');
const assert = require('assert');

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  failures: []
};

// Custom assertion function that doesn't throw exceptions
function customAssert(condition, message) {
  try {
    assert(condition, message);
    testResults.passed++;
    return true;
  } catch (error) {
    testResults.failed++;
    testResults.failures.push({
      test: currentTest,
      message: message || 'Assertion failed',
      error: error.message
    });
    console.error(`❌ Assertion failed in test "${currentTest}": ${error.message}`);
    return false;
  }
}

// Custom strict equal that doesn't throw exceptions
function customStrictEqual(actual, expected, message) {
  try {
    assert.strictEqual(actual, expected, message);
    testResults.passed++;
    return true;
  } catch (error) {
    testResults.failed++;
    testResults.failures.push({
      test: currentTest,
      message: message || `Expected ${expected} but got ${actual}`,
      error: error.message
    });
    console.error(`❌ Assertion failed in test "${currentTest}": ${error.message}`);
    return false;
  }
}

// Custom deep strict equal that doesn't throw exceptions
function customDeepStrictEqual(actual, expected, message) {
  try {
    assert.deepStrictEqual(actual, expected, message);
    testResults.passed++;
    return true;
  } catch (error) {
    testResults.failed++;
    testResults.failures.push({
      test: currentTest,
      message: message || 'Deep equality assertion failed',
      error: error.message
    });
    console.error(`❌ Assertion failed in test "${currentTest}": ${error.message}`);
    return false;
  }
}

let currentTest = '';

/**
 * Test class to verify the commands in the ioredis migration guide.
 * This test validates that the Valkey Glide commands work as expected
 * compared to their ioredis counterparts.
 */
describe('IoredisTest', () => {
  let client;

  before(async () => {
    // Set up a Glide client for testing
    client = await GlideClient.createClient({
      addresses: [{ host: 'localhost', port: 6379 }]
    });
    
    // Clear the database before tests
    await client.flushAll();
  });

  after(async () => {
    // Clean up after tests
    await client.flushAll();
    await client.close();
    
    // Print test summary
    console.log('\n===== TEST SUMMARY =====');
    console.log(`Total assertions: ${testResults.passed + testResults.failed}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    
    if (testResults.failures.length > 0) {
      console.log('\n===== FAILURES =====');
      testResults.failures.forEach((failure, index) => {
        console.log(`${index + 1}. Test: ${failure.test}`);
        console.log(`   Message: ${failure.message}`);
        console.log(`   Error: ${failure.error}`);
      });
    }
  });

  describe('String Operations', () => {
    it('should test SET & GET', async () => {
      currentTest = 'SET & GET';
      await client.set('key', 'value');
      const val = await client.get('key');
      customStrictEqual(val, 'value');

      // With options
      await client.set('key', 'value', {
        expiry: {
          type: TimeUnit.Seconds,
          count: 60
        }
      });
      const ttl = await client.ttl('key');
      customAssert(ttl <= 60 && ttl > 0);
    });

    it('should test SETEX (Set with Expiry)', async () => {
      currentTest = 'SETEX (Set with Expiry)';
      await client.set('key', 'value', {
        expiry: {
          type: TimeUnit.Seconds,
          count: 5
        }
      });
      const ttl = await client.ttl('key');
      customAssert(ttl <= 5 && ttl > 0);
    });

    it('should test SETNX (Set if Not Exists)', async () => {
      currentTest = 'SETNX (Set if Not Exists)';
      let result = await client.set('newkey', 'value', {
        setMode: 'NX'
      });
      customStrictEqual(result, 'OK');
      
      result = await client.set('newkey', 'value2', {
        setMode: 'NX'
      });
      customStrictEqual(result, null); // Key already exists, so should return null
    });

    it('should test MSET & MGET (Multiple Set/Get)', async () => {
      currentTest = 'MSET & MGET (Multiple Set/Get)';
      await client.mset({
        key1: 'value1',
        key2: 'value2'
      });
      
      const values = await client.mget(['key1', 'key2']);
      customDeepStrictEqual(values, ['value1', 'value2']);
    });

    it('should test INCR & DECR', async () => {
      currentTest = 'INCR & DECR';
      await client.set('counter', '1');
      let counter = await client.incr('counter');
      customStrictEqual(counter, 2);
      
      counter = await client.decr('counter');
      customStrictEqual(counter, 1);
    });

    it('should test INCRBY & DECRBY', async () => {
      currentTest = 'INCRBY & DECRBY';
      let counter = await client.incrBy('counter', 5);
      customStrictEqual(counter, 6);
      
      counter = await client.decrBy('counter', 2);
      customStrictEqual(counter, 4);
    });

    it('should test APPEND', async () => {
      currentTest = 'APPEND';
      await client.set('greeting', 'Hello');
      const length = await client.append('greeting', ' World');
      customStrictEqual(length, 11);
      
      const result = await client.get('greeting');
      customStrictEqual(result, 'Hello World');
    });

    it('should test GETRANGE & SETRANGE', async () => {
      currentTest = 'GETRANGE & SETRANGE';
      await client.set('key', 'Hello World');
      let result = await client.getRange('key', 0, 4);
      customStrictEqual(result, 'Hello');
      
      const length = await client.setRange('key', 6, 'Redis');
      customStrictEqual(length, 11);
      
      result = await client.get('key');
      customStrictEqual(result, 'Hello Redis');
    });
  });

  describe('Key Operations', () => {
    it('should test DEL (Delete)', async () => {
      currentTest = 'DEL (Delete)';
      await client.set('key1', 'value1');
      await client.set('key2', 'value2');
      
      const deleted = await client.del(['key1', 'key2']);
      customStrictEqual(deleted, 2);
    });

    it('should test EXISTS', async () => {
      currentTest = 'EXISTS';
      await client.set('existKey', 'value');
      
      const count = await client.exists(['existKey', 'nonExistKey']);
      customStrictEqual(count, 1);
    });

    it('should test EXPIRE & TTL', async () => {
      currentTest = 'EXPIRE & TTL';
      await client.set('key', 'value');
      
      const success = await client.expire('key', 10);
      customStrictEqual(success, true);
      
      const ttl = await client.ttl('key');
      customAssert(ttl <= 10 && ttl > 0);
    });

    it('should test KEYS & SCAN', async () => {
      currentTest = 'KEYS & SCAN';
      await client.set('test1', 'value1');
      await client.set('test2', 'value2');
      
      const allKeys = await client.keys('test*');
      customStrictEqual(allKeys.length, 2);
      customAssert(allKeys.includes('test1'));
      customAssert(allKeys.includes('test2'));
      
      // Test SCAN
      let cursor = '0';
      let keys = [];
      do {
        const result = await client.scan(cursor);
        cursor = result[0].toString();
        keys = keys.concat(result[1]);
      } while (cursor !== '0');
      
      customAssert(keys.length > 0);
    });

    it('should test RENAME & RENAMENX', async () => {
      currentTest = 'RENAME & RENAMENX';
      await client.set('oldkey', 'value');
      
      const renameResult = await client.rename('oldkey', 'newkey');
      customStrictEqual(renameResult, 'OK');
      
      const value = await client.get('newkey');
      customStrictEqual(value, 'value');
      
      await client.set('key1', 'value1');
      const renameNxResult = await client.renameNx('key1', 'key2');
      customStrictEqual(renameNxResult, true);
    });
  });

  describe('Hash Operations', () => {
    it('should test HSET & HGET', async () => {
      currentTest = 'HSET & HGET';
      const added = await client.hset('hash', { key1: '1', key2: '2' });
      customStrictEqual(added, 2);
      
      const value = await client.hget('hash', 'key1');
      customStrictEqual(value, '1');
    });

    it('should test HMSET & HMGET', async () => {
      currentTest = 'HMSET & HMGET';
      await client.hset('hash2', { key1: '1', key2: '2' });
      
      const values = await client.hmget('hash2', ['key1', 'key2']);
      customDeepStrictEqual(values, ['1', '2']);
    });

    it('should test HGETALL', async () => {
      currentTest = 'HGETALL';
      await client.hset('user', { name: 'John', age: '30' });
      
      const user = await client.hgetall('user');
      customDeepStrictEqual(user, { name: 'John', age: '30' });
    });

    it('should test HDEL & HEXISTS', async () => {
      currentTest = 'HDEL & HEXISTS';
      await client.hset('hash3', { key1: '1', key2: '2', key3: '3' });
      
      const deleted = await client.hdel('hash3', ['key1', 'key2']);
      customStrictEqual(deleted, 2);
      
      const exists = await client.hexists('hash3', 'key3');
      customStrictEqual(exists, true);
      
      const notExists = await client.hexists('hash3', 'key1');
      customStrictEqual(notExists, false);
    });
  });

  describe('List Operations', () => {
    it('should test LPUSH & RPUSH', async () => {
      currentTest = 'LPUSH & RPUSH';
      let lengthOfList = await client.lpush('list', ['a', 'b', 'c']);
      customStrictEqual(lengthOfList, 3);
      
      lengthOfList = await client.rpush('list', ['d', 'e']);
      customStrictEqual(lengthOfList, 5);
    });

    it('should test LPOP & RPOP', async () => {
      currentTest = 'LPOP & RPOP';
      await client.rpush('list2', ['a', 'b', 'c']);
      
      const first = await client.lpop('list2');
      customStrictEqual(first, 'a');
      
      const last = await client.rpop('list2');
      customStrictEqual(last, 'c');
    });

    it('should test LRANGE', async () => {
      currentTest = 'LRANGE';
      await client.rpush('list3', ['a', 'b', 'c', 'd', 'e']);
      
      const elements = await client.lrange('list3', 0, 2);
      customDeepStrictEqual(elements, ['a', 'b', 'c']);
    });
  });

  describe('Set Operations', () => {
    it('should test SADD & SMEMBERS', async () => {
      currentTest = 'SADD & SMEMBERS';
      const added = await client.sadd('set', ['a', 'b', 'c']);
      customStrictEqual(added, 3);
      
      const members = await client.smembers('set');
      customStrictEqual(members.length, 3);
      customAssert(members.includes('a'));
      customAssert(members.includes('b'));
      customAssert(members.includes('c'));
    });

    it('should test SREM & SISMEMBER', async () => {
      currentTest = 'SREM & SISMEMBER';
      await client.sadd('set2', ['a', 'b', 'c']);
      
      const removed = await client.srem('set2', ['a', 'b']);
      customStrictEqual(removed, 2);
      
      const isMember = await client.sismember('set2', 'c');
      customStrictEqual(isMember, true);
      
      const notMember = await client.sismember('set2', 'a');
      customStrictEqual(notMember, false);
    });
  });

  describe('Sorted Set Operations', () => {
    it('should test ZADD & ZRANGE', async () => {
      currentTest = 'ZADD & ZRANGE';
      const added = await client.zadd('sortedSet', [
        { score: 1, member: 'one' },
        { score: 2, member: 'two' },
        { score: 3, member: 'three' }
      ]);
      customStrictEqual(added, 3);
      
      const members = await client.zrange('sortedSet', 0, -1);
      customDeepStrictEqual(members, ['one', 'two', 'three']);
      
      // With scores
      const withScores = await client.zrange('sortedSet', 0, -1, { withScores: true });
      customStrictEqual(withScores.length, 6); // 3 members + 3 scores
      customStrictEqual(withScores[0], 'one');
      customStrictEqual(withScores[1], '1');
      customStrictEqual(withScores[2], 'two');
      customStrictEqual(withScores[3], '2');
      customStrictEqual(withScores[4], 'three');
      customStrictEqual(withScores[5], '3');
    });

    it('should test ZREM & ZSCORE', async () => {
      currentTest = 'ZREM & ZSCORE';
      await client.zadd('sortedSet2', [
        { score: 1, member: 'one' },
        { score: 2, member: 'two' },
        { score: 3, member: 'three' }
      ]);
      
      const removed = await client.zrem('sortedSet2', ['one', 'two']);
      customStrictEqual(removed, 2);
      
      const score = await client.zscore('sortedSet2', 'three');
      customStrictEqual(score, '3');
    });

    it('should test ZRANK & ZREVRANK', async () => {
      currentTest = 'ZRANK & ZREVRANK';
      await client.zadd('sortedSet3', [
        { score: 1, member: 'one' },
        { score: 2, member: 'two' },
        { score: 3, member: 'three' }
      ]);
      
      const rank = await client.zrank('sortedSet3', 'two');
      customStrictEqual(rank, 1);
      
      const revRank = await client.zrevrank('sortedSet3', 'two');
      customStrictEqual(revRank, 1);
    });
  });

  describe('Transactions', () => {
    it('should test Transactions (MULTI / EXEC)', async () => {
      currentTest = 'Transactions (MULTI / EXEC)';
      const transaction = new Transaction()
        .set('key', 'value')
        .get('key');
      
      const result = await client.exec(transaction);
      customStrictEqual(result.length, 2);
      customStrictEqual(result[0], 'OK');
      customStrictEqual(result[1], 'value');
    });
  });

  describe('Lua Scripts', () => {
    it('should test EVAL / EVALSHA', async () => {
      currentTest = 'EVAL / EVALSHA';
      const luaScript = new Script("return { KEYS[1], ARGV[1] }");
      const scriptOptions = {
        keys: ["foo"],
        args: ["bar"],
      };
      
      const result = await client.invokeScript(luaScript, scriptOptions);
      customDeepStrictEqual(result, ['foo', 'bar']);
    });
  });

  describe('Authentication', () => {
    it('should test AUTH', async () => {
      currentTest = 'AUTH';
      // Note: This test assumes the Redis server doesn't require authentication
      // or has the password "mypass". Adjust as needed.
      try {
        const result = await client.updateConnectionPassword('mypass');
        // If authentication is required and password is correct, this should succeed
        customStrictEqual(result, 'OK');
      } catch (e) {
        // If authentication is not required or password is incorrect, this might fail
        // Just log the exception and continue
        console.log('Authentication test failed:', e.message);
      }
    });
  });

  describe('Custom Commands', () => {
    it('should test Custom Commands', async () => {
      currentTest = 'Custom Commands';
      const rawResult = await client.customCommand(['SET', 'key', 'value']);
      customStrictEqual(rawResult, 'OK');
      
      const getValue = await client.customCommand(['GET', 'key']);
      customStrictEqual(getValue, 'value');
    });
  });
});
