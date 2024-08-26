Command              | Node        | Owner           | Function returns binary data? | Comment
--                   | --          | --              | --                            | --
append               | Done        | Lior Sventitzky | No                            | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
auth                 | Won't Do    |                 |                               | not in the API
bgsave               | Won't Do    |                 |                               | not needed
bitcount             | Done        | Andrew C        | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
bitfield             | Done        | Andrew C        | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
bitfield_ro          | Done        | Andrew C        | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
bitop                | Done        | Andrew C        | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
bitpos               | Done        | Andrew C        | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
blmove               | Done        | Lior Sventitzky |                               | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
blmpop               | In Progress | Prateek Kumar   | Yes                           |
blpop                | Done        | Lior Sventitzky | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
brpop                | Done        | Lior Sventitzky | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
brpoplpush           | Won't Do    |                 |                               | deprecated
bzmpop               | In Progress | Yury Fridlyand  | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
bzpopmax             | In Progress | Yury Fridlyand  | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
bzpopmin             | In Progress | Yury Fridlyand  | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
CLIENT GETNAME       | Done        | Yury Fridlyand  | Yes                           | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
client ID            | Done        | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
command              | Won't Do    |                 |                               | Not implemented
Config get           | Done        | Yury Fridlyand  | Yes                           | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
Config resetstat     | Done        | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
Config rewrite       | Done        | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
Config set           | Done        | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
copy                 | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
dbsize               | Done        | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
decr                 | Not started |                 | No                            |
decrby               | Not started |                 | No                            |
del                  | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
discard              | Won't Do    |                 |                               | not in the API
dump                 | Done        |                 | Yes                           | No changes needed
echo                 | Done        | Yury Fridlyand  | Yes                           | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
eval                 | Not started |                 |                               |
evalsha              | Not started |                 |                               |
exec                 | Not started |                 |                               |
exists               | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
expire               | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
expireat             | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
expiretime           | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
fcall                | Done        | Yi-Pin Chen     | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
fcall_ro             | Done        | Yi-Pin Chen     | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
flushall             | Done        | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
flushdb              | Done        | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
function delete      | Done        | Yi-Pin Chen     | No                            | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function dump        | Done        |                 | Yes                           | No changes needed
function flush       | Done        | Yi-Pin Chen     | No                            | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function kill        | Done        | Yi-Pin Chen     | No                            | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function list        | Done        | Yi-Pin Chen     | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function load        | Done        | Yi-Pin Chen     | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function restore     | Done        |                 | No                            | No changes needed
function stats       | Done        | Yi-Pin Chen     | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
geoadd               | Done        | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geodist              | Done        | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geohash              | Done        | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geopos               | Done        | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
georadius            | Won't Do    |                 |                               | deprecated
georadiusbymember    | Won't Do    |                 |                               | deprecated
georadiusbymember_ro | Won't Do    |                 |                               | deprecated
georadius_ro         | Won't Do    |                 |                               | deprecated
geosearch            | Done        | Yury Fridlyand  | Yes                           | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geosearchstore       | Done        | Yury Fridlyand  | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
get                  | Done        | Adar Ovadia     | Yes                           |
getbit               | Done        | Andrew C        | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
getdel               | Done        | Adar Ovadia     | Yes                           |
getex                | Not started |                 |                               |
getrange             | Done        | Lior Sventitzky | Yes                           | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
getset               | Won't Do    |                 |                               | deprecated
hdel                 | Not started |                 | No                            |
hexists              | Not started |                 | No                            |
hget                 | Done        | Lior Sventitzky |                               | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
hgetall              | Not started |                 | Yes                           |
hincrby              | Not started |                 | No                            |
hincrbyfloat         | Not started |                 | No                            |
hkeys                | Not started |                 |                               |
hlen                 | Not started |                 |                               |
hmget                | Not started |                 |                               |
hmset                | Won't Do    |                 |                               | deprecated
hrandfield           | Not started |                 |                               |
hscan                | Not started |                 |                               |
hset                 | Not started |                 |                               |
hsetnx               | Not started |                 | No                            |
hstrlen              | Not started |                 | No                            |
hvals                | Done        | Lior Sventitzky |                               | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
incr                 | Not started |                 | No                            |
incrby               | Not started |                 | No                            |
incrbyfloat          | Not started |                 | No                            |
info                 | Done        | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
lastsave             | Done        |                 |                               | No changes needed
lcs                  | Not started |                 | Yes                           |
lindex               | Done        | Lior Sventitzky | No                            | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
linsert              | Done        | Lior Sventitzky | No                            | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
llen                 | Done        | Lior Sventitzky | No                            | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
lmove                | Done        | Lior Sventitzky | Yes                           | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
lmpop                | In Progress | Prateek K       | Yes                           |
lolwut               | Done        | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
lpop                 | Done        | Lior Sventitzky | Yes                           | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lpopCount            | Done        | Lior Sventitzky | Yes                           | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lpos                 | Done        | Prateek K       |                               |
lpush                | Done        | Lior Sventitzky | No                            | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lpushx               | In Progress | Prateek K       | No                            |
lrange               | Done        | Lior Sventitzky | Yes                           | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lrem                 | In Progress | Prateek K       | No                            |
lset                 | In Progress | Prateek K       | No                            |
ltrim                | In Progress | Prateek K       | No                            |
mget                 | Done        | Lior Sventitzky | Yes                           | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
move                 | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
mset                 | In Progress | Andrew C        | No                            |
msetnx               | In Progress | Andrew C        |                               |
multi                | Won't Do    |                 |                               | No changes needed
object encoding      | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
object freq          | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
object idletime      | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
object refcount      | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
persist              | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pexpire              | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pexpireat            | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pexpiretime          | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pfadd                | Done        | Yi-Pin Chen     | No                            | [#2176](https://github.com/valkey-io/valkey-glide/pull/2176)
pfcount              | Done        | Yi-Pin Chen     | No                            | [#2176](https://github.com/valkey-io/valkey-glide/pull/2176)
pfmerge              | Done        | Yi-Pin Chen     | Yes                           | [#2176](https://github.com/valkey-io/valkey-glide/pull/2176)
ping                 | Done        | Adar Ovadia     | Yes                           | Update in [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
psetex               | Won't Do    |                 |                               | deprecated
psubscribe           | Not started |                 |                               |
pttl                 | In Progress | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
publish              | Not started |                 |                               |
pubsub               | Not started |                 |                               |
punsubscribe         | Not started |                 |                               |
quit                 | Won't Do    |                 |                               | not in the API
randomkey            | Done        | Yury Fridlyand  | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
readonly             | Won't Do    |                 |                               | N/A
readwrite            | Won't Do    |                 |                               | not in the API
rename               | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
renamenx             | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
replicaof            | Won't Do    |                 |                               | not in the API
restore              | Done        |                 | No                            | No changes needed
rpop                 | Done        | Lior Sventitzky | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
rpopcount            | Done        | Lior Sventitzky | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
rpoplpush            | Not started |                 |                               | deprecated
rpush                | Done        | Lior Sventitzky | No                            | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
rpushx               | In Progress | Prateek Kumar   | No                            |
sadd                 | WIP         | Lior Sventitzky | No                            |
scan                 | Done        |                 |                               | No changes needed
scard                | WIP         | Lior Sventitzky |                               |
script               | Won't Do    |                 |                               | Not implemented
sdiff                | WIP         | Lior Sventitzky | Yes                           |
sdiffstore           | WIP         | Lior Sventitzky | No                            |
select               | Done        | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
set                  | Not started |                 | No                            |
setbit               | Done        |  Andrew C       | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
setex                | Won't Do    |                 |                               | deprecated
setnx                | Won't Do    |                 |                               | deprecated
setrange             | Not started |                 | No                            |
sinter               | WIP         | Lior Sventitzky | Yes                           |
sintercard           | WIP         | Lior Sventitzky | No                            |
sinterstore          | WIP         | Lior Sventitzky | No                            |
sismember            | WIP         | Lior Sventitzky | No                            |
smembers             | WIP         | Lior Sventitzky | Yes                           |
smismember           | WIP         | Lior Sventitzky | No                            |
smove                | WIP         | Lior Sventitzky | No                            |
sort                 | Done        | Yury Fridlyand  | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
sort_ro              | Done        | Yury Fridlyand  | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
spop                 | WIP         | Lior Sventitzky | Yes                           |
spopCount            | WIP         | Lior Sventitzky | Yes                           |
spublish             | Not started |                 |                               |
srandmember          | WIP         | Lior Sventitzky | Yes                           |
srandmemberCount     | WIP         | Lior Sventitzky | Yes                           |
srem                 | WIP         | Lior Sventitzky | No                            |
sscan                | WIP         | Lior Sventitzky |                               |
ssubscribe           | Won't Do    |                 |                               | Not implemented
strlen               | WIP         | Lior Sventitzky | No                            |
subscribe            | Won't Do    |                 |                               | Not implemented
substr               | Won't Do    |                 |                               | deprecated
sunion               | WIP         | Lior Sventitzky | Yes                           |
sunionstore          | WIP         | Lior Sventitzky | No                            |
sunsubscribe         | Won't Do    |                 |                               | Not implemented
time                 | Done        | Yury Fridlyand  | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
touch                | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
ttl                  | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
type                 | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
unlink               | Done        | Yury Fridlyand  | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
unsubscribe          | Won't Do    |                 |                               | Not implemented
unwatch              | Done        | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
wait                 | Won't Do    |                 |                               | No changes needed
watch                | Done        | Yury Fridlyand  | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
xack                 | WIP         | Lior Sventitzky | No                            |
xadd                 | WIP         | Lior Sventitzky | Yes                           | Can return NULL with NOMKSTREAM flag
xautoclaim           | Not started |                 |                               |
xclaim               | Not started |                 |                               |
xdel                 | WIP         | Lior Sventitzky | No                            |
xgroup               | WIP         | Lior Sventitzky |                               |
xinfo                | Not started |                 |                               |
xlen                 | Not started |                 | No                            |
xpending             | Not started |                 |                               |
xrange               | Not started |                 | Yes                           |
xread                | Not started |                 |                               |
xreadgroup           | Not started |                 |                               |
xrevrange            | Not started |                 | Yes                           |
xtrim                | Not started |                 |                               |
zadd                 | Not started |                 | No                            |
zaddIncr             | Not started |                 | No                            |
zcard                | In Progress | Yury Fridlyand  | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zcount               | In Progress | Yury Fridlyand  | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zdiff                | In Progress | Yury Fridlyand  | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zdiffWithScores      | Not started |                 | Yes                           |
zdiffstore           | In Progress | Yury Fridlyand  | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zincrby              | In Progress | Yury Fridlyand  | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zinter               | In Progress | Yury Fridlyand  | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zinterWithScores     | Not started |                 | Yes                           |
zintercard           | In Progress | Yury Fridlyand  | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zinterstore          | In Progress | Yury Fridlyand  | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zlexcount            | In Progress | Yury Fridlyand  | No                            |
zmpop                | In Progress | Yury Fridlyand  | Yes                           |
zmscore              | In Progress | Yury Fridlyand  | No                            |
zpopmax              | In Progress | Yury Fridlyand  | Yes                           |
zpopmin              | In Progress | Yury Fridlyand  | Yes                           |
zrandmember          | In Progress | Yury Fridlyand  | Yes                           |
zrange               | In Progress | Yury Fridlyand  | Yes                           |
zrangebylex          | Won't Do    |                 |                               | deprecated
zrangebyscore        | Won't Do    |                 |                               | deprecated
zrangestore          | In Progress | Yury Fridlyand  | No                            |
zrank                | In Progress | Yury Fridlyand  | No                            |
zrem                 | In Progress | Yury Fridlyand  | No                            |
zremrangebylex       | In Progress | Yury Fridlyand  | No                            |
zremrangebyrank      | In Progress | Yury Fridlyand  | No                            |
zremrangebyscore     | In Progress | Yury Fridlyand  | No                            |
zrevrange            | Won't Do    |                 |                               | deprecated
zrevrangebylex       | Won't Do    |                 |                               | deprecated
zrevrangebyscore     | Won't Do    |                 |                               | deprecated
zrevrank             | In Progress | Yury Fridlyand  |                               |
zscan                | In Progress | Yury Fridlyand  |                               |
zscore               | In Progress | Yury Fridlyand  | No                            |
zunion               | In Progress | Yury Fridlyand  | Yes                           |
zunionstore          | In Progress | Yury Fridlyand  | No                            |           