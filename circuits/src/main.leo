program zkmemorygame.aleo {

    record Solution {
        public owner: address,
        public solHashes: [field; 2]
    }

    struct Pair {
        c1: u8,
        c2: u8
    }

    transition guess(hashes: [field; 2], public a: u8, public b: u8) -> bool {
        let pair: Pair = Pair {
            c1: a,
            c2: b
        };
        let suggestedSol: field = Poseidon4::hash_to_field(pair);

        let solA : field = hashes[0_u8];
        let solB : field = hashes[1_u8];

        if (suggestedSol == solA || suggestedSol == solB) {
            return true;
        }
        return false;
    }

    transition new() -> Solution {
        let pair1: Pair = Pair {
            c1: 1_u8,
            c2: 3_u8
        };
        let pair2: Pair = Pair {
            c1: 2_u8,
            c2: 4_u8
        };
        let sol1: field = Poseidon4::hash_to_field(pair1);
        let sol2: field = Poseidon4::hash_to_field(pair2);
        return Solution {
            owner: self.caller,
            solHashes: [sol1, sol2]
        };
    }
}
