import BN from 'bn.js'
import { sha3, padLeft, padRight } from 'web3-utils'

export const VAR_TYPE = Object.freeze({
    UINT256:1,
    ADDRESS:2,
    STRING:3,
    BOOL:4,

});

export default class StorageBuilder{

    constructor(){
        this.storage = {}
    }

    // slot for uint256
    uint256Slot(slotNo,val,insert=true){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(val, 64).substring(2) ;
        if (insert){
            this.storage = {...this.storage,...store};
        }
        return store ;
    }

    // slot for uint128
    uint128Slot(slotNo,firstVal,sencondVal,insert=true){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(sencondVal, 32).substring(2) + padLeft(firstVal, 32).substring(2) ;
        if (insert){
            this.storage = {...this.storage,...store};
        }
        return store ;
    }

    // array of uint256
    uint256Array(slotNo,val,insert=true){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(val.length,64).substring(2);
        for (let i = 0; i < val.length;i++){
            store[new BN(sha3(padLeft(slotNo,64)).substring(2),16).add(new BN(i)).toString(16)] = padLeft(val[i],64).substring(2);
        }
        if (insert){
            this.storage = {...this.storage,...store};
        }
        return store;
    }

    // mapping for uint256 to single slot value
    mappingValSlot(slotNo,val,insert=true){
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
        if (insert){
            this.storage = {...this.storage,...store};
        }
        return store ;
    }

    // mapping for string to single slot value
    mappingStringSlot(slotNo,val,insert){
        let store = {} ;
        // Store slot for mapping
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(0, 64).substring(2) ;
        for (let key in val){
            //Key expected to be string type
            let _slotNo = sha3("0x"+this.stringToHex(key) + padLeft(slotNo,64)).substring(2).toString(16);
            // Convert the string into it's hex format
            let value = this.string32Slot(2989,val[key])[padLeft(2989,64).substring(2)];
            store[_slotNo] = value;
        }
        if (insert){
            this.storage = {...this.storage,...store};
        }
        return store ;
    }

    mappingTypetoTypeSlot(slotNo,val,keyType,valType,insert=true){
        // Store slot for mapping
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(0, 64).substring(2) ;
        let _slotNo;
        let _val ;
        for (let key in val){
            // handle key section
            switch (keyType){
                case VAR_TYPE.UINT256: 
                    _slotNo = sha3(padLeft(key,64) + padLeft(slotNo,64)).substring(2).toString(16);
                    break;
                case VAR_TYPE.ADDRESS: 
                    _slotNo = sha3(padLeft(key.toLowerCase(), 64) + padLeft(slotNo,64)).substring(2).toString(16);
                    break;
                case VAR_TYPE.STRING: 
                   _slotNo = sha3("0x"+this.stringToHex(key) + padLeft(slotNo,64)).substring(2).toString(16);
                    break;
            }
            // handle value section
            switch (valType){
                case VAR_TYPE.UINT256: 
                    _val = padLeft(val[key],64).substring(2);
                    break;
                case VAR_TYPE.ADDRESS: 
                    _val = padLeft(val[key],64).substring(2);
                    break;
                case VAR_TYPE.BOOL: 
                    _val = padLeft(val[key],64).substring(2);
                    break;
                case VAR_TYPE.STRING: 
                   _val = this.string32Slot(2989,val[key],false)[padLeft(2989,64).substring(2)];
                   break;
            }
            store[_slotNo] = _val;
        }
        if (insert){
            this.storage = {...this.storage,...store};
        }
        return store

    }

    addressSlot(slotNo,val,insert=true){
        let store = {} ;
        store[padLeft(slotNo,64).substring(2).toString(16)] = padLeft(val.toLowerCase(), 64).substring(2) ;
        if (insert){
            this.storage = {...this.storage,...store};
        }
        return store ;
    }

    string32Slot(slotNo,val,insert=true,debug=false){
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
        if (insert){
            this.storage = {...this.storage,...store};
        }
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
    clear(){
        this.storage = {}
    }
}


