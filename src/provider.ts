import type Transport from '@ledgerhq/hw-transport';
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import stripHexPrefix from 'strip-hex-prefix';
import { utils, ethers } from "ethers"
import { IoTeXApp } from "./ledger_iotex_app"
import { from } from "./iotex_address";
import * as action from "./action_pb"
import { serialize } from "./transaction";


type SubproviderOptions = {
  url: string;
};

export default async function createLedgerSubprovider(
  getTransport: () => Promise<Transport>,
  options?: SubproviderOptions
) {

  const { url = 'https://babel-api.mainnet.iotex.io/' } = { ...options }

  const addressToPathMap: any = {};
  const transport = await getTransport();
  const provider = new ethers.providers.JsonRpcProvider(url);
  const accountPath = [44, 304, 0, 0, 0];

  async function getAccounts() {
    const iotex = new IoTeXApp(transport);
    const result = await iotex.publicKey(accountPath)
    const address = utils.computeAddress(result.publicKey)
    return [address];
  }

  async function signPersonalMessage(msgData: any) {
    const path = addressToPathMap[msgData.from.toLowerCase()];
    if (!path) throw new Error("address unknown '" + msgData.from + "'");
    const iotex = new IoTeXApp(transport);
    const result = await iotex.signMessage(path, stripHexPrefix(msgData.data));
    // @ts-ignore
    if (!result.signature) {
      throw new Error("signPersonalMessage error")
    }
    // @ts-ignore
    return result.signature;
  }

  async function signTransaction(txData: any) {
    console.log("signTransaction input data", txData)
    let isTransfer = false;
    if (txData.to) {
      isTransfer = (await provider.getCode(txData.to)) === "0x"
    }
    const data = txData.data || "0x"

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
          contract: from(txData.to).string(),
          data: Buffer.from(data.slice(2), "hex")
        }
      } as unknown as action.ActionCore
      act = action.ActionCore.encode(message).finish()
    }
    console.log("signTransaction message", message)

    const iotex = new IoTeXApp(transport);
    const signature = await iotex.sign([44, 304, 0, 0, 0], act);

    console.log("signTransaction signature", signature)

    const transaction = {
      to: txData.to,
      nonce: txData.nonce,
      gasLimit: Number(txData.gas),
      gasPrice: txData.gasPrice,
      data: txData.data,
      value: txData.value,
      chainId: 4689,
      // special chainId
      // chainId: 999999
    }

    console.log("signTransaction transaction", transaction)
    
    // @ts-ignore
     if (!signature.signature) {
      throw new Error("signTransaction error")
    }
    // @ts-ignore
    const result = serialize(transaction, signature.signature)

    console.log("signTransaction result", result)
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