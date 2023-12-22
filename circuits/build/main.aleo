program zkmemorygame.aleo;

record Solution:
    owner as address.public;
    solHashes as [field; 2u32].public;

struct Pair:
    c1 as u8;
    c2 as u8;


function guess:
    input r0 as [field; 2u32].private;
    input r1 as u8.public;
    input r2 as u8.public;
    cast r1 r2 into r3 as Pair;
    hash.psd4 r3 into r4 as field;
    is.eq r4 r0[0_u32] into r5;
    is.eq r4 r0[1_u32] into r6;
    or r5 r6 into r7;
    ternary r7 true false into r8;
    output r8 as boolean.private;


function new:
    cast 1_u8 3_u8 into r0 as Pair;
    cast 2_u8 4_u8 into r1 as Pair;
    hash.psd4 r0 into r2 as field;
    hash.psd4 r1 into r3 as field;
    cast r2r3 into r4 as [field; 2u32];
    cast self.caller r4 into r5 as Solution.record;
    output r5 as Solution.record;
