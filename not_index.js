import BN from 'bn.js'
import { sha3, padLeft } from 'web3-utils'

// This section contains my dearest emotions Sadness :(


let storage = {}


storage["0000000000000000000000000000000000000000000000000000000000000000"] = padLeft(45, 32).substring(2) + padLeft(10, 32).substring(2);
storage["0000000000000000000000000000000000000000000000000000000000000001"] = padLeft(2,64).substring(2);
storage[new BN(sha3("0x0000000000000000000000000000000000000000000000000000000000000001").substring(2),16).toString(16)] = padLeft(2,64).substring(2);
storage[(new BN(sha3("0x0000000000000000000000000000000000000000000000000000000000000001").substring(2),16).add(new BN(1))).toString(16)] = padLeft(34,64).substring(2);
storage["0000000000000000000000000000000000000000000000000000000000000002"] = padLeft(0,64).substring(2);
storage[padLeft(sha3(padLeft(153,64)+("0000000000000000000000000000000000000000000000000000000000000002")).substring(2).toLowerCase(),64)] = padLeft(10,64).substring(2);
storage[padLeft(sha3(padLeft(13,64)+("0000000000000000000000000000000000000000000000000000000000000002")).substring(2).toLowerCase(),64)] = padLeft(20000,64).substring(2);
storage[padLeft(sha3(padLeft(57,64)+("0000000000000000000000000000000000000000000000000000000000000002")).substring(2).toLowerCase(),64)] = padLeft(12310,64).substring(2);
storage[padLeft(sha3(padLeft(3,64)+("0000000000000000000000000000000000000000000000000000000000000002")).substring(2).toLowerCase(),64)] = padLeft(43,64).substring(2);

console.log(JSON.stringify(storage))

// console.log(`${new BN(keccak256(padLeft(1,64))).add(new BN(1)).toString('hex')} or ${new BN(sha3(padLeft(1,64)).substring(2),16).add(new BN(1),16).toString(16)}`);

// Expremiment with Keccak library
/* sha3VsKeccak("0x0000000000000000000000000000000000000000000000000000000000000001");

function sha3VsKeccak(value){
console.log(`Value: ${value}`) 
console.log(`${sha3(value).substring(2)} :sha3`) 
console.log(`${new BN(sha3(value).substring(2),16).toString(16)} :sha3BN`) 
console.log(`${new BN(sha3(padLeft(value,64)).substring(2),16).toString(16)} :sha3WithPadding`) 
console.log(`${keccak256(value).toString('hex')} :kaccak256`) 
}
console.log(`${sha3(("0000000000000000000000000000000000000000000000000000000000000002")).substring(2).toLowerCase()} Expectec value from 2`)
sha3VsKeccak('0x'+padLeft(2,64))
sha3VsKeccak(2) */

/*
 HOW IT WORKS

    CONTRACT VARIABLE DELCLERATION LOOKS LIKE THIS

...
contract Count {
    uint128 count;
    uint128 count2;
    uint[] counts;
    mapping(uint => uint) myMap;
...

value to be given at initial state
    count = 10
    count2 = 45
    counts = [2,34];
    mapping(uint => uint) myMap = {
        3: 43,
        13: 20000,
        57: 12310,
        153: 10
    };



for uint128 count half a slot as it is next to uint128 count2 which also take half the space. The values 45 and 10 in hex as count2 + count.
slot 0 ::== "0000000000000000000000000000000000000000000000000000000000000000" : "0000000000000000000000000000002d0000000000000000000000000000000a" 
It's written in lower-order aligned when sharing a slot so ...5th.4th.3rd.2nd.1st arragement

for uint[] counts; The slot takes the predfined number of elements. For our example it is 2
slot 1 ::== "0000000000000000000000000000000000000000000000000000000000000001" : "0000000000000000000000000000000000000000000000000000000000000002" 

For the values the array will contain we need to find the address where it would have been stored. 
assume p is the slot for the array ["0000...00001"] and array index is the index of the element

address = keccak256(p) + array_index

for the first element
keccak256(0x0000...0001).toString('hex') or sha3(padLeft(1,64)).substring(2).toString(16)
addr of index 0 => b10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6

for the second element

new BN(keccak256(padLeft(1,64))).add(new BN(1)).toString('hex')
or 
new BN(sha3(padLeft(1,64)).substring(2),16).add(new BN(1),16).toString(16)

addr of index 1 => b10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf7

mapping(uint => uint) myMap 

for the mapping, the entry for the slot remains zero. This slot is necessary to offset mappings that are next to each other 
slot 2 ::== "0000000000000000000000000000000000000000000000000000000000000002" : "0000000000000000000000000000000000000000000000000000000000000000" 


address = keccak256(h(k).p) 
k => the mapping key
h => mapping funtion that would make it 32 bytes. in case of uint just padding
. => contactination
p => slot number. in this case 2

e.g
myMap[153] = 10


padLeft(sha3(padLeft(153,64)+("0000000000000000000000000000000000000000000000000000000000000002")).substring(2).toLowerCase(),64)] = padLeft(10,64).substring(2);

new BN(sha3(padLeft(2,64)).substring(2),16).add(new BN(1),16).toString(16)


NOTES:
Global constants are not allocated to storage
The order of the variable declertion affect how they are arragened in storage
A single slot takes 256 bits / 32 bytes / 64 digit hex values
Solidity will optimize storage by squeezing item where possible
e.g 
uint128 uint128 uint256 requires only 2 slots but
uint128 uint256 uint128 requires three *ORDER IS IMPORTANT*


*/
