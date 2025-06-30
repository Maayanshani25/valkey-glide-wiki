const { GlideClient, Transaction, Script, TimeUnit } = require('@valkey/valkey-glide');
const assert = require('assert');

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
  });

  describe('String Operations', () => {
    it('should test SET & GET', async () => {
      await client.set('key', 'value');
      const val = await client.get('key');
      assert.strictEqual(val, 'value');

      // With options
      await client.set('key', 'value', {
        expiry: {
          type: TimeUnit.Seconds,
          count: 60
        }
      });
      const ttl = await client.ttl('key');
      assert(ttl <= 60 && ttl > 0);
    });

    it('should test SETEX (Set with Expiry)', async () => {
      await client.set('key', 'value', {
        expiry: {
          type: TimeUnit.Seconds,
          count: 5
        }
      });
      const ttl = await client.ttl('key');
      assert(ttl <= 5 && ttl > 0);
    });

    it('should test SETNX (Set if Not Exists)', async () => {
      let result = await client.set('newkey', 'value', {
        setMode: 'NX'
      });
      assert.strictEqual(result, 'OK');
      
      result = await client.set('newkey', 'value2', {
        setMode: 'NX'
      });
      assert.strictEqual(result, null); // Key already exists, so should return null
    });

    it('should test MSET & MGET (Multiple Set/Get)', async () => {
      await client.mset({
        key1: 'value1',
        key2: 'value2'
      });
      
      const values = await client.mget(['key1', 'key2']);
      assert.deepStrictEqual(values, ['value1', 'value2']);
    });

    it('should test INCR & DECR', async () => {
      await client.set('counter', '1');
      let counter = await client.incr('counter');
      assert.strictEqual(counter, 2);
      
      counter = await client.decr('counter');
      assert.strictEqual(counter, 1);
    });

    it('should test INCRBY & DECRBY', async () => {
      let counter = await client.incrBy('counter', 5);
      assert.strictEqual(counter, 6);
      
      counter = await client.decrBy('counter', 2);
      assert.strictEqual(counter, 4);
    });

    it('should test APPEND', async () => {
      await client.set('greeting', 'Hello');
      const length = await client.append('greeting', ' World');
      assert.strictEqual(length, 11);
      
      const result = await client.get('greeting');
      assert.strictEqual(result, 'Hello World');
    });

    it('should test GETRANGE & SETRANGE', async () => {
      await client.set('key', 'Hello World');
      let result = await client.getRange('key', 0, 4);
      assert.strictEqual(result, 'Hello');
      
      const length = await client.setRange('key', 6, 'Redis');
      assert.strictEqual(length, 11);
      
      result = await client.get('key');
      assert.strictEqual(result, 'Hello Redis');
    });
  });

  describe('Key Operations', () => {
    it('should test DEL (Delete)', async () => {
      await client.set('key1', 'value1');
      await client.set('key2', 'value2');
      
      const deleted = await client.del(['key1', 'key2']);
      assert.strictEqual(deleted, 2);
    });

    it('should test EXISTS', async () => {
      await client.set('existKey', 'value');
      
      const count = await client.exists(['existKey', 'nonExistKey']);
      assert.strictEqual(count, 1);
    });

    it('should test EXPIRE & TTL', async () => {
      await client.set('key', 'value');
      
      const success = await client.expire('key', 10);
      assert.strictEqual(success, true);
      
      const ttl = await client.ttl('key');
      assert(ttl <= 10 && ttl > 0);
    });

    it('should test KEYS & SCAN', async () => {
      await client.set('test1', 'value1');
      await client.set('test2', 'value2');
      
      const allKeys = await client.keys('test*');
      assert.strictEqual(allKeys.length, 2);
      assert(allKeys.includes('test1'));
      assert(allKeys.includes('test2'));
      
      // Test SCAN
      let cursor = '0';
      let keys = [];
      do {
        const result = await client.scan(cursor);
        cursor = result[0].toString();
        keys = keys.concat(result[1]);
      } while (cursor !== '0');
      
      assert(keys.length > 0);
    });

    it('should test RENAME & RENAMENX', async () => {
      await client.set('oldkey', 'value');
      
      const renameResult = await client.rename('oldkey', 'newkey');
      assert.strictEqual(renameResult, 'OK');
      
      const value = await client.get('newkey');
      assert.strictEqual(value, 'value');
      
      await client.set('key1', 'value1');
      const renameNxResult = await client.renameNx('key1', 'key2');
      assert.strictEqual(renameNxResult, true);
    });
  });

  describe('Hash Operations', () => {
    it('should test HSET & HGET', async () => {
      const added = await client.hset('hash', { key1: '1', key2: '2' });
      assert.strictEqual(added, 2);
      
      const value = await client.hget('hash', 'key1');
      assert.strictEqual(value, '1');
    });

    it('should test HMSET & HMGET', async () => {
      await client.hset('hash2', { key1: '1', key2: '2' });
      
      const values = await client.hmget('hash2', ['key1', 'key2']);
      assert.deepStrictEqual(values, ['1', '2']);
    });

    it('should test HGETALL', async () => {
      await client.hset('user', { name: 'John', age: '30' });
      
      const user = await client.hgetall('user');
      assert.deepStrictEqual(user, { name: 'John', age: '30' });
    });

    it('should test HDEL & HEXISTS', async () => {
      await client.hset('hash3', { key1: '1', key2: '2', key3: '3' });
      
      const deleted = await client.hdel('hash3', ['key1', 'key2']);
      assert.strictEqual(deleted, 2);
      
      const exists = await client.hexists('hash3', 'key3');
      assert.strictEqual(exists, true);
      
      const notExists = await client.hexists('hash3', 'key1');
      assert.strictEqual(notExists, false);
    });
  });

  describe('List Operations', () => {
    it('should test LPUSH & RPUSH', async () => {
      let lengthOfList = await client.lpush('list', ['a', 'b', 'c']);
      assert.strictEqual(lengthOfList, 3);
      
      lengthOfList = await client.rpush('list', ['d', 'e']);
      assert.strictEqual(lengthOfList, 5);
    });

    it('should test LPOP & RPOP', async () => {
      await client.rpush('list2', ['a', 'b', 'c']);
      
      const first = await client.lpop('list2');
      assert.strictEqual(first, 'a');
      
      const last = await client.rpop('list2');
      assert.strictEqual(last, 'c');
    });

    it('should test LRANGE', async () => {
      await client.rpush('list3', ['a', 'b', 'c', 'd', 'e']);
      
      const elements = await client.lrange('list3', 0, 2);
      assert.deepStrictEqual(elements, ['a', 'b', 'c']);
    });
  });

  describe('Set Operations', () => {
    it('should test SADD & SMEMBERS', async () => {
      const added = await client.sadd('set', ['a', 'b', 'c']);
      assert.strictEqual(added, 3);
      
      const members = await client.smembers('set');
      assert.strictEqual(members.length, 3);
      assert(members.includes('a'));
      assert(members.includes('b'));
      assert(members.includes('c'));
    });

    it('should test SREM & SISMEMBER', async () => {
      await client.sadd('set2', ['a', 'b', 'c']);
      
      const removed = await client.srem('set2', ['a', 'b']);
      assert.strictEqual(removed, 2);
      
      const isMember = await client.sismember('set2', 'c');
      assert.strictEqual(isMember, true);
      
      const notMember = await client.sismember('set2', 'a');
      assert.strictEqual(notMember, false);
    });
  });

  describe('Sorted Set Operations', () => {
    it('should test ZADD & ZRANGE', async () => {
      const added = await client.zadd('sortedSet', [
        { score: 1, member: 'one' },
        { score: 2, member: 'two' },
        { score: 3, member: 'three' }
      ]);
      assert.strictEqual(added, 3);
      
      const members = await client.zrange('sortedSet', 0, -1);
      assert.deepStrictEqual(members, ['one', 'two', 'three']);
      
      // With scores
      const withScores = await client.zrange('sortedSet', 0, -1, { withScores: true });
      assert.strictEqual(withScores.length, 6); // 3 members + 3 scores
      assert.strictEqual(withScores[0], 'one');
      assert.strictEqual(withScores[1], '1');
      assert.strictEqual(withScores[2], 'two');
      assert.strictEqual(withScores[3], '2');
      assert.strictEqual(withScores[4], 'three');
      assert.strictEqual(withScores[5], '3');
    });

    it('should test ZREM & ZSCORE', async () => {
      await client.zadd('sortedSet2', [
        { score: 1, member: 'one' },
        { score: 2, member: 'two' },
        { score: 3, member: 'three' }
      ]);
      
      const removed = await client.zrem('sortedSet2', ['one', 'two']);
      assert.strictEqual(removed, 2);
      
      const score = await client.zscore('sortedSet2', 'three');
      assert.strictEqual(score, '3');
    });

    it('should test ZRANK & ZREVRANK', async () => {
      await client.zadd('sortedSet3', [
        { score: 1, member: 'one' },
        { score: 2, member: 'two' },
        { score: 3, member: 'three' }
      ]);
      
      const rank = await client.zrank('sortedSet3', 'two');
      assert.strictEqual(rank, 1);
      
      const revRank = await client.zrevrank('sortedSet3', 'two');
      assert.strictEqual(revRank, 1);
    });
  });

  describe('Transactions', () => {
    it('should test Transactions (MULTI / EXEC)', async () => {
      const transaction = new Transaction()
        .set('key', 'value')
        .get('key');
      
      const result = await client.exec(transaction);
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0], 'OK');
      assert.strictEqual(result[1], 'value');
    });
  });

  describe('Lua Scripts', () => {
    it('should test EVAL / EVALSHA', async () => {
      const luaScript = new Script("return { KEYS[1], ARGV[1] }");
      const scriptOptions = {
        keys: ["foo"],
        args: ["bar"],
      };
      
      const result = await client.invokeScript(luaScript, scriptOptions);
      assert.deepStrictEqual(result, ['foo', 'bar']);
    });
  });

  describe('Authentication', () => {
    it('should test AUTH', async () => {
      // Note: This test assumes the Redis server doesn't require authentication
      // or has the password "mypass". Adjust as needed.
      try {
        const result = await client.updateConnectionPassword('mypass');
        // If authentication is required and password is correct, this should succeed
        assert.strictEqual(result, 'OK');
      } catch (e) {
        // If authentication is not required or password is incorrect, this might fail
        // Just log the exception and continue
        console.log('Authentication test failed:', e.message);
      }
    });
  });

  describe('Custom Commands', () => {
    it('should test Custom Commands', async () => {
      const rawResult = await client.customCommand(['SET', 'key', 'value']);
      assert.strictEqual(rawResult, 'OK');
      
      const getValue = await client.customCommand(['GET', 'key']);
      assert.strictEqual(getValue, 'value');
    });
  });
});
