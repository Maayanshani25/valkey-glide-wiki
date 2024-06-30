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