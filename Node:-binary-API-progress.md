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
CLIENT GETNAME       | Not started |                 |                               |
client ID            | Not started |                 | No                            |
command              | Not started |                 |                               | N/A
Config get           | Not started |                 |                               |
Config resetstat     | Not started |                 |                               |
Config rewrite       | Not started |                 |                               |
Config set           | Not started |                 |                               |
copy                 | Not started |                 | No                            |
dbsize               | Not started |                 | No                            |
decr                 | Not started |                 | No                            |
decrby               | Not started |                 | No                            |
del                  | Not started |                 | No                            |
discard              | Not started |                 |                               | not in the API
dump                 | Not started |                 |                               |
echo                 | Not started |                 | Yes                           |
eval                 | Not started |                 |                               |
evalsha              | Not started |                 |                               |
exec                 | Not started |                 |                               |
exists               | Not started |                 | No                            |
expire               | Not started |                 | No                            |
expireat             | Not started |                 | No                            |
expiretime           | Not started |                 | No                            |
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
geoadd               | Not started | Yury Fridlyand  |                               |
geodist              | Not started | Yury Fridlyand  | No                            |
geohash              | Not started | Yury Fridlyand  |                               |
geopos               | Not started | Yury Fridlyand  | No                            |
georadius            | Not started | Yury Fridlyand  |                               | deprecated
georadiusbymember    | Not started | Yury Fridlyand  |                               | deprecated
georadiusbymember_ro | Not started | Yury Fridlyand  |                               | deprecated
georadius_ro         | Not started | Yury Fridlyand  |                               | deprecated
geosearch            | Not started | Yury Fridlyand  |                               |
geosearchstore       | Not started | Yury Fridlyand  |                               |
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
hvals                | Done         | Lior Sventitzky |                               |
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
object encoding      | Not started |                 | No                            |
object freq          | Not started |                 | No                            |
object idletime      | Not started |                 | No                            |
object refcount      | Not started |                 | No                            |
persist              | Not started |                 | No                            |
pexpire              | Not started |                 | No                            |
pexpireat            | Not started |                 | No                            |
pexpiretime          | Not started |                 | No                            |
pfadd                | Not started |                 | No                            |
pfcount              | Not started |                 | No                            |
pfmerge              | Not started |                 | Yes                           |
ping                 | Done         | Adar Ovadia     | Yes                           |
psetex               | Not started |                 |                               | deprecated
psubscribe           | Not started |                 |                               |
pttl                 | Not started |                 | No                            |
publish              | Not started |                 |                               |
pubsub               | Not started |                 |                               |
punsubscribe         | Not started |                 |                               |
quit                 | Not started |                 |                               | not in the API
randomkey            | Not started |                 |                               |
readonly             | Not started |                 |                               | N/A
readwrite            | Not started |                 |                               | not in the API
rename               | Not started |                 | No                            |
renamenx             | Not started |                 | No                            |
replicaof            | Not started |                 |                               | not in the API
restore              | Not started |                 |                               |
rpop                 | WIP         | Lior Sventitzky | Yes                           |
rpoplpush            | Not started |                 |                               | deprecated
rpush                | WIP         | Lior Sventitzky | No                            |
rpushx               | Not started |                 | No                            |
sadd                 | Not started |                 | No                            |
scan                 | Not started |                 |                               | No changes needed
scard                | Not started |                 |                               |
script               | Not started |                 |                               | Not implemented
sdiff                | Not started |                 | Yes                           |
sdiffstore           | Not started |                 | No                            |
select               | Not started |                 |                               |
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
sort                 | Not started |                 |                               |
sort_ro              | Not started |                 |                               |
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
touch                | Not started |                 | No                            |
ttl                  | Not started |                 | No                            |
type                 | Not started |                 | No                            |
unlink               | Not started |                 | No                            |
unsubscribe          | Not started |                 |                               | Not implemented
unwatch              | Not started |                 |                               | No changes needed
wait                 | Not started |                 |                               | No changes needed
watch                | Not started |                 | No                            |
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