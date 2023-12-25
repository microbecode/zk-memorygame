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

const GettingStartedPage: NextPageWithLayout = () => {
  const { wallet, publicKey } = useWallet();

  let [programId, setProgramId] = useState('zkmemorygame234.aleo');
  let [functionName, setFunctionName] = useState('new');
  let [inputs, setInputs] = useState('');
  let [fee, setFee] = useState<number | undefined>(1);
  let [transactionId, setTransactionId] = useState<string | undefined>();
  let [status, setStatus] = useState<string | undefined>();

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

    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || '';
    setTransactionId(txId);
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
