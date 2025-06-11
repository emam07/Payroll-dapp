// src/types/web3.d.ts

import { ExternalProvider } from 'ethers'; // Or just any if you prefer

declare global {
  interface Window {
    ethereum?: ExternalProvider; // Using ethers' ExternalProvider type
    // If you need more specific details or methods on 'ethereum', you can augment this type.
    // For example, if you want to explicitly type window.ethereum.isMetaMask: boolean,
    // you might add:
    // ethereum?: ExternalProvider & {
    //   isMetaMask?: boolean;
    //   request?: ({ method: string, params?: any[] }) => Promise<any>;
    //   on?: (eventName: string, listener: (...args: any[]) => void) => void;
    //   removeListener?: (eventName: string, listener: (...args: any[]) => void) => void;
    // };
  }
}