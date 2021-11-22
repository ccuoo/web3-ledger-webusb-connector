import { ConnectorUpdate } from '@web3-react/types';
import { AbstractConnector } from '@web3-react/abstract-connector';
import Web3ProviderEngine from 'web3-provider-engine';
import { RPCSubprovider } from '@0x/subproviders/lib/src/subproviders/rpc_subprovider';
import webUsbTransport from '@ledgerhq/hw-transport-webusb';
import type Transport from '@ledgerhq/hw-transport';
import createLedgerSubprovider from './provider';

interface LedgerConnectorArguments {
  chainId: number;
  url: string;
  pollingInterval?: number;
  requestTimeoutMs?: number;
}

const getTransport = async (): Promise<Transport> => {
  return await webUsbTransport.create();
};

export class LedgerConnector extends AbstractConnector {
  private readonly chainId: number;
  private readonly url: string;
  private readonly pollingInterval?: number;
  private readonly requestTimeoutMs?: number;

  private provider: any;

  constructor({
    chainId,
    url,
    pollingInterval,
    requestTimeoutMs,
  }: LedgerConnectorArguments) {
    super({ supportedChainIds: [chainId] });

    this.chainId = chainId;
    this.url = url;
    this.requestTimeoutMs = requestTimeoutMs;
    this.pollingInterval = pollingInterval;
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.provider) {
      const engine = new Web3ProviderEngine({ pollingInterval: this.pollingInterval });
      const ledgerProvider = await createLedgerSubprovider(getTransport, {
        url: this.url,
      });
      engine.addProvider(ledgerProvider);
      engine.addProvider(new RPCSubprovider(this.url, this.requestTimeoutMs));
      this.provider = engine;
      this.provider.start();
    }
    const account = await this.getAccount();
    return { provider: this.provider, chainId: this.chainId, account };
  }

  public async getProvider(): Promise<Web3ProviderEngine> {
    return this.provider;
  }

  public async getChainId(): Promise<number> {
    return this.chainId;
  }

  public async getAccount(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.provider._providers[0].getAccounts(function (error: any, result: string[]) {
        if (error) {
          return reject(error);
        }
        return resolve(result[0]);
      });
    });
  }

  public deactivate() {
    if (this.provider) {
      this.provider.stop();
    }
  }
}
