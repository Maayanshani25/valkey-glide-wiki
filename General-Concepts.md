## Custom Command

The `custom_command` function is designed to execute a single command without checking inputs. It serves as a flexible tool for scenarios where the standard client API does not provide a suitable interface for a specific command.

#### Usage Notes:

- **Single-Response Commands Only**: This function is intended for use with commands that return a single response. Commands that do not return a response (such as SUBSCRIBE), those that potentially return multiple responses (such as XREAD), or those that alter the client's behavior (such as entering pub/sub mode on RESP2 connections) should not be executed using this function.

- **Key-Based Command Limitation**: Key-based commands should not be used with multi-node routing. Ensure that key-based commands are routed to a single node to maintain consistency and avoid unexpected behavior.


## Blocking Commands
### Overview
Work in progress...
### Commands
Work in progress...
### Cluster Scan
TODO: Edit, this is just a copy paste from the command doc before make it lighter
Incrementally iterates over the keys in the Cluster.
The method returns a list containing the next cursor and a list of keys.

This command is similar to the SCAN command, but it is designed to work in a Cluster environment.
The ClusterScanCursor object is used to keep track of the scan state.
Every cursor is a new state object, which mean that using the same cursor object will result the scan to handle
the same scan iteration again.
For each iteration the new cursor object should be used to continue the scan.

As the SCAN command, the method can be used to iterate over the keys in the database, the guarantee of the scan is
to return all keys the database have from the time the scan started that stay in the database till the scan ends.
The same key can be returned in multiple scans iteration.