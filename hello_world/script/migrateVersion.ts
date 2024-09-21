import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import getOwnerAccount from './getWalletInfo';
dotenv.config();

async function migrate(version_number: number) {
    const packageId = process.env.PACKAGE_ID;
    const vAdminCap = process.env.V_ADMIN_CAP;
    const version = process.env.VERSION;
    if (!packageId || !vAdminCap || !version) {
        throw new Error("One or more required environment variables are missing.");
    }
    const { keypair, client } = getOwnerAccount();
    const tx = new TransactionBlock();
    tx.moveCall({
        target: `${packageId}::version::migrate`,
        arguments: [
            tx.object(vAdminCap),
            tx.object(version),
            tx.pure.u64(version_number),
        ]
    });
    const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
    });
    console.log({ result });
}

migrate(2);
