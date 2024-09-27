// types/tronweb.d.ts

declare module 'tronweb' {
  class TronWeb {
    constructor(
      fullNode: string,
      solidityNode: string,
      eventServer: string,
      privateKey: string
    );

    static createInstance(options: {
      fullHost: string;
      privateKey?: string;
    }): TronWeb;

    defaultAddress: {
      hex: string;
      base58: string;
    };

    trx: {
      getTransaction(txID: string): Promise<any>;
      // Add other TRX methods as needed
    };

    contract(): {
      at(address: string): Promise<any>;
      // Add other contract methods as needed
    };

    toSun(amount: number): number;
    fromSun(amount: number): number;

    // Add other TronWeb methods and properties as needed
  }

  export = TronWeb;
}