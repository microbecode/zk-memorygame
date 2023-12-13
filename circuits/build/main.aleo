program zkmemorygame.aleo;

struct Board:
    c1 as u8;
    c2 as u8;
    c3 as u8;
    c4 as u8;

record Solution:
    owner as address.private;
    cards as Board.private;

record PartialSolution:
    owner as address.private;
    cards as Board.private;


closure getSolutionCard:
    input r0 as Solution.record;
    input r1 as u8;
    is.eq r1 1_u8 into r2;
    is.eq r1 2_u8 into r3;
    is.eq r1 3_u8 into r4;
    is.eq r1 4_u8 into r5;
    not r2 into r6;
    not r3 into r7;
    and r6 r7 into r8;
    not r4 into r9;
    and r8 r9 into r10;
    and r10 r5 into r11;
    ternary r11 r0.cards.c4 0_u8 into r12;
    not r2 into r13;
    not r3 into r14;
    and r13 r14 into r15;
    and r15 r4 into r16;
    ternary r16 r0.cards.c3 r12 into r17;
    not r2 into r18;
    and r18 r3 into r19;
    ternary r19 r0.cards.c2 r17 into r20;
    ternary r2 r0.cards.c1 r20 into r21;
    output r21 as u8;


closure getFilledBoard:
    input r0 as Solution.record;
    input r1 as u8;
    input r2 as u8;
    is.eq r1 1_u8 into r3;
    is.eq r2 1_u8 into r4;
    or r3 r4 into r5;
    ternary r5 r0.cards.c1 0_u8 into r6;
    is.eq r1 2_u8 into r7;
    is.eq r2 2_u8 into r8;
    or r7 r8 into r9;
    ternary r9 r0.cards.c2 0_u8 into r10;
    is.eq r1 3_u8 into r11;
    is.eq r2 3_u8 into r12;
    or r11 r12 into r13;
    ternary r13 r0.cards.c3 0_u8 into r14;
    is.eq r1 4_u8 into r15;
    is.eq r2 4_u8 into r16;
    or r15 r16 into r17;
    ternary r17 r0.cards.c4 0_u8 into r18;
    cast r6 r10 r14 r18 into r19 as Board;
    output r19 as Board;


function guess:
    input r0 as Solution.record;
    input r1 as PartialSolution.record;
    input r2 as u8.public;
    input r3 as u8.public;
    call getSolutionCard r0 r2 into r4;
    call getSolutionCard r0 r3 into r5;
    is.neq r4 r5 into r6;
    call getFilledBoard r0 r2 r3 into r7;
    cast self.caller r7 into r8 as PartialSolution.record;
    ternary r6 r1.owner r8.owner into r9;
    ternary r6 r1.cards.c1 r8.cards.c1 into r10;
    ternary r6 r1.cards.c2 r8.cards.c2 into r11;
    ternary r6 r1.cards.c3 r8.cards.c3 into r12;
    ternary r6 r1.cards.c4 r8.cards.c4 into r13;
    cast r10 r11 r12 r13 into r14 as Board;
    cast r9 r14 into r15 as PartialSolution.record;
    output r15 as PartialSolution.record;


function new:
    cast 1_u8 2_u8 1_u8 2_u8 into r0 as Board;
    cast self.caller r0 into r1 as Solution.record;
    output r1 as Solution.record;
