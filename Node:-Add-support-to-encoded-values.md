
Decoder change commit:

*  https://github.com/valkey-io/valkey-glide/pull/2052/files - decoder enum is merged



commands status: 
Please choose command accordingly to the status under the Node column: [Node - binary API progress](https://github.com/valkey-io/valkey-glide/wiki/Node:-binary-API-progress), sign your alias and change the status to WIP (work in progress). After the commit is merged please update the status to done.

Change Getdel and ping command for example: - https://github.com/valkey-io/valkey-glide/pull/2121/files



Changes which should happen for all commands which returns string:

1. Change which should happen for all commands which get string, both for the client commands and the transaction commands :
```ts
public getdel(
        key: GlideString,
        decoder?: Decoder,
    )
```
2. Add optional decoder to the signature command (not in transaction commands, see notes below):
```ts
public getdel(
        key: GlideString,
        decoder?: Decoder,
    )
```
if there is more optionals parameter use anonymous options parameters: 
```ts
public ping(options?: {message?: string}): Promise<string>
```
use it in the func: 
```ts
return this.createWritePromise(createPing(options?.message), {
            route: toProtobufRoute(options?.route), decoder: options?.decoder,
        });
```
if a command already has an optional option, extend it using `DecoderOption`:
```ts
options?: WhatEverOptions,
```
should be changed to
```ts
options?: WhatEverOptions & DecoderOption,
```
in case if command has also routing, the final set of options should be
```ts
options?: WhatEverOptions & RoutingOption & DecoderOption,
```
Documentation for this argument should be updated as well by adding corresponding link(s):
```ts
     * @param options - (Optional) ... - see {@link WhatEverOptions} and {@link DecoderOption}.
```

3. Change the return type to GlideString instead of string.
```ts
public getdel(
        key: GlideString,
        decoder?: Decoder,
    ): Promise<GlideString | null> 
```
4. change the createCommand for example, createPing to get GlideString also:
```ts

export function createPing(str?: GlideString): command_request.Command {
    const args: GlideString[] = str == undefined ? [] : [str];
    return createCommand(RequestType.Ping, args);
}
```
5. The documentation should be updated accordingly:
```ts
    /**
     * Gets a string value associated with the given `key`and deletes the key.
     *
     * See https://valkey.io/commands/getdel/ for details.
     *
     * @param key - The key to retrieve from the database.
     * @param decoder - (Optional) {@link Decoder} type which defines how to handle the response.
     *     If not set, the {@link BaseClientConfiguration.defaultDecoder|default decoder} will be used.
     * @returns If `key` exists, returns the `value` of `key`. Otherwise, return `null`.
     *
     * @example
     * ```typescript
     * const result = client.getdel("key");
     * console.log(result); // Output: 'value'
     *
     * const value = client.getdel("key");  // value is null
     * ```
     */
```

6. Add test

```ts
    it.each([ProtocolVersion.RESP2, ProtocolVersion.RESP3])(
        `getdel test_%p`,
        async (protocol) => {
            await runTest(async (client: BaseClient) => {
                const key1 = uuidv4();
                const value1 = uuidv4();
                const value1Encoded = Buffer.from(value1);
                const key2 = uuidv4();

                expect(await client.set(key1, value1)).toEqual("OK");
                expect(await client.getdel(key1)).toEqual(value1);
                expect(await client.getdel(key1)).toEqual(null);

                expect(await client.set(key1, value1)).toEqual("OK");
                expect(await client.getdel(key1, Decoder.Bytes)).toEqual(
                    value1Encoded,
                );
                expect(await client.getdel(key1, Decoder.Bytes)).toEqual(null);

                // key isn't a string
                expect(await client.sadd(key2, ["a"])).toEqual(1);
                await expect(client.getdel(key2)).rejects.toThrow(RequestError);
            }, protocol);
        },
```


Notes:

* To transactions commands we are not add decoder to the function signature. In transaction the decoder can be sent in the exec command only and if decoder is not set so the commands will decode by the default client decoder. 
* put attention if the command example doc should be change
* Use anonymous options parameter if there is more than one optional parameter