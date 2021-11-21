import AppEth from '@ledgerhq/hw-app-eth';
import type Transport from '@ledgerhq/hw-transport';
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import stripHexPrefix from 'strip-hex-prefix';
import { utils, ethers } from "ethers"
import { IoTeXApp } from "./ledger_iotex_app"
import { from } from "./iotex_address";
// @ts-ignore
import * as action from "./action_pb"


// function makeError(msg: string, id: string) {
//   const err: any = new Error(msg);
//   err.id = id;
//   return err;
// }

/**
 */
type SubproviderOptions = {
  // refer to https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
  networkId: number;
  url: string;
  // derivation path schemes (with a x in the path)
  paths?: string[];
  // should use actively validate on the device
  askConfirm?: boolean;
  // number of accounts to derivate
  accountsLength?: number;
  // offset index to use to start derivating the accounts
  accountsOffset?: number;
};

const defaultOptions = {
  networkId: 1, // mainnet
  paths: ["44'/60'/x'/0/0", "44'/60'/0'/x"], // ledger live derivation path
  askConfirm: false,
  accountsLength: 1,
  accountsOffset: 0,
  url: 'https://babel-api.mainnet.iotex.io/'
};

/**
 * Create a HookedWalletSubprovider for Ledger devices.
 */
export default async function createLedgerSubprovider(
  getTransport: () => Promise<Transport>,
  options?: SubproviderOptions
) {
  if (options && 'path' in options) {
    throw new Error(
      "@ledgerhq/web3-subprovider: path options was replaced by paths. example: paths: [\"44'/60'/x'/0/0\"]"
    );
  }
  const { paths, url } = {
    ...defaultOptions,
    ...options,
  };

  if (!paths.length) {
    throw new Error('paths must not be empty');
  }

  const addressToPathMap: any = {};
  const transport = await getTransport();
  const provider = new ethers.providers.JsonRpcProvider(url);

  async function getAccounts() {
    const iotex = new IoTeXApp(transport);
    const result = await iotex.publicKey([44, 304, 0, 0, 0])
    const address = utils.computeAddress(result.publicKey)
    return [address];
  }

  async function signPersonalMessage(msgData: any) {
    const path = addressToPathMap[msgData.from.toLowerCase()];
    if (!path) throw new Error("address unknown '" + msgData.from + "'");
    const eth = new AppEth(transport);
    const result = await eth.signPersonalMessage(path, stripHexPrefix(msgData.data));
    const v = parseInt(result.v + "", 10) - 27;
    let vHex = v.toString(16);
    if (vHex.length < 2) {
      vHex = `0${v}`;
    }
    return `0x${result.r}${result.s}${vHex}`;
  }

  async function signTransaction(txData: any) {
    console.log("==== signTransaction ====", txData)

    provider.getTransactionReceipt(txData.to)
    
    let isTransfer = false;
    if (txData.to) {
      isTransfer = (await provider.getCode(txData.to)) === "0x"
    }

    const data = txData.data || "0x"

    delete txData.isTransfer
    let act: any;
    let message;
    if (isTransfer) {
      message = {
        version: 1,
        nonce: Number(txData.nonce),
        gasLimit: Number(txData.gas),
        gasPrice: Number(txData.gasPrice) + "",
        transfer: {
          amount: Number(txData.value ?? '0') + "",
          recipient: from(txData.to).string(),
          payload: Buffer.from(data.slice(2), "hex")
        }
      } as unknown as action.ActionCore
      act = action.ActionCore.encode(message).finish()
      
    } else {
      message = {
        version: 1,
        nonce: Number(txData.nonce),
        gasLimit: Number(txData.gas),
        gasPrice: Number(txData.gasPrice) + "",
        execution: {
          amount: Number(txData.value ?? '0') + "" ,
          contract: txData.to === "" ? "" : from(txData.to).string(),
          data: Buffer.from(data.slice(2), "hex")
        }
      } as unknown as action.ActionCore
      act = action.ActionCore.encode(message).finish()
    }
    console.log("== message ==", message)
    const iotex = new IoTeXApp(transport);
    const signature = await iotex.sign([44, 304, 0, 0, 0], act);

    console.log("signature", signature)
   
    // @ts-ignore

    const transaction = {
      to: txData.to,
      nonce: txData.nonce,
      gasLimit: Number(txData.gas),
      gasPrice: txData.gasPrice,
      data: txData.data,
      value: txData.value,
      // special chainId
      chainId: 999999
    }
    console.log("=== transaction ===", transaction)
    // @ts-ignore
     if (!signature.signature) {
      throw new Error("signature error")
    }
    // @ts-ignore
    const result = utils.serializeTransaction(transaction, signature.signature)
    console.log("result", result)
    return result
  }

  const subprovider = new HookedWalletSubprovider({
    getAccounts: (callback: (err: any, res: any) => void) => {
      getAccounts()
        .then((res) => callback(null, Object.values(res)))
        .catch((err) => callback(err, null));
    },
    signPersonalMessage: (txData: any, callback: (err: any, res: any) => void) => {
      signPersonalMessage(txData)
        .then((res) => callback(null, res))
        .catch((err) => callback(err, null));
    },
    signTransaction: (txData: any, callback: (err: any, res: any) => void) => {
      signTransaction(txData)
        .then((res) => callback(null, res))
        .catch((err) => callback(err, null));
    },
  });

  return subprovider;
}