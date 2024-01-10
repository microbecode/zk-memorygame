program zkmemorygame.aleo;

record Solution:
    owner as address.public;
    solHashes as [field; 2u32].public;

struct Pair:
    c1 as u8;
    c2 as u8;

record GuessResult:
    owner as address.public;
    guess as Pair.public;
    result as boolean.public;


function guess:
    input r0 as [field; 2u32].public;
    input r1 as u8.public;
    input r2 as u8.public;
    cast r1 r2 into r3 as Pair;
    hash.psd4 r3 into r4 as field;
    is.eq r4 r0[0_u32] into r5;
    is.eq r4 r0[1_u32] into r6;
    or r5 r6 into r7;
    cast r1 r2 into r8 as Pair;
    cast self.caller r8 true into r9 as GuessResult.record;
    cast r1 r2 into r10 as Pair;
    cast self.caller r10 false into r11 as GuessResult.record;
    ternary r7 r9.owner r11.owner into r12;
    ternary r7 r9.guess.c1 r11.guess.c1 into r13;
    ternary r7 r9.guess.c2 r11.guess.c2 into r14;
    cast r13 r14 into r15 as Pair;
    ternary r7 r9.result r11.result into r16;
    cast r12 r15 r16 into r17 as GuessResult.record;
    output r17 as GuessResult.record;


function new:
    cast 0_u8 2_u8 into r0 as Pair;
    cast 1_u8 3_u8 into r1 as Pair;
    hash.psd4 r0 into r2 as field;
    hash.psd4 r1 into r3 as field;
    cast r2r3 into r4 as [field; 2u32];
    cast self.caller r4 into r5 as Solution.record;
    output r5 as Solution.record;
