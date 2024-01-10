import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface Attachment {
  id: string;
  original: string;
  thumbnail: string;
}

export interface Solution {
  owner: string;
  solHashes: string[];
  _nonce: string;
}

export interface GuessResult {
  owner: string;
  result: boolean;
  guess: { c1: string; c2: string };
  _nonce: string;
}
