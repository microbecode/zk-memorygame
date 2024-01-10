program zkmemorygamev7.aleo {

    record Solution {
        public owner: address,
        public solHashes: [field; 4]
    }

    record GuessResult {
        public owner: address,
        public guess: Pair,
        public result: bool
    }

    struct Pair {
        c1: u8,
        c2: u8
    }

    transition guess(public hashes: [field; 4], public a: u8, public b: u8) -> GuessResult {
        let pair: Pair = Pair {
            c1: a,
            c2: b
        };
        let suggestedSol: field = Poseidon4::hash_to_field(pair);

        let sol1 : field = hashes[0_u8];
        let sol2 : field = hashes[1_u8];
        let sol3 : field = hashes[2_u8];
        let sol4 : field = hashes[3_u8];

        if (suggestedSol == sol1 || 
            suggestedSol == sol2 ||
            suggestedSol == sol3 ||
            suggestedSol == sol4) {
            return GuessResult {
                owner: self.caller,
                guess: Pair {
                    c1: a,
                    c2: b
                },
                result: true
            };
        }
        return GuessResult {
            owner: self.caller,
            guess: Pair {
                c1: a,
                c2: b
            },
            result: false
        };
    }

    transition new() -> Solution {
        let pair1: Pair = Pair {
            c1: 0_u8,
            c2: 5_u8
        };
        let pair2: Pair = Pair {
            c1: 2_u8,
            c2: 4_u8
        };
        let pair3: Pair = Pair {
            c1: 3_u8,
            c2: 7_u8
        };
        let pair4: Pair = Pair {
            c1: 1_u8,
            c2: 6_u8
        };
        let sol1: field = Poseidon4::hash_to_field(pair1);
        let sol2: field = Poseidon4::hash_to_field(pair2);
        let sol3: field = Poseidon4::hash_to_field(pair3);
        let sol4: field = Poseidon4::hash_to_field(pair4);
        return Solution {
            owner: self.caller,
            solHashes: [sol1, sol2, sol3, sol4]
        };
    }
}
