# ZK memory game

This is a simple memory game designed to demonstrate the power of Aleo, a Layer 1 ZK blockchain.

## Rules

The games has 8 unrevealed cards. The player must guess which ones form pairs and remember which have been guessed already.

Once a pair is found it's left opened on the table. If your guess does not result in a pair that is the only information you find out - you are not revealed any extra information.

## How to play

1. Make sure you have some Aleo testnet3 tokens
1. Connect your Leo wallet
1. Retrieve the ciphertext solution by clicking the corresponding button. This should be a fast operation
1. Start guessing by clicking two cards. Once you click the second card a transaction is started and presented for you to confirm. Picked cards are in state "GUESSED"
1. Wait for the transaction to process in a separate tab. This may take a few minutes
1. Once the transaction is completed, wait for the transaction to get indexed. This takes about a minute.
1. Click the "Verify previous guess result" button. You will get an error text if the transaction hasn't been indexed yet. Otherwise this will retrieve the result of the previous guess. If you found a pair, the cards will be left in state "SOLVED". If you didn't find a pair, the guess is reset and a text is shown.
1. Continue until all pairs have been found

## Deployment

The website is deployed at https://zk-memorygame.vercel.app/ .

## Technical info

The project has two folders:

- frontend: website code, written in Next.js
- circuits: ZK program code, written in Leo ZK language

The frontend can be built and run locally - it's a regular Nextjs project.

Once you have the Aleo environment setup, he circuits can also be run locally with commands like `leo run new`.

## Limitations

The game is not production ready. There are certain limitations and known bugs. Namely:

- The game solution is the same every time you play
- Only one player can play the game at any one time due to restrictions on utilizing the on-chain program
- The project does not utilize Aleo record's full privacy because there's no way to share only part of a record (solution). Hashing is utilized instead. Therefore, the exact solution is also visible in the Aleo program itself

## Contact

Feel free to [contact me](https://linktr.ee/lauripeltonen) for questions.
