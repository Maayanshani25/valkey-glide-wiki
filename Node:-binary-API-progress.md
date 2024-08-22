Command              | Node        | Owner           | Function returns binary data? | Comment
--                   | --          | --              | --                            | --
append               | Done        | Lior Sventitzky | No                            | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
auth                 | Not started |                 |                               | not in the API
bgsave               | Not started |                 |                               | not needed
bitcount             | In Progress | Andrew C        | No                            |
bitfield             | In Progress | Andrew C        |                               |
bitfield_ro          | In Progress | Andrew C        |                               |
bitop                | In Progress | Andrew C        | No                            |
bitpos               | In Progress | Andrew C        | No                            |
blmove               | Done        | Lior Sventitzky |                               | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
blmpop               | Not started |                 | Yes                           |
blpop                | Done        | Lior Sventitzky | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
brpop                | Done        | Lior Sventitzky | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
brpoplpush           | Not started |                 |                               | deprecated
bzmpop               | Not started |                 | Yes                           |
bzpopmax             | Not started |                 | Yes                           |
bzpopmin             | Not started |                 | Yes                           |
CLIENT GETNAME       | In Progress | Yury Fridlyand  | Yes                           | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
client ID            | In Progress | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
command              | Not started |                 |                               | Not implemented
Config get           | In Progress | Yury Fridlyand  | Yes                           | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
Config resetstat     | In Progress | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
Config rewrite       | In Progress | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
Config set           | In Progress | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
copy                 | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
dbsize               | In Progress | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
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
fcall                | In Progress | Yi-Pin Chen     | No                            | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
fcall_ro             | In Progress | Yi-Pin Chen     | No                            | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
flushall             | In Progress | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
flushdb              | In Progress | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
function delete      | In Progress | Yi-Pin Chen     |                               | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function dump        | Not started |                 |                               | No changes needed
function flush       | In Progress | Yi-Pin Chen     |                               | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function kill        | In Progress | Yi-Pin Chen     |                               | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function list        | In Progress | Yi-Pin Chen     |                               | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function load        | In Progress | Yi-Pin Chen     |                               | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function restore     | Not started |                 |                               | No changes needed
function stats       | In Progress | Yi-Pin Chen     |                               | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
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
getrange             | Done        | Lior Sventitzky | Yes                           | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
getset               | Not started |                 |                               | deprecated
hdel                 | Not started |                 | No                            |
hexists              | Not started |                 | No                            |
hget                 | Done        | Lior Sventitzky |                               | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
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
hvals                | Done        | Lior Sventitzky |                               | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
incr                 | Not started |                 | No                            |
incrby               | Not started |                 | No                            |
incrbyfloat          | Not started |                 | No                            |
info                 | In Progress | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
lastsave             | Not started |                 |                               | No changes needed
lcs                  | Not started |                 | Yes                           |
lindex               | Done        | Lior Sventitzky | No                            | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
linsert              | Done        | Lior Sventitzky | No                            | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
llen                 | Done        | Lior Sventitzky | No                            | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
lmove                | Done        | Lior Sventitzky | Yes                           | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
lmpop                | In Progress | Prateek K       | Yes                           |
lolwut               | In Progress | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
lpop                 | Done        | Lior Sventitzky | Yes                           | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lpopCount            | Done        | Lior Sventitzky | Yes                           | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lpos                 | In Progress | Prateek K       |                               |
lpush                | Done        | Lior Sventitzky | No                            | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lpushx               | In Progress | Prateek K       | No                            |
lrange               | Done        | Lior Sventitzky | Yes                           | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lrem                 | In Progress | Prateek K       | No                            |
lset                 | In Progress | Prateek K       | No                            |
ltrim                | In Progress | Prateek K       | No                            |
mget                 | Done        | Lior Sventitzky | Yes                           | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
move                 | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
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
pfadd                | In Progress | Yi-Pin Chen     | No                            | [#2176](https://github.com/valkey-io/valkey-glide/pull/2176)
pfcount              | In Progress | Yi-Pin Chen     | No                            | [#2176](https://github.com/valkey-io/valkey-glide/pull/2176)
pfmerge              | In Progress | Yi-Pin Chen     | Yes                           | [#2176](https://github.com/valkey-io/valkey-glide/pull/2176)
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
rpop                 | Done        | Lior Sventitzky | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
rpopcount            | Done        | Lior Sventitzky | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
rpoplpush            | Not started |                 |                               | deprecated
rpush                | Done        | Lior Sventitzky | No                            | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
rpushx               | Not started |                 | No                            |
sadd                 | WIP         | Lior Sventitzky | No                            |
scan                 | Not started |                 |                               | No changes needed
scard                | WIP         | Lior Sventitzky |                               |
script               | Not started |                 |                               | Not implemented
sdiff                | WIP         | Lior Sventitzky | Yes                           |
sdiffstore           | WIP         | Lior Sventitzky | No                            |
select               | In Progress | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
set                  | Not started |                 | No                            |
setbit               | In Progress |  Andrew C       | No                            |
setex                | Not started |                 |                               | deprecated
setnx                | Not started |                 |                               | deprecated
setrange             | Not started |                 | No                            |
sinter               | WIP         | Lior Sventitzky |                               |
sintercard           | WIP         | Lior Sventitzky |                               |
sinterstore          | WIP         | Lior Sventitzky |                               |
sismember            | Not started |                 | No                            |
smembers             | WIP         | Lior Sventitzky | Yes                           |
smismember           | Not started |                 |                               |
smove                | Not started |                 | No                            |
sort                 | In Progress | Yury Fridlyand  | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
sort_ro              | In Progress | Yury Fridlyand  | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
spop                 | WIP         | Lior Sventitzky | Yes                           |
spopCount            | WIP         | Lior Sventitzky | Yes                           |
spublish             | Not started |                 |                               |
srandmember          | Not started |                 |                               |
srem                 | WIP         | Lior Sventitzky | No                            |
sscan                | Not started |                 |                               |
ssubscribe           | Not started |                 |                               | Not implemented
strlen               | Not started |                 | No                            |
subscribe            | Not started |                 |                               | Not implemented
substr               | Not started |                 |                               | deprecated
sunion               | Not started |                 | Yes                           |
sunionstore          | Not started |                 | No                            |
sunsubscribe         | Not started |                 |                               | Not implemented
time                 | In Progress | Yury Fridlyand  | No                            |
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