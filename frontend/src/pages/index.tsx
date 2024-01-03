import type { NextPageWithLayout } from '@/types';
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
//import { sha256 } from '@noble/hashes/sha256';
//const createKeccakHash = require('keccak');
//import { createKeccakHash } from 'keccak';
const createKeccakHash = require('keccak');

const GettingStartedPage: NextPageWithLayout = () => {
  const { wallet, publicKey, requestTransactionHistory } = useWallet();

  const programId = 'zkmemorygame234.aleo';
  const functionName = 'new';
  const fee = 2000;
  const puzzleSize = 4;

  let [transactionId, setTransactionId] = useState<string | undefined>();
  let [status, setStatus] = useState<string | undefined>();
  let [puzzle, setPuzzle] = useState<number[]>(
    Array.from({ length: puzzleSize }, () => 0)
  );
  let [guess, setGuess] = useState<number[]>();

  useEffect(() => {
    let tries = [
      '0x00000001',
      '0x0000001',
      '0x000001',
      '0x00001',
      '0x0001',
      '0x001',
      '0x01',
      '0x1',
      '00000001',
      '0000001',
      '000001',
      '00001',
      '0001',
      '001',
      '01',
      '1',
    ];
    for (let i = 0; i < tries.length; i++) {
      let hash = createKeccakHash('keccak256')
        .update(tries[i])
        ._resetState()
        .digest('hex');
      if (hash.indexOf('EBD7') >= 0) {
        console.log('found!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', tries[i]);
      }

      /*
  pitäisi saada joko:
  5D5CD2E3DC2D44AC3C99E90E511C8D1FFF58102475FD599AFC2DC3E7874EBD7
  1D5CD2E3DC2D44AC3C99E90E511C8D1FFF58102475FD599AFC2DC3E7874EBD7
  */
    }
    console.log(
      'nope',
      createKeccakHash('keccak256').update('1')._resetState().digest('hex')
    );
    /*  console.log(
      createKeccakHash('keccak256').update('1')._resetState().digest('hex')
    ); */
  }, []);

  console.log('puzzle', puzzle);

  const onGuess = (index: number) => {
    console.log('guess', index);
    if (guess && guess.length > 0) {
      if (index == guess[0]) {
        // undo guess
        setGuess(new Array());
      } else {
        // finalize
      }
      return;
    }
    setGuess([index]);
  };

  useEffect(() => {
    console.log('guess is now', guess?.join(' '));
  }, [guess]);

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
    const hmm = async () => {
      console.log('new status', status);
      /*   if (status == 'Finalized') {
        const records = await (
          wallet?.adapter as LeoWalletAdapter
        ).requestRecords(transactionId!);
        console.log('result', records);
      } */
      /* const a = await (
        wallet?.adapter as LeoWalletAdapter
      ). */
    };
    hmm();
  }, [status, transactionId]);

  function tryParseJSON(input: string): string | object {
    try {
      return JSON.parse(input);
    } catch (error) {
      return input;
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const inputs = '';
    const inputsArray = inputs.split('\n').filter((input) => input !== '');
    const parsedInputs = inputsArray.map((input) => tryParseJSON(input));

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      programId,
      functionName,
      parsedInputs,
      fee!,
      false
    );

    console.log('tx', aleoTransaction);

    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || '';

    console.log('txId', txId);
    setTransactionId(txId);
  };

  const getHistory = async () => {
    /*     const hist = await (
      wallet?.adapter as LeoWalletAdapter
    ).requestTransactionHistory(programId); */
    if (requestTransactionHistory) {
      const hist = await requestTransactionHistory(programId);
      console.log('hist', hist);
    }
  };

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
              {guess?.includes(index) ? <div>_</div> : ''}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <Button
            disabled={
              !publicKey || !programId || !functionName || fee === undefined
            }
            onClick={handleSubmit}
            className="shadow-card dark:bg-gray-700 md:h-10 md:px-5 xl:h-12 xl:px-7"
          >
            {!publicKey ? 'Connect Your Wallet' : 'Submit'}
          </Button>
        </div>
        <Button onClick={getHistory}>hist</Button>
        {transactionId && (
          <div>
            <div>{`Transaction status: ${status}`}</div>
          </div>
        )}
      </Base>
    </>
  );
};

GettingStartedPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default GettingStartedPage;
