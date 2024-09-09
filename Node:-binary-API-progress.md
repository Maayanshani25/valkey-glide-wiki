Command              | Node        | Owner            | Function returns binary data? | Comment
--                   | --          | --               | --                            | --
append               | Done        | Lior Sventitzky  | No                            | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
auth                 | Won't Do    |                  |                               | not in the API
bgsave               | Won't Do    |                  |                               | not needed
bitcount             | Done        | Andrew C         | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
bitfield             | Done        | Andrew C         | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
bitfield_ro          | Done        | Andrew C         | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
bitop                | Done        | Andrew C         | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
bitpos               | Done        | Andrew C         | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
blmove               | Done        | Lior Sventitzky  |                               | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
blmpop               | In Progress | Yury Fridlyand   | Yes                           | [#2195](https://github.com/valkey-io/valkey-glide/pull/2195) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
blpop                | Done        | Lior Sventitzky  | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
brpop                | Done        | Lior Sventitzky  | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
brpoplpush           | Won't Do    |                  |                               | deprecated
bzmpop               | In Progress | Yury Fridlyand   | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
bzpopmax             | Done        | Yury Fridlyand   | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
bzpopmin             | Done        | Yury Fridlyand   | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
CLIENT GETNAME       | Done        | Yury Fridlyand   | Yes                           | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
client ID            | Done        | Yury Fridlyand   | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
command              | Won't Do    |                  |                               | Not implemented
Config get           | Done        | Yury Fridlyand   | Yes                           | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
Config resetstat     | Done        | Yury Fridlyand   | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
Config rewrite       | Done        | Yury Fridlyand   | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
Config set           | Done        | Yury Fridlyand   | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
copy                 | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
dbsize               | Done        | Yury Fridlyand   | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
decr                 | Done        | TJ Zhang         | No                            | [#2183](https://github.com/valkey-io/valkey-glide/pull/2183)
decrby               | Done        | TJ Zhang         | No                            | [#2183](https://github.com/valkey-io/valkey-glide/pull/2183)
del                  | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
discard              | Won't Do    |                  |                               | not in the API
dump                 | Done        |                  | Yes                           | No changes needed
echo                 | Done        | Yury Fridlyand   | Yes                           | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
eval                 | Done        | Adar Ovadi       |                               |
evalsha              | Done        | Adar Ovadi       |                               |
exec                 | Done        | Adar Ovadi       | Yes                           | [#2052](https://github.com/valkey-io/valkey-glide/pull/2052)
exists               | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
expire               | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
expireat             | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
expiretime           | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
fcall                | Done        | Yi-Pin Chen      | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
fcall_ro             | Done        | Yi-Pin Chen      | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
flushall             | Done        | Yury Fridlyand   | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
flushdb              | Done        | Yury Fridlyand   | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
function delete      | Done        | Yi-Pin Chen      | No                            | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function dump        | Done        |                  | Yes                           | No changes needed
function flush       | Done        | Yi-Pin Chen      | No                            | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function kill        | Done        | Yi-Pin Chen      | No                            | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function list        | Done        | Yi-Pin Chen      | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function load        | Done        | Yi-Pin Chen      | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
function restore     | Done        |                  | No                            | No changes needed
function stats       | Done        | Yi-Pin Chen      | Yes                           | [#2172](https://github.com/valkey-io/valkey-glide/pull/2172)
geoadd               | Done        | Yury Fridlyand   | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geodist              | Done        | Yury Fridlyand   | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geohash              | Done        | Yury Fridlyand   | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geopos               | Done        | Yury Fridlyand   | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
georadius            | Won't Do    |                  |                               | deprecated
georadiusbymember    | Won't Do    |                  |                               | deprecated
georadiusbymember_ro | Won't Do    |                  |                               | deprecated
georadius_ro         | Won't Do    |                  |                               | deprecated
geosearch            | Done        | Yury Fridlyand   | Yes                           | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
geosearchstore       | Done        | Yury Fridlyand   | No                            | [#2149](https://github.com/valkey-io/valkey-glide/pull/2149)
get                  | Done        | Adar Ovadia      | Yes                           |
getbit               | Done        | Andrew C         | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
getdel               | Done        | Adar Ovadia      | Yes                           |
getex                | Done        | TJ Zhang         | Yes                           | [#2183](https://github.com/valkey-io/valkey-glide/pull/2183)
getrange             | Done        | Lior Sventitzky  | Yes                           | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
getset               | Won't Do    |                  |                               | deprecated
hdel                 | Done        | Jonathan Louie   | No                            | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hexists              | Done        | Jonathan Louie   | No                            | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hget                 | Done        | Lior Sventitzky  |                               | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
hgetall              | In Progress | Yury Fridlyand   | Yes                           | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
hincrby              | Done        | Jonathan Louie   | No                            | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hincrbyfloat         | Done        | Jonathan Louie   | No                            | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hkeys                | Done        | Jonathan Louie   | Yes                           | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hlen                 | Done        | Jonathan Louie   | No                            | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hmget                | Done        | Jonathan Louie   | Yes                           | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hmset                | Won't Do    |                  |                               | deprecated
hrandfield           | Done        | Jonathan Louie   | Yes                           | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hscan                | Done        | Jonathan Louie   |                               | [#2240](https://github.com/valkey-io/valkey-glide/pull/2240)
hset                 | Done        | Prateek Kumar    |                               | [#2209](https://github.com/valkey-io/valkey-glide/pull/2209)
hsetnx               | Done        | Jonathan Louie   | No                            | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hstrlen              | Done        | Jonathan Louie   | No                            | [#2194](https://github.com/valkey-io/valkey-glide/pull/2194)
hvals                | Done        | Lior Sventitzky  |                               | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
incr                 | Done        | TJ Zhang         | No                            |
incrby               | Done        | TJ Zhang         | No                            |
incrbyfloat          | Done        | TJ Zhang         | No                            |
info                 | Done        | Yury Fridlyand   | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
lastsave             | Done        |                  |                               | No changes needed
lcs                  | In Progress | TJ Zhang & Yury  | Yes                           | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
lindex               | Done        | Lior Sventitzky  | No                            | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
linsert              | Done        | Lior Sventitzky  | No                            | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
llen                 | Done        | Lior Sventitzky  | No                            | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
lmove                | Done        | Lior Sventitzky  | Yes                           | [#2166](https://github.com/valkey-io/valkey-glide/pull/2166)
lmpop                | In Progress | Yury Fridlyand   | Yes                           | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
lolwut               | Done        | Yury Fridlyand   | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
lpop                 | Done        | Lior Sventitzky  | Yes                           | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lpopCount            | Done        | Lior Sventitzky  | Yes                           | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lpos                 | Done        | Prateek K        |                               |
lpush                | Done        | Lior Sventitzky  | No                            | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lpushx               | Done        | Prateek K        | No                            | [#2195](https://github.com/valkey-io/valkey-glide/pull/2195)
lrange               | Done        | Lior Sventitzky  | Yes                           | [#2151](https://github.com/valkey-io/valkey-glide/pull/2151)
lrem                 | Done        | Prateek K        | No                            | [#2195](https://github.com/valkey-io/valkey-glide/pull/2195)
lset                 | Done        | Prateek K        | No                            | [#2195](https://github.com/valkey-io/valkey-glide/pull/2195)
ltrim                | Done        | Prateek K        | No                            | [#2195](https://github.com/valkey-io/valkey-glide/pull/2195)
mget                 | Done        | Lior Sventitzky  | Yes                           | [#2150](https://github.com/valkey-io/valkey-glide/pull/2150)
move                 | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
mset                 | Done        | Andrew C         | No                            |
msetnx               | Done        | Andrew C         |                               |
multi                | Won't Do    |                  |                               | No changes needed
object encoding      | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
object freq          | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
object idletime      | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
object refcount      | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
persist              | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pexpire              | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pexpireat            | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pexpiretime          | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
pfadd                | Done        | Yi-Pin Chen      | No                            | [#2176](https://github.com/valkey-io/valkey-glide/pull/2176)
pfcount              | Done        | Yi-Pin Chen      | No                            | [#2176](https://github.com/valkey-io/valkey-glide/pull/2176)
pfmerge              | Done        | Yi-Pin Chen      | Yes                           | [#2176](https://github.com/valkey-io/valkey-glide/pull/2176)
ping                 | Done        | Adar Ovadia      | Yes                           | Update in [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
psetex               | Won't Do    |                  |                               | deprecated
psubscribe           | Done        | Yi-Pin Chen      |                               |
pttl                 | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
publish              | Done        | Yi-Pin Chen      |                               | [#2201](https://github.com/valkey-io/valkey-glide/pull/2201)
pubsub               | WIP (part1) | Yi-Pin Chen      |                               | [#2201](https://github.com/valkey-io/valkey-glide/pull/2201)
pubsub numsub        | In progress | Yury Fridlyand   |                               | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
pubsub shardnumsub   | In progress | Yury Fridlyand   |                               | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
punsubscribe         | Done        | Yi-Pin Chen      |                               |
quit                 | Won't Do    |                  |                               | not in the API
randomkey            | Done        | Yury Fridlyand   | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
readonly             | Won't Do    |                  |                               | N/A
readwrite            | Won't Do    |                  |                               | not in the API
rename               | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
renamenx             | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
replicaof            | Won't Do    |                  |                               | not in the API
restore              | Done        |                  | No                            | No changes needed
rpop                 | Done        | Lior Sventitzky  | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
rpopcount            | Done        | Lior Sventitzky  | Yes                           | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
rpoplpush            | Won't Do    |                  |                               | deprecated
rpush                | Done        | Lior Sventitzky  | No                            | [#2153](https://github.com/valkey-io/valkey-glide/pull/2153)
rpushx               | Done        | Prateek Kumar    | No                            | [#2195](https://github.com/valkey-io/valkey-glide/pull/2195)
sadd                 | Done        | Lior Sventitzky  | No                            | [#2181](https://github.com/valkey-io/valkey-glide/pull/2181)
scan                 | Done        |                  |                               | No changes needed
scard                | Done        | Lior Sventitzky  |                               | [#2197](https://github.com/valkey-io/valkey-glide/pull/2197)
script               | Won't Do    |                  |                               | Not implemented
sdiff                | Done        | Lior Sventitzky  | Yes                           | [#2188](https://github.com/valkey-io/valkey-glide/pull/2188)
sdiffstore           | Done        | Lior Sventitzky  | No                            | [#2188](https://github.com/valkey-io/valkey-glide/pull/2188)
select               | Done        | Yury Fridlyand   | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
set                  | Done        | TJ Zhang         | No                            | [#2183](https://github.com/valkey-io/valkey-glide/pull/2183)
setbit               | Done        |  Andrew C        | No                            | [#2178](https://github.com/valkey-io/valkey-glide/pull/2178)
setex                | Won't Do    |                  |                               | deprecated
setnx                | Won't Do    |                  |                               | deprecated
setrange             | Done        | TJ Zhang         | No                            | [#2183](https://github.com/valkey-io/valkey-glide/pull/2183)
sinter               | Done        | Lior Sventitzky  | Yes                           | [#2188](https://github.com/valkey-io/valkey-glide/pull/2188)
sintercard           | Done        | Lior Sventitzky  | No                            | [#2188](https://github.com/valkey-io/valkey-glide/pull/2188)
sinterstore          | Done        | Lior Sventitzky  | No                            | [#2188](https://github.com/valkey-io/valkey-glide/pull/2188)
sismember            | Done        | Lior Sventitzky  | No                            | [#2197](https://github.com/valkey-io/valkey-glide/pull/2197)
smembers             | Done        | Lior Sventitzky  | Yes                           | [#2181](https://github.com/valkey-io/valkey-glide/pull/2181)
smismember           | Done        | Lior Sventitzky  | No                            | [#2197](https://github.com/valkey-io/valkey-glide/pull/2197)
smove                | Done        | Lior Sventitzky  | No                            | [#2197](https://github.com/valkey-io/valkey-glide/pull/2197)
sort                 | Done        | Yury Fridlyand   | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
sort_ro              | Done        | Yury Fridlyand   | Yes                           | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
spop                 | Done        | Lior Sventitzky  | Yes                           | [#2181](https://github.com/valkey-io/valkey-glide/pull/2181)
spopCount            | Done        | Lior Sventitzky  | Yes                           | [#2181](https://github.com/valkey-io/valkey-glide/pull/2181)
spublish             | Done        | Yi-Pin Chen      |                               | [#2201](https://github.com/valkey-io/valkey-glide/pull/2201)
srandmember          | Done        | Lior Sventitzky  | Yes                           | [#2197](https://github.com/valkey-io/valkey-glide/pull/2197)
srandmemberCount     | Done        | Lior Sventitzky  | Yes                           | [#2197](https://github.com/valkey-io/valkey-glide/pull/2197)
srem                 | Done        | Lior Sventitzky  | No                            | [#2181](https://github.com/valkey-io/valkey-glide/pull/2181)
sscan                | Done        | Lior Sventitzky  |                               | [#2199](https://github.com/valkey-io/valkey-glide/pull/2199)
ssubscribe           | Done        | Yi-Pin           |                               | 
strlen               | Done        | Lior Sventitzky  | No                            | [#2199](https://github.com/valkey-io/valkey-glide/pull/2199)
subscribe            | Done        |                  |                               | 
substr               | Won't Do    |                  |                               | deprecated
sunion               | Done        | Lior Sventitzky  | Yes                           | [#2199](https://github.com/valkey-io/valkey-glide/pull/2199)
sunionstore          | Done        | Lior Sventitzky  | No                            | [#2199](https://github.com/valkey-io/valkey-glide/pull/2199)
sunsubscribe         | Done        |                  |                               | 
time                 | Done        | Yury Fridlyand   | No                            | [#2179](https://github.com/valkey-io/valkey-glide/pull/2179)
touch                | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
ttl                  | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
type                 | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
unlink               | Done        | Yury Fridlyand   | No                            | [#2158](https://github.com/valkey-io/valkey-glide/pull/2158)
unsubscribe          | Done        |                  |                               | 
unwatch              | Done        | Yury Fridlyand   | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
wait                 | Won't Do    |                  |                               | No changes needed
watch                | Done        | Yury Fridlyand   | No                            | [#2160](https://github.com/valkey-io/valkey-glide/pull/2160)
xack                 | Done        | TJ Zhang         | No                            | [#2200](https://github.com/valkey-io/valkey-glide/pull/2200)
xadd                 | Done        | TJ Zhang         | Yes                           | [#2200](https://github.com/valkey-io/valkey-glide/pull/2200)
xautoclaim           | In Progress | TJ Zhang & Yury  | Yes                           | [#2200](https://github.com/valkey-io/valkey-glide/pull/2200) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
xclaim               | In Progress | TJ Zhang & Yury  | Yes                           | [#2200](https://github.com/valkey-io/valkey-glide/pull/2200) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
xdel                 | Done        | TJ Zhang         | No                            | [#2200](https://github.com/valkey-io/valkey-glide/pull/2200)
xgroup               | Done        | TJ Zhang         |                               | [#2200](https://github.com/valkey-io/valkey-glide/pull/2200)
xinfo groups         | In Progress | James Xin & Yury |                               | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
xinfo consumers      | In Progress | James Xin & Yury |                               | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
xinfo stream         | In Progress | James Xin & Yury |                               | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
xlen                 | Done        | James Xin        | No                            |
xpending             | Done        | James Xin        |                               |
xrange               | Done        | James Xin        | Yes                           |
xread                | In Progress | James Xin & Yury |                               | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
xreadgroup           | In Progress | James Xin & Yury |                               | [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
xrevrange            | Done        | James Xin        | Yes                           |
xtrim                | Done        | James Xin        |                               |
zadd                 | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zaddIncr             | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zcard                | Done        | Yury Fridlyand   | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zcount               | Done        | Yury Fridlyand   | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zdiff                | Done        | Yury Fridlyand   | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zdiffWithScores      | In Progress | Yury Fridlyand   | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
zdiffstore           | Done        | Yury Fridlyand   | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zincrby              | Done        | Yury Fridlyand   | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zinter               | Done        | Yury Fridlyand   | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zinterWithScores     | In Progress | Yury Fridlyand   | Yes                           | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
zintercard           | Done        | Yury Fridlyand   | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zinterstore          | Done        | Yury Fridlyand   | No                            | [#2190](https://github.com/valkey-io/valkey-glide/pull/2190)
zlexcount            | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zmpop                | In Progress | Yury Fridlyand   | Yes                           | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
zmscore              | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zpopmax              | In Progress | Yury Fridlyand   | Yes                           | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
zpopmin              | In Progress | Yury Fridlyand   | Yes                           | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
zrandmember          | Done        | Yury Fridlyand   | Yes                           | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zrange               | Done        | Yury Fridlyand   | Yes                           | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zrangebylex          | Won't Do    |                  |                               | deprecated
zrangebyscore        | Won't Do    |                  |                               | deprecated
zrangestore          | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zrank                | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zrem                 | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zremrangebylex       | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zremrangebyrank      | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zremrangebyscore     | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zrevrange            | Won't Do    |                  |                               | deprecated
zrevrangebylex       | Won't Do    |                  |                               | deprecated
zrevrangebyscore     | Won't Do    |                  |                               | deprecated
zrevrank             | Done        | Yury Fridlyand   |                               | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zscan                | Done        | Yury Fridlyand   |                               | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zscore               | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zunion               | Done        | Yury Fridlyand   | Yes                           | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)
zunionWithScores     | In Progress | Yury Fridlyand   | Yes                           | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210) [#2207](https://github.com/valkey-io/valkey-glide/pull/2207)
zunionstore          | Done        | Yury Fridlyand   | No                            | [#2210](https://github.com/valkey-io/valkey-glide/pull/2210)