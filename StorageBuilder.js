import BN from 'bn.js'
import { sha3, padLeft, padRight } from 'web3-utils'

export default class StorageBuilder{

    constructor(){
        this.storage = {}
    }

    // slot for uint256
    uint256Slot(slotNo,val){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(val, 64).substring(2) ;
        this.storage = {...this.storage,...store};
        return store ;
    }

    // slot for uint128
    uint128Slot(slotNo,firstVal,sencondVal){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(sencondVal, 32).substring(2) + padLeft(firstVal, 32).substring(2) ;
        this.storage = {...this.storage,...store};
        return store ;
    }

    // array of uint256
    uint256Array(slotNo,val){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(val.length,64).substring(2);
        for (let i = 0; i < val.length;i++){
            store[new BN(sha3(padLeft(slotNo,64)).substring(2),16).add(new BN(i)).toString(16)] = padLeft(val[i],64).substring(2);
        }
        this.storage = {...this.storage,...store};
        return store;
    }

    // mapping for uint256 to single slot value
    mappingValSlot(slotNo,val){
        let store = {} ;
        // Store slot for mapping
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(0, 64).substring(2) ;
        for (let key in val){
            // Key is expected to be a numeric value 
            if (!parseInt(key)){
                console.error(`Failed to parse numeric key ${key}`) 
                return {}
            }
            let _slotNo = sha3(padLeft(key,64) + padLeft(slotNo,64)).substring(2).toString(16);
            let value = padLeft(val[key],64);
            store[_slotNo] = value;
        }
        this.storage = {...this.storage,...store};
        return store ;
    }

    // mapping for string to single slot value
    mappingStringSlot(slotNo,val){
        let store = {} ;
        // Store slot for mapping
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(0, 64).substring(2) ;
        for (let key in val){
            //Key expected to be string type
            let _slotNo = sha3(this.stringToHex(key) + padLeft(slotNo,64)).substring(2).toString(16);
            let value = padLeft(val[key],64);
            store[_slotNo] = value;
        }
        this.storage = {...this.storage,...store};
        return store ;
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
        const size = val.length * 2; 
        const stringHex = this.stringToHex(val);
        const hexSize = size.toString(16).padStart(2, "0");

        if (debug){
            store['String'] = val;
            store['length'] = val.length;
        }
        store[slotIndex]  = padRight(stringHex,64-hexSize.length).toString(16) +  hexSize
        this.storage = {...this.storage,...store};
        return store;
    }

    outputJson(){
        return JSON.stringify(this.storage);
    }

    stringToHex(val){
        // UTF-8 to HEX
        const bytes = new TextEncoder().encode(val);
        return Array.from(
            bytes,
            byte => byte.toString(16).padStart(2, "0")
        ).join("");
    }
}


