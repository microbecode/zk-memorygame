import type { NextPageWithLayout, Solution } from '@/types';
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

export const programId = 'zkmemorygame234.aleo';

const GettingStartedPage: NextPageWithLayout = () => {
  const {
    wallet,
    publicKey,
    requestTransactionHistory,
    requestRecordPlaintexts,
  } = useWallet();

  const functionName = 'new';
  const fee = 2000;
  const puzzleSize = 4;

  let [transactionId, setTransactionId] = useState<string | undefined>();
  let [status, setStatus] = useState<string | undefined>();
  let [puzzle, setPuzzle] = useState<number[]>(
    Array.from({ length: puzzleSize }, () => 0)
  );
  let [guess, setGuess] = useState<number[]>();
  let [solution, setSolution] = useState<Solution>();

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
    const adapter = wallet?.adapter as LeoWalletAdapter;
    const hist = await adapter.requestTransactionHistory(programId);
    console.log('hist', hist);
    if (hist && hist.length > 0) {
      let url = 'https://testnet3.aleorpc.com';
      const tx = await getTransaction(url, hist[hist.length - 1].transactionId);
      console.log('hist tx', tx);
      if (tx?.execution?.transitions && tx?.execution?.transitions.length > 0) {
        const outputs = tx.execution.transitions[0].outputs;
        console.log('outputs', outputs);
        if (outputs?.length > 0) {
          const val = outputs[0].value;
          console.log('val', val);
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

          setSolution(JSON.parse(decrypted.replace(r, f)) as Solution);
        }
      }
    }
    //const aaa = await (wallet?.adapter as LeoWalletAdapter).requestRecordPlaintexts
    /*    if (requestRecordPlaintexts) {
      const aaa = await requestRecordPlaintexts(programId);
      console.log('aaa', aaa);
    } */

    /*  if (requestTransactionHistory) {
      const hist = await requestTransactionHistory(programId);
      console.log('hist', hist);
    }*/
    /*  if (transactionId) {
      let url = 'https://testnet3.aleorpc.com';
      const tx = await getTransaction(url, transactionId);
      console.log('tx', tx);
      console.log('outputp', tx.output);
    } */
  };

  async function getTransaction(
    apiUrl: string,
    transactionId: string
  ): Promise<any> {
    const transactionUrl = `${apiUrl}/aleo/transaction`;
    const response = await fetch(`${transactionUrl}/${transactionId}`);
    if (!response.ok) {
      throw new Error('Transaction not found');
    }
    const transaction = await response.json();
    return transaction;
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
