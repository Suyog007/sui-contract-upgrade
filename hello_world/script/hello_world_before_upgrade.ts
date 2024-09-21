import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getOwnerAccount from './getWalletInfo';
dotenv.config();

async function mintHelloWorld() {
    const { keypair, client } = getOwnerAccount();

    const packageId = process.env.PACKAGE_ID;
    const version = process.env.VERSION;

    const tx = new TransactionBlock();

    tx.moveCall({
        target: `${packageId}::hello_world::mint_hello_world`,
        arguments: [tx.object(version)],

    });

    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
    });
    console.log("Transaction digest:", result.digest);
}


mintHelloWorld();
