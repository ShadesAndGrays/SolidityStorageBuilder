import BN from 'bn.js'
import { sha3, padLeft, padRight } from 'web3-utils'

export default class StorageBuilder{
    constructor(){
        this.storage = {}
    }
    uint256Slot(slotNo,val){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(val, 64).substring(2) ;
        this.storage = {...this.storage,...store};
        return store ;
    }
    uint128Slot(slotNo,firstVal,sencondVal){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(sencondVal, 32).substring(2) + padLeft(firstVal, 32).substring(2) ;
        this.storage = {...this.storage,...store};
        return store ;
    }
    unint265Array(slotNo,val){
        let store = {} ;
            store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(val.length,64).substring(2);
        for (var i = 0; i < val.length;i++){
            store[new BN(sha3(padLeft(slotNo,64)).substring(2),16).add(new BN(i)).toString(16)] = padLeft(val[i],64).substring(2);
        }
        this.storage = {...this.storage,...store};
        return store;
    }

     addressSlot(slotNo,val){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(val.toLowerCase(), 64).substring(2) ;
        this.storage = {...this.storage,...store};
        return store ;
     }
     string32Slot(slotNo,val,debug=false){
         let store = {};
         const slotIndex = padLeft(slotNo,64).substring(2).toString(16);
         const bytes = new TextEncoder().encode(val);
         const stringhex  = Array.from(
             bytes,
             byte => byte.toString(16).padStart(2, "0")
         ).join("");
        const size = val.length * 2; 

        const hexSize = size.toString(16).padStart(2, "0");
         
         if (debug){
         store['String'] = val;
         store['length'] = val.length;
         }
        store[slotIndex]  = padRight(stringhex,64-hexSize.length).toString(16) +  hexSize
        this.storage = {...this.storage,...store};
         return store;
     }
     outputJson(){
         return JSON.stringify(this.storage);
     }
 }


