Command              | Node        | Owner           | Function returns binary data? | Comment
--                   | --          | --              | --                            | --
append               | Done        | Lior Sventitzky | No                            |
auth                 | Not started |                 |                               | not in the API
bgsave               | Not started |                 |                               | not needed
bitcount             | In Progress | Andrew C        | No                            |
bitfield             | In Progress | Andrew C        |                               |
bitfield_ro          | In Progress | Andrew C        |                               |
bitop                | In Progress | Andrew C        | No                            |
bitpos               | In Progress | Andrew C        | No                            |
blmove               | Not started |                 |                               |
blmpop               | Not started |                 | Yes                           |
blpop                | WIP         | Lior Sventitzky | Yes                           |
brpop                | WIP         | Lior Sventitzky | Yes                           |
brpoplpush           | Not started |                 |                               | deprecated
bzmpop               | Not started |                 | Yes                           |
bzpopmax             | Not started |                 | Yes                           |
bzpopmin             | Not started |                 | Yes                           |
CLIENT GETNAME       | In Progress | Yury Fridlyand  | Yes                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
client ID            | In Progress | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
command              | Not started |                 |                               | N/A
Config get           | Not started |                 |                               |
Config resetstat     | Not started |                 |                               |
Config rewrite       | Not started |                 |                               |
Config set           | Not started |                 |                               |
copy                 | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
dbsize               | Not started |                 | No                            |
decr                 | Not started |                 | No                            |
decrby               | Not started |                 | No                            |
del                  | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
discard              | Not started |                 |                               | not in the API
dump                 | Not started |                 |                               |
echo                 | In Progress | Yury Fridlyand  | Yes                           | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
eval                 | Not started |                 |                               |
evalsha              | Not started |                 |                               |
exec                 | Not started |                 |                               |
exists               | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
expire               | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
expireat             | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
expiretime           | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
fcall                | Not started |                 | No                            |
fcall_ro             | Not started |                 | No                            |
flushall             | Not started |                 | No                            | No changes needed
flushdb              | Not started |                 | No                            |
function delete      | Not started |                 |                               |
function dump        | Not started |                 |                               |
function flush       | Not started |                 |                               |
function kill        | Not started |                 |                               |
function list        | Not started |                 |                               |
function load        | Not started |                 |                               |
function restore     | Not started |                 |                               |
function stats       | Not started |                 |                               |
geoadd               | In Progress | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geodist              | In Progress | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geohash              | In Progress | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geopos               | In Progress | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
georadius            | Not started |                 |                               | deprecated
georadiusbymember    | Not started |                 |                               | deprecated
georadiusbymember_ro | Not started |                 |                               | deprecated
georadius_ro         | Not started |                 |                               | deprecated
geosearch            | In Progress | Yury Fridlyand  | Yes                           | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geosearchstore       | In Progress | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
get                  | Done        | Adar Ovadia     | Yes                           |
getbit               | In Progress | Andrew C        | No                            |
getdel               | Done        | Adar Ovadia     | Yes                           |
getex                | Not started |                 |                               |
getrange             | Done        | Lior Sventitzky | Yes                           |
getset               | In Progress | Andrew C        |                               | deprecated
hdel                 | Not started |                 | No                            |
hexists              | Not started |                 | No                            |
hget                 | Done        | Lior Sventitzky |                               |
hgetall              | Not started |                 | Yes                           |
hincrby              | Not started |                 | No                            |
hincrbyfloat         | Not started |                 | No                            |
hkeys                | Not started |                 |                               |
hlen                 | Not started |                 |                               |
hmget                | Not started |                 |                               |
hmset                | Not started |                 |                               | deprecated
hrandfield           | Not started |                 |                               |
hscan                | Not started |                 |                               |
hset                 | Not started |                 |                               |
hsetnx               | Not started |                 | No                            |
hstrlen              | Not started |                 | No                            |
hvals                | Done        | Lior Sventitzky |                               |
incr                 | Not started |                 | No                            |
incrby               | Not started |                 | No                            |
incrbyfloat          | Not started |                 | No                            |
info                 | Not started |                 |                               | No changes needed
lastsave             | Not started |                 |                               | No changes needed
lcs                  | Not started |                 | Yes                           |
lindex               | Not started |                 |                               |
linsert              | Not started |                 |                               |
llen                 | Not started |                 | No                            |
lmove                | Not started |                 |                               |
lmpop                | Not started |                 | Yes                           |
lolwut               | Not started |                 |                               | No changes needed
lpop                 | WIP         | Lior Sventitzky | Yes                           |
lpopCount            | WIP         | Lior Sventitzky | Yes                           |
lpos                 | Not started |                 |                               |
lpush                | WIP         | Lior Sventitzky | No                            |
lpushx               | Not started |                 | No                            |
lrange               | WIP         | Lior Sventitzky | Yes                           |
lrem                 | Not started |                 | No                            |
lset                 | Not started |                 | No                            |
ltrim                | Not started |                 | No                            |
mget                 | WIP         | Lior Sventitzky | Yes                           |
move                 | Not started |                 | No                            |
mset                 | Not started |                 | No                            |
msetnx               | Not started |                 |                               |
multi                | Not started |                 |                               | No changes needed
object encoding      | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
object freq          | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
object idletime      | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
object refcount      | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
persist              | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pexpire              | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pexpireat            | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pexpiretime          | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pfadd                | Not started |                 | No                            |
pfcount              | Not started |                 | No                            |
pfmerge              | Not started |                 | Yes                           |
ping                 | Done        | Adar Ovadia     | Yes                           | Update in [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
psetex               | Not started |                 |                               | deprecated
psubscribe           | Not started |                 |                               |
pttl                 | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
publish              | Not started |                 |                               |
pubsub               | Not started |                 |                               |
punsubscribe         | Not started |                 |                               |
quit                 | Not started |                 |                               | not in the API
randomkey            | In Progress | Yury Fridlyand  | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
readonly             | Not started |                 |                               | N/A
readwrite            | Not started |                 |                               | not in the API
rename               | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
renamenx             | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
replicaof            | Not started |                 |                               | not in the API
restore              | Not started |                 |                               |
rpop                 | WIP         | Lior Sventitzky | Yes                           |
rpopcount            | WIP         | Lior Sventitzky | Yes                           |
rpoplpush            | Not started |                 |                               | deprecated
rpush                | WIP         | Lior Sventitzky | No                            |
rpushx               | Not started |                 | No                            |
sadd                 | Not started |                 | No                            |
scan                 | Not started |                 |                               | No changes needed
scard                | Not started |                 |                               |
script               | Not started |                 |                               | Not implemented
sdiff                | Not started |                 | Yes                           |
sdiffstore           | Not started |                 | No                            |
select               | In Progress | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
set                  | Not started |                 | No                            |
setbit               | Not started |                 | No                            |
setex                | Not started |                 |                               | deprecated
setnx                | Not started |                 |                               | deprecated
setrange             | Not started |                 | No                            |
sinter               | Not started |                 |                               |
sintercard           | Not started |                 |                               |
sinterstore          | Not started |                 |                               |
sismember            | Not started |                 | No                            |
smembers             | Not started |                 | Yes                           |
smismember           | Not started |                 |                               |
smove                | Not started |                 | No                            |
sort                 | In Progress | Yury Fridlyand  | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
sort_ro              | In Progress | Yury Fridlyand  | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
spop                 | Not started |                 | Yes                           |
spopCount            | Not started |                 | Yes                           |
spublish             | Not started |                 |                               |
srandmember          | Not started |                 |                               |
srem                 | Not started |                 | No                            |
sscan                | Not started |                 |                               |
ssubscribe           | Not started |                 |                               | Not implemented
strlen               | Not started |                 | No                            |
subscribe            | Not started |                 |                               | Not implemented
substr               | Not started |                 |                               | deprecated
sunion               | Not started |                 | Yes                           |
sunionstore          | Not started |                 | No                            |
sunsubscribe         | Not started |                 |                               | Not implemented
time                 | Not started |                 | No                            | No changes needed
touch                | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
ttl                  | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
type                 | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
unlink               | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
unsubscribe          | Not started |                 |                               | Not implemented
unwatch              | In Progress | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
wait                 | Not started |                 |                               | No changes needed
watch                | In Progress | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
xack                 | Not started |                 | No                            |
xadd                 | Not started |                 | Yes                           | Can return NULL with NOMKSTREAM flag
xautoclaim           | Not started |                 |                               |
xclaim               | Not started |                 |                               |
xdel                 | Not started |                 | No                            |
xgroup               | Not started |                 |                               |
xinfo                | Not started |                 |                               |
xlen                 | Not started |                 | No                            |
xpending             | Not started |                 |                               |
xrange               | Not started |                 | Yes                           |
xread                | Not started |                 |                               |
xreadgroup           | Not started |                 |                               |
xrevrange            | Not started |                 | Yes                           |
xtrim                | Not started |                 |                               |
zadd                 | Not started |                 | No                            |
zcard                | Not started |                 | No                            |
zcount               | Not started |                 | No                            |
zdiff                | Not started |                 | Yes                           |
zdiffstore           | Not started |                 | No                            |
zincrby              | Not started |                 | No                            |
zinter               | Not started |                 | Yes                           |
zintercard           | Not started |                 | No                            |
zinterstore          | Not started |                 | No                            |
zlexcount            | Not started |                 | No                            |
zmpop                | Not started |                 | Yes                           |
zmscore              | Not started |                 | No                            |
zpopmax              | Not started |                 | Yes                           |
zpopmin              | Not started |                 | Yes                           |
zrandmember          | Not started |                 | Yes                           |
zrange               | Not started |                 | Yes                           |
zrangebylex          | Not started |                 |                               | deprecated
zrangebyscore        | Not started |                 |                               | deprecated
zrangestore          | Not started |                 | No                            |
zrank                | Not started |                 | No                            |
zrem                 | Not started |                 | No                            |
zremrangebylex       | Not started |                 | No                            |
zremrangebyrank      | Not started |                 | No                            |
zremrangebyscore     | Not started |                 | No                            |
zrevrange            | Not started |                 |                               | deprecated
zrevrangebylex       | Not started |                 |                               | deprecated
zrevrangebyscore     | Not started |                 |                               | deprecated
zrevrank             | Not started |                 |                               |
zscan                | Not started |                 |                               |
zscore               | Not started |                 | No                            |
zunion               | Not started |                 | Yes                           |
zunionstore          | Not started |                 | No                            |           