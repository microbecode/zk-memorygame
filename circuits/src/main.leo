// The 'hello' program.
program zkmemorygame.aleo {

    record Solution {
        owner: address,
        cards: Board
    }

    record PartialSolution {
        owner: address,
        cards: Board
    }

    struct Board {
        c1: u8,
        c2: u8,
        c3: u8,
        c4: u8
    }

    function getSolutionCard(sol: Solution, card: u8) -> u8 {
        if (card == 1_u8) {
            return sol.cards.c1;
        } else if (card == 2_u8) {
            return sol.cards.c2;
        } else if (card == 3_u8) {
            return sol.cards.c3;
        } else if (card == 4_u8) {
            return sol.cards.c4;
        }
        return 0_u8; // shouldn't happen
    }
    
    function getFilledBoard(sol: Solution, card1: u8, card2: u8) -> Board {
        let newBoard : Board = Board {
            c1: card1 == 1_u8 || card2 == 1_u8 ? sol.cards.c1 : 0_u8,
            c2: card1 == 2_u8 || card2 == 2_u8 ? sol.cards.c2 : 0_u8,
            c3: card1 == 3_u8 || card2 == 3_u8 ? sol.cards.c3 : 0_u8,
            c4: card1 == 4_u8 || card2 == 4_u8 ? sol.cards.c4 : 0_u8
        };
        return newBoard;
    }

    transition guess(sol: Solution, history: PartialSolution, public a: u8, public b: u8) -> PartialSolution {
        let solA : u8 = getSolutionCard(sol, a);
        let solB : u8 = getSolutionCard(sol, b);

        if (solA != solB) {
            return history;
        }
        else {
            let newBoard : Board = getFilledBoard(sol, a, b);

            let newpartial : PartialSolution = PartialSolution {
                owner: self.caller,
                cards: newBoard
            };

            return newpartial;
        }        
    }

    transition new() -> Solution {
        return Solution {
            owner: self.caller,
            cards: Board {
                c1: 1_u8,
                c2: 2_u8,
                c3: 1_u8,
                c4: 2_u8
                }
        };
    }
}
