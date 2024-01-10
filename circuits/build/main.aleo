program zkmemorygamev7.aleo;

record Solution:
    owner as address.public;
    solHashes as [field; 4u32].public;

struct Pair:
    c1 as u8;
    c2 as u8;

record GuessResult:
    owner as address.public;
    guess as Pair.public;
    result as boolean.public;


function guess:
    input r0 as [field; 4u32].public;
    input r1 as u8.public;
    input r2 as u8.public;
    cast r1 r2 into r3 as Pair;
    hash.psd4 r3 into r4 as field;
    is.eq r4 r0[0_u32] into r5;
    is.eq r4 r0[1_u32] into r6;
    or r5 r6 into r7;
    is.eq r4 r0[2_u32] into r8;
    or r7 r8 into r9;
    is.eq r4 r0[3_u32] into r10;
    or r9 r10 into r11;
    cast r1 r2 into r12 as Pair;
    cast self.caller r12 true into r13 as GuessResult.record;
    cast r1 r2 into r14 as Pair;
    cast self.caller r14 false into r15 as GuessResult.record;
    ternary r11 r13.owner r15.owner into r16;
    ternary r11 r13.guess.c1 r15.guess.c1 into r17;
    ternary r11 r13.guess.c2 r15.guess.c2 into r18;
    cast r17 r18 into r19 as Pair;
    ternary r11 r13.result r15.result into r20;
    cast r16 r19 r20 into r21 as GuessResult.record;
    output r21 as GuessResult.record;


function new:
    cast 0_u8 5_u8 into r0 as Pair;
    cast 2_u8 4_u8 into r1 as Pair;
    cast 3_u8 7_u8 into r2 as Pair;
    cast 1_u8 6_u8 into r3 as Pair;
    hash.psd4 r0 into r4 as field;
    hash.psd4 r1 into r5 as field;
    hash.psd4 r2 into r6 as field;
    hash.psd4 r3 into r7 as field;
    cast r4r5r6r7 into r8 as [field; 4u32];
    cast self.caller r8 into r9 as Solution.record;
    output r9 as Solution.record;
