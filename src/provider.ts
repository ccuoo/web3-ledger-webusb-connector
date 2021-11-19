import AppEth from '@ledgerhq/hw-app-eth';
import type Transport from '@ledgerhq/hw-transport';
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import stripHexPrefix from 'strip-hex-prefix';
import { utils } from "ethers"
import { IoTeXApp } from "./ledger_iotex_app"
import { from } from "./iotex_address";
// @ts-ignore
import action = require("./action_pb");


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
  const { paths } = {
    ...defaultOptions,
    ...options,
  };

  if (!paths.length) {
    throw new Error('paths must not be empty');
  }

  const addressToPathMap: any = {};
  const transport = await getTransport();

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
    const act = new action.ActionCore();
    act.setVersion(1);
    act.setNonce(Number(txData.nonce));
    act.setGaslimit(Number(txData.gasLimit));
    act.setGasprice(txData.gasPrice.toString());
    act.setChainid(0);
    const isContract = txData.isContract;
    delete txData.isContract
    if (!isContract) {
      const pbTransfer = new action.Transfer();
      pbTransfer.setAmount(txData.value.toString());
      pbTransfer.setRecipient(from(txData.to).string());
      pbTransfer.setPayload(Buffer.from(txData.data.slice(2), "hex"));
      act.setTransfer(pbTransfer);
    } else {
      const pbExecution = new action.Execution();
      pbExecution.setAmount(txData.value);
      if (txData.to === "") {
          pbExecution.setContract("");
      } else {
          pbExecution.setContract(from(txData.to).string());
      }
      pbExecution.setData(Buffer.from(txData.data.slice(2), "hex"));
      act.setExecution(pbExecution); 
    }

    const iotex = new IoTeXApp(transport);
    const signature = await iotex.sign([44, 304, 0, 0, 0], act.serializeBinary());
    // @ts-ignore
    if (!signature.signature) {
      throw new Error("signature error")
    }
    // @ts-ignore
    return utils.serializeTransaction(txData, signature.signature)
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