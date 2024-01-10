import type { GuessResult, NextPageWithLayout, Solution } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/dashboard/_dashboard';
import Button from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import Base from '@/components/ui/base';
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';

export const programId = 'zkmemorygamev7.aleo';

const GettingStartedPage: NextPageWithLayout = () => {
  const { wallet, publicKey } = useWallet();

  const fee = 2000;
  const puzzleSize = 8;
  const puzzle = Array.from({ length: puzzleSize }, () => 0);

  let [transactionId, setTransactionId] = useState<string | undefined>();
  let [status, setStatus] = useState<string | undefined>();

  let [guess, setGuess] = useState<number[]>();
  let [rightGuesses, setRightGuesses] = useState<number[]>();
  let [solution, setSolution] = useState<Solution>();
  let [solTxProcessing, setSolTxProcessing] = useState<boolean>(false);
  let [solGuessProcessing, setGuessTxProcessing] = useState<boolean>(false);
  let [statusText, setStatusText] = useState<string>('');

  const disabled = solTxProcessing || solGuessProcessing;

  const onGuess = async (index: number) => {
    if (disabled) {
      return;
    }
    if (guess && guess.length > 0) {
      if (index == guess[0]) {
        // undo guess
        setGuess(new Array());
      } else {
        // finalize

        if (!solution) {
          setStatusText('Retrieve cipher solution first');
          console.error('get solution first');
          return;
        }
        setStatusText('');
        setStatus('');
        setGuess([index, guess[0]]);
        setGuessTxProcessing(true);

        if (!publicKey) throw new WalletNotConnectedError();

        const hashes = [
          solution.solHashes[0].replace('.public', ''),
          solution.solHashes[1].replace('.public', ''),
          solution.solHashes[2].replace('.public', ''),
          solution.solHashes[3].replace('.public', ''),
        ];
        const aleoFormatted = JSON.stringify(hashes)
          .replaceAll("'", '')
          .replaceAll('"', '');

        let parsedInputs: any[] = [aleoFormatted];

        if (index < guess[0]) {
          parsedInputs.push(index + 'u8');
          parsedInputs.push(guess[0] + 'u8');
        } else {
          parsedInputs.push(guess[0] + 'u8');
          parsedInputs.push(index + 'u8');
        }

        const aleoTransaction = Transaction.createTransaction(
          publicKey,
          WalletAdapterNetwork.Testnet,
          programId,
          'guess',
          parsedInputs,
          fee!,
          false
        );
        console.log('guess tx', aleoTransaction);

        const txId =
          (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
            aleoTransaction
          )) || '';

        // console.log('guess txId', txId);
        setTransactionId(txId);
      }
      return;
    }
    setGuess([index]);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (transactionId) {
      intervalId = setInterval(() => {
        getTransactionStatus(transactionId!);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [transactionId]);

  useEffect(() => {
    const updateState = async () => {
      //console.log('new status', status);
      if (status == 'Completed') {
        if (solTxProcessing) {
          setSolTxProcessing(false);
        }
        if (solGuessProcessing) {
          setGuessTxProcessing(false);
        }
        //setTransactionId(undefined);
      } else if (status) {
        setGuessTxProcessing(true);
      }
    };
    updateState();
  }, [status, transactionId]);

  const getGuessResult = async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const adapter = wallet?.adapter as LeoWalletAdapter;
    const hist = await adapter.requestTransactionHistory(programId);
    console.log('hist', hist);
    if (hist && hist.length > 0) {
      let url = 'https://testnet3.aleorpc.com';
      const tx = await getTransaction(url, hist[hist.length - 1].transactionId);
      //console.log('hist tx', tx);
      if (tx?.execution?.transitions && tx?.execution?.transitions.length > 0) {
        const outputs = tx.execution.transitions[0].outputs;
        // console.log('outputs', outputs);
        if (outputs?.length > 0) {
          const val = outputs[0].value;

          const decrypted = await adapter.decrypt(val);
          console.log('decrypted guess', decrypted);

          if (decrypted.includes('true.public')) {
            /* This is the kind of data we get back from the adapter.
          {
            owner: aleo16xfyc9065arfx97cuh7kh0sh53s65lkcaz6j38zfd38amny5g59qvm2uyl.public,
            guess: {
              c1: 1u8.public,
              c2: 3u8.public
            },
            result: true.public,
            _nonce: 2619437828091549899575885071043022308495846112965135261351769394063864954536group.public
          }
          */
            // Thanks AI for the parsing.
            const r = /'([^']*)'|(\w+):|(\w+\.public)/g;
            // A function to replace the matches with double quotes and quoted property names
            const f = (_: any, p1: any, p2: any, p3: any) =>
              p1 ? `"${p1}"` : p2 ? `"${p2}":` : `"${p3}"`;

            const res = JSON.parse(decrypted.replace(r, f)) as GuessResult;

            //console.log('success! previous guess', res.guess);
            const guess1 = +res.guess.c1.replace('u8.public', '');
            const guess2 = +res.guess.c2.replace('u8.public', '');

            let guesses = rightGuesses;
            guesses = (guesses || []).concat([guess1, guess2]).sort();

            //console.log('new guesses', guesses);

            setRightGuesses(guesses);
            setGuess([]); // reset
          } else {
            setStatusText('Previous guess was incorrect');
            setGuess([]); // reset
          }
        }
      }
    }
  };

  // Only needed once when the program is deployed
  const startSolGet = async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      programId,
      'new',
      [],
      fee!,
      false
    );

    console.log('tx', aleoTransaction);
    setSolTxProcessing(true);

    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || '';

    console.log('txId', txId);
    setTransactionId(txId);
  };

  const getSolution = async () => {
    const adapter = wallet?.adapter as LeoWalletAdapter;
    const hist = await adapter.requestTransactionHistory(programId);
    console.log('hist', hist);
    if (hist && hist.length > 0) {
      let url = 'https://testnet3.aleorpc.com';
      // the first tx is always the solution tx
      const tx = await getTransaction(url, hist[0].transactionId);
      //console.log('hist tx', tx);
      if (tx?.execution?.transitions && tx?.execution?.transitions.length > 0) {
        const outputs = tx.execution.transitions[0].outputs;
        // console.log('outputs', outputs);
        if (outputs?.length > 0) {
          const val = outputs[0].value;
          console.log('sol val', val);
          const decrypted = await adapter.decrypt(val);

          /* This is the kind of data we get back from the adapter.
          {
            owner: aleo16xfyc9065arfx97cuh7kh0sh53s65lkcaz6j38zfd38amny5g59qvm2uyl.public,
            solHashes: [
              2797802722306951261185173939919875632932683148513324805941125501600765440890field.public,
              2759852216709657892218420375572265609425999351118643956003570932661481028716field.public
            ],
            _nonce: 3277380945614208778721529438563305824578593868090123601887967444196930154088group.public
          }
          */
          // Thanks AI for the parsing.

          const r = /'([^']*)'|(\w+):|(\w+\.public)/g;
          // A function to replace the matches with double quotes and quoted property names
          const f = (_: any, p1: any, p2: any, p3: any) =>
            p1 ? `"${p1}"` : p2 ? `"${p2}":` : `"${p3}"`;

          const sol = JSON.parse(decrypted.replace(r, f)) as Solution;
          console.log('solution done', sol);

          setSolution(sol);
          setStatusText('');
        }
      }
    }
  };

  async function getTransaction(
    apiUrl: string,
    transactionId: string
  ): Promise<any> {
    const transactionUrl = `${apiUrl}/aleo/transaction`;
    const response = await fetch(`${transactionUrl}/${transactionId}`);
    if (!response.ok) {
      //throw new Error('Transaction not found');
      setStatusText(
        'Transaction not found. Please wait about a minute for the tx to be indexed.'
      );
    } else {
      setStatusText('');
      const transaction = await response.json();
      return transaction;
    }
  }

  const getTransactionStatus = async (txId: string) => {
    const status = await (
      wallet?.adapter as LeoWalletAdapter
    ).transactionStatus(txId);
    setStatus(status);
  };

  return (
    <>
      <NextSeo
        title="Execute Function"
        description="Execute function with Aleo Wallet"
      />
      <Base>
        <div className="grid">
          {puzzle.map((card, index) => (
            <div
              key={index}
              className="card"
              onClick={() => {
                onGuess(index);
              }}
            >
              {guess?.includes(index) && <div>GUESSED</div>}
              {rightGuesses?.includes(index) && <div>SOLVED</div>}
            </div>
          ))}
        </div>
        <Button onClick={startSolGet} disabled={disabled}>
          set sol
        </Button>
        <Button onClick={getSolution} disabled={disabled || !!solution}>
          Retrieve ciphertext solution
        </Button>

        <Button onClick={getGuessResult} disabled={disabled}>
          Verify previous guess result
        </Button>
        {transactionId && (
          <div>
            <div>{`Please wait for the transaction to be completed. Transaction status: ${status}`}</div>
          </div>
        )}
        {statusText && <div>{statusText}</div>}
      </Base>
    </>
  );
};

GettingStartedPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default GettingStartedPage;
