import * as Eos from 'eosjs'



// All those variables can be cached and re-used, no need to get them back on each computation
const builtinTypes = Eos.Serialize.createInitialTypes();
const typeUint64 = builtinTypes.get("uint64")!;
const typeName = builtinTypes.get("name")!;
const uint64ToName = (value: string|number): string => {
    // This one is trickier because it contains a "state". It can be shared among all calls
    // due to JavaScript nature. Simply ensure that it being used solely for name encoding/decoding
    // and ensure that number of bytes serialized is always the also deserialized.
    //
    // To play safe, this example does not share it among all callers.
    const buffer = new Eos.Serialize.SerialBuffer({
        textDecoder: new TextDecoder() as any,
        textEncoder: new TextEncoder() as any,
        array: [] as any
    });
    typeUint64.serialize(buffer, value);
    return typeName.deserialize(buffer)
}