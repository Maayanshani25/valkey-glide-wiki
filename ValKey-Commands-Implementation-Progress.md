cmd type                    | Python      | Node        | Java         | .NET        | Go          | PHP        
--                          | --          | --          | --           | --          | --          | --         
ping                        | Done        | Done        | Done         | Not started | Not started | Not started 
info                        | Done        | Done        | Done         | Not started | Not started | Not started 
Config get                  | Done        | Done        | Done         | Not started | Not started | Not started 
Config set                  | Done        | Done        | Done         | Not started | Not started | Not started 
Config rewrite              | Done        | Done        | Done         | Not started | Not started | Not started 
Config resetstat            | Done        | Done        | Done         | Not started | Not started | Not started 
incrby                      | Done        | Done        | Done         | Not started | Not started | Not started 
incr                        | Done        | Done        | Done         | Not started | Not started | Not started 
incrbyfloat                 | Done        | Done        | Done         | Not started | Not started | Not started 
decr                        | Done        | Done        | Done         | Not started | Not started | Not started
decrby                      | Done        | Done        | Done         | Not started | Not started | Not started
del                         | Done        | Done        | Done         | Not started | Not started | Not started
select                      | Done        | Done        | Done         | Not started | Not started | Not started
client ID                   | Done        | Done        | Done         | Not started | Not started | Not started
multi                       | Done        | Done        | Done         | Not started | Not started | Not started
exec                        | Done        | Done        | Done         | Not started | Not started | Not started
CLIENT GETNAME              | Done        | Done        | Done         | Not started | Not started | Not started
auth                        | Done, API not required | Done, API not required | Done, API not required | Not started | Not started  | Not started
set                         | Done        | Done        | Done         | Not started | Not started | Not started
mset                        | Done        | Done        | Done         | Not started | Not started | Not started
mget                        | Done        | Done        | Done         | Not started | Not started | Not started
get                         | Done        | Done        | Done         | Not started | Not started | Not started
hset                        | Done        | Done        | Done         | Not started | Not started | Not started
sadd                        | Done        | Done        | Done         | Not started | Not started | Not started
srem                        | Done        | Done        | Done         | Not started | Not started | Not started
smembers                    | Done        | Done        | Done         | Not started | Not started | Not started
scard                       | Done        | Done        | Done         | Not started | Not started | Not started
hmset                       | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
exists                      | Done        | Done        | Done         | Not started | Not started | Not started
command                     | N/A         | N/A         | N/A          | N/A         | N/A         | N/A        
readonly                    | N/A         | N/A         | N/A          | N/A         | N/A         | N/A        
hget                        | Done        | Done        | Done         | Not started | Not started | Not started
hgetall                     | Done        | Done        | Done         | Not started | Not started | Not started
hdel                        | Done        | Done        | Done         | Not started | Not started | Not started
hmget                       | Done        | Done        | Done         | Not started | Not started | Not started
hexists                     | Done        | Done        | Done         | Not started | Not started | Not started
hincrby                     | Done        | Done        | Done         | Not started | Not started | Not started
hincrbyfloat                | Done        | Done        | Done         | Not started | Not started | Not started
expire                      | Done        | Done        | Done         | Not started | Not started | Not started
pexpireat                   | Done        | Done        | Done         | Not started | Not started | Not started
pexpire                     | Done        | Done        | Done         | Not started | Not started | Not started
expireat                    | Done        | Done        | Done         | Not started | Not started | Not started
lpush                       | Done        | Done        | Done         | Not started | Not started | Not started
lpop                        | Done        | Done        | Done         | Not started | Not started | Not started
rpush                       | Done        | Done        | Done         | Not started | Not started | Not started
rpop                        | Done        | Done        | Done         | Not started | Not started | Not started
rpoplpush                   | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
llen                        | Done        | Done        | Done         | Not started | Not started | Not started
lrem                        | Done        | Done        | Done         | Not started | Not started | Not started
ltrim                       | Done        | Done        | Done         | Not started | Not started | Not started
lrange                      | Done        | Done        | Done         | Not started | Not started | Not started
unlink                      | Done        | Done        | Done         | Not started | Not started | Not started
ttl                         | Done        | Done        | Done         | Not started | Not started | Not started
publish                     | Done        | In progress | Done         | Not started | Not started | Not started
subscribe                   | Done        | Not started | Done         | Not started | Not started | Not started
eval                        | Done        | Done        | Done         | Not started | Not started | Not started
evalsha                     | Done        | Done        | Done         | Not started | Not started | Not started
script                      | Done        | Done        | Done         | Not started | Not started | Not started
scan                        | Done        | Not started | Done         | Not started | Not started | Not started
zrangebyscore               | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
zremrangebyscore            | Done        | Done        | Done         | Not started | Not started | Not started
setnx                       | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
bgsave                      | Not needed  | Not needed  | Not needed   | Not started | Not started | Not started
setex                       | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
zadd                        | Done        | Done        | Done         | Not started | Not started | Not started
zrem                        | Done        | Done        | Done         | Not started | Not started | Not started
zrange                      | Done        | Done        | Done         | Not started | Not started | Not started
unsubscribe                 | Done        | In progress |Done          | Not started | Not started | Not started
psubscribe                  | Done        | In progress | Done         | Not started | Not started | Not started
zcard                       | Done        | Done        | Done         | Not started | Not started | Not started
type                        | Done        | Done        | Done         | Not started | Not started | Not started
echo                        | Done        | Done        | Done         | Not started | Not started | Not started
brpop                       | Done        | Done        | Done         | Not started | Not started | Not started
zremrangebyrank             | Done        | Done        | Done         | Not started | Not started | Not started
psetex                      | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
flushall                    | Done        | In progress | Done         | Not started | Not started | Not started
sscan                       | Done        | Not started | Done         | Not started | Not started | Not started
flushdb                     | Done        | Not started | Done         | Not started | Not started | Not started
xadd                        | Done        | Done        | Done         | Not started | Not started | Not started
hlen                        | Done        | Done        | Done         | Not started | Not started | Not started
hsetnx                      | Done        | Done        | Done         | Not started | Not started | Not started
zrevrangebyscore            | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
watch                       | Done        | Not started | Done         | Not started | Not started | Not started
sismember                   | Done        | Done        | Done         | Not started | Not started | Not started
pttl                        | Done        | Done        | Done         | Not started | Not started | Not started
zscore                      | Done        | Done        | Done         | Not started | Not started | Not started
dbsize                      | Done        | In progress | Done         | Not started | Not started | Not started
zrevrange                   | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
hscan                       | Done        | Not started | Done         | Not started | Not started | Not started
unwatch                     | Done        | Not started | Done         | Not started | Not started | Not started
hkeys                       | Done        | In progress | Done         | Not started | Not started | Not started
xread                       | Done        | Done        | Done         | Not started | Not started | Not started
readwrite                   | Done, API not required | Done, API not required | Done, API not required  | Not started | Not started | Not started
zcount                      | Done        | Done        | Done         | Not started | Not started | Not started
time                        | Done        | Done        | Done         | Not started | Not started | Not started
append                      | Done        | In progress | Done         | Not started | Not started | Not started
rename                      | Done        | Done        | Done         | Not started | Not started | Not started
lindex                      | Done        | Done        | Done         | Not started | Not started | Not started
punsubscribe                | Done        | In progress | Done         | Not started | Not started | Not started
persist                     | Done        | Done        | Done         | Not started | Not started | Not started
strlen                      | Done        | Done        | Done         | Not started | Not started | Not started
zincrby                     | Done        | Not started | Done         | Not started | Not started | Not started
xgroup                      | Done        | Not started | Done         | Not started | Not started | Not started
getset                      | Deprecated  | Deprecated  | Deprecated   | Deprecated  | Deprecated  | Deprecated 
blpop                       | Done        | Done        | Done         | Not started | Not started | Not started
zscan                       | Done        | Not started | Done         | Not started | Not started | Not started
xreadgroup                  | Done        | Not started | Done         | Not started | Not started | Not started
pfadd                       | Done        | Done        | Done         | Not started | Not started | Not started
renamenx                    | Done        | Done        | Done         | Not started | Not started | Not started
zpopmin                     | Done        | Done        | Done         | Not started | Not started | Not started
pfcount                     | Done        | Done        | Done         | Not started | Not started | Not started
wait                        | Done        | Not started | Done         | Not started | Not started | Not started
spop                        | Done        | Done        | Done         | Not started | Not started | Not started
restore                     | Done        | Not started | Done         | Not started | Not started | Not started
hvals                       | Done        | Done        | Done         | Not started | Not started | Not started
sinter                      | Done        | Done        | Done         | Not started | Not started | Not started
xtrim                       | Done        | Done        | Done         | Not started | Not started | Not started
zrank                       | Done        | Done        | Done         | Not started | Not started | Not started
zinterstore                 | Done        | Done        | Done         | Not started | Not started | Not started
xack                        | Done        | In Progress | Done         | Not started | Not started | Not started
object encoding             | Done        | Done        | Done         | Not started | Not started | Not started
object freq                 | Done        | Done        | Done         | Not started | Not started | Not started
object idletime             | Done        | Done        | Done         | Not started | Not started | Not started
object refcount             | Done        | Done        | Done         | Not started | Not started | Not started
spublish                    | Done        | Not started | Done         | Not started | Not started | Not started
ssubscribe                  | Done        | Not started | Done         | Not started | Not started | Not started
zrevrank                    | Done        | Not started | Done         | Not started | Not started | Not started
pubsub                      | Not needed  | Not started | Not needed   | Not started | Not started | Not started
sunion                      | Done        | Done        | Done         | Not started | Not started | Not started
zunionstore                 | Done        | Done        | Done         | Not started | Not started | Not started
lset                        | Done        | In Progress | Done         | Not started | Not started | Not started
xclaim                      | Done        | Not started | Done         | Not started | Not started | Not started
bitfield                    | Done        | Not started | Done         | Not started | Not started | Not started
getrange                    | Done        | Not started | Done         | Not started | Not started | Not started
randomkey                   | Done        | Not started | Done         | Not started | Not started | Not started
srandmember                 | Done        | In Progress | Done         | Not started | Not started | Not started
dump                        | Done        | Not started | Done         | Not started | Not started | Not started
xinfo                       | Done        | Not started | Done         | Not started | Not started | Not started
setbit                      | Done        | Not started | Done         | Not started | Not started | Not started
smove                       | Done        | Done        | Done         | Not started | Not started | Not started
xrange                      | Done        | Not started | Done         | Not started | Not started | Not started
xdel                        | Done        | Not started | Done         | Not started | Not started | Not started
linsert                     | Done        | Done        | Done         | Not started | Not started | Not started
xlen                        | Done        | Done        | Done         | Not started | Not started | Not started
xpending                    | Done        | Not started | Done         | Not started | Not started | Not started
discard                     | API not required | API not required | API not required | Not started | Not started | Not started
sunionstore                 | Done        | Done        | Done         | Not started | Not started | Not started
xrevrange                   | Done        | Not started | Done         | Not started | Not started | Not started
bzpopmin                    | Done        | Not started | Done         | Not started | Not started | Not started
rpushx                      | Done        | In progress | Done         | Not started | Not started | Not started
sort                        | Done        | Not started | Done         | Not started | Not started | Not started
geoadd                      | Done        | Not started | Done         | Not started | Not started | Not started
zrangebylex                 | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
getbit                      | Done        | Not started | Done         | Not started | Not started | Not started
msetnx                      | Done        | Not started | Done         | Not started | Not started | Not started
sdiff                       | Done        | Done        | Done         | Not started | Not started | Not started
setrange                    | Done        | Not started | Done         | Not started | Not started | Not started
sinterstore                 | Done        | Done        | Done         | Not started | Not started | Not started
zpopmax                     | Done        | Done        | Done         | Not started | Not started | Not started
georadius_ro                | Deprecated  | Deprecated  | Deprecated   | Deprecated  | Deprecated  | Deprecated 
georadius                   | Deprecated  | Deprecated  | Deprecated   | Deprecated  | Deprecated  | Deprecated  
pfmerge                     | Done        | Not started | Done         | Not started | Not started | Not started
bitcount                    | Done        | Not started | Done         | Not started | Not started | Not started
sdiffstore                  | Done        | Done        | Done         | Not started | Not started | Not started
touch                       | Done        | Not started | Done         | Not started | Not started | Not started
smismember                  | Done        | In progress | Done         | Not started | Not started | Not started
zremrangebylex              | Done        | Not started | Done         | Not started | Not started | Not started
zrevrangebylex              | deprecated  | deprecated  | deprecated   | Not started | Not started | Not started
lpushx                      | Done        | In progress | Done         | Not started | Not started | Not started
copy                        | Done        | Not started | Done         | Not started | Not started | Not started
hrandfield                  | Done        | Not started | Done         | Not started | Not started | Not started
lpos                        | Done        | In Progress | Done         | Not started | Not started | Not started
geopos                      | Done        | Not started | Done         | Not started | Not started | Not started
xautoclaim                  | Done        | Not started | Done         | Not started | Not started | Not started
zmscore                     | Done        | Not started | Done         | Not started | Not started | Not started
bitop                       | Done        | Not started | Done         | Not started | Not started | Not started
lastsave                    | Done        | Not started | Done         | Not started | Not started | Not started
geosearch                   | Done        | Not started | Done         | Not started | Not started | Not started
function delete             | Done        | Not started | Done         | Not started | Not started | Not started
function dump               | Done        | Not started | Done         | Not started | Not started | Not started
function flush              | Done        | Not started | Done         | Not started | Not started | Not started
function kill               | Done        | Not started | Done         | Not started | Not started | Not started
function list               | Done        | Not started | Done         | Not started | Not started | Not started
function load               | Done        | In progress | Done         | Not started | Not started | Not started
function restore            | Done        | Not started | Done         | Not started | Not started | Not started
function stats              | Done        | Not started | Done         | Not started | Not started | Not started
zlexcount                   | Done        | Not started | Done         | Not started | Not started | Not started
zrandmember                 | Done        | Not started | Done         | Not started | Not started | Not started
replicaof                   | Done, API not required | Done, API not required | Done, API not required   | Not started | Not started | Not started
bitfield_ro                 | Done        | Not started | Done         | Not started | Not started | Not started
fcall                       | Done        | Not started | Done         | Not started | Not started | Not started
zdiffstore                  | Done        | Not started | Done         | Not started | Not started | Not started
move                        | Done        | Not started | Done         | Not started | Not started | Not started
geohash                     | Done        | Not started | Done         | Not started | Not started | Not started
bitpos                      | Done        | Not started | Done         | Not started | Not started | Not started
substr                      | Deprecated  | Deprecated  | Deprecated   | Deprecated  | Deprecated  | Deprecated  
zdiff                       | Done        | Not started | Done         | Not started | Not started | Not started
zrangestore                 | Done        | Not started | Done         | Not started | Not started | Not started
geodist                     | Done        | Not started | Done         | Not started | Not started | Not started 
georadiusbymember           | Deprecated  | Deprecated  | Deprecated   | Deprecated  | Deprecated  | Deprecated  
bzpopmax                    | Done        | Not started | Done         | Not started | Not started | Not started 
zinter                      | Done        | In progress | Done         | Not started | Not started | Not started 
georadiusbymember_ro        | Deprecated  | Deprecated  | Deprecated   | Deprecated  | Deprecated  | Deprecated  
sunsubscribe                | Done        | Not started | Done         | Not started | Not started | Not started
zunion                      | Done        | In progress | Done         | Not started | Not started | Not started
sort_ro                     | Done        | Not started | Done         | Not started | Not started | Not started
fcall_ro                    | Done        | Not started | Done         | Not started | Not started | Not started
lmpop                       | Done        | Not started | Done         | Not started | Not started | Not started
geosearchstore              | Done        | Not started | Done         | Not started | Not started | Not started 
zintercard                  | Done        | Done        | Done         | Not started | Not started | Not started 
zmpop                       | Done        | In progress | Done         | Not started | Not started | Not started 
bzmpop                      | Done        | Not started | Done         | Not started | Not started | Not started 
lcs                         | Done        | Not started | Done         | Not started | Not started | Not started 
lolwut                      | Done        | In progress | Done         | Not started | Not started | Not started
expiretime                  | Done        | Not started | Done         | Not started | Not started | Not started
pexpiretime                 | Done        | Not started | Done         | Not started | Not started | Not started
hstrlen                     | Done        | Not started | Done         | Not started | Not started | Not started
blmove                      | Done        | Not started | Done         | Not started | Not started | Not started
blmpop                      | Done        | Not started | Done         | Not started | Not started | Not started
brpoplpush                  | deprecated  | deprecated  | deprecated   | deprecated  | deprecated  | deprecated 
lmove                       | Done        | Not started | Done         | Not started | Not started | Not started
sintercard                  | Done        | In progress | Done         | Not started | Not started | Not started
getdel                      | Done        | Not started | Done         | Not started | Not started | Not started
getex                       | Done        | Not started | Done         | Not started | Not started | Not started
quit                        | Done, API not required | Done, API not required | Done, API not required | Done, API not required | Done, API not required | Done, API not required