import { SuiObjectChangePublished } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import getOwnerAccount from './getWalletInfo';
import * as dotenv from 'dotenv';
import { processObjectChanges } from './fetchDataFromChain';

dotenv.config();

const OWNER_ADDRESS = process.env.OWNER_ADDRESS || '';
const { execSync } = require('child_process');

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

const getPackageId = async () => {
    try {
        const { keypair, client } = getOwnerAccount();
        const account = OWNER_ADDRESS;
        const packagePath = process.cwd();

        const { modules, dependencies } = JSON.parse(
            execSync(`sui move build --dump-bytecode-as-base64 --path ${packagePath} --skip-fetch-latest-git-deps`, {
                encoding: "utf-8",
            })
        );

        const tx = new TransactionBlock();
        const [upCap] = tx.publish({
            modules,
            dependencies,
        });

        tx.transferObjects([upCap], tx.pure(account));

        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
            options: {
                showObjectChanges: true,
            }
        });

        const packageId = ((result.objectChanges?.filter(
            (a) => a.type === 'published',
        ) as SuiObjectChangePublished[]) ?? [])[0].packageId.replace(/^(0x)(0+)/, '0x') as string;
        
        await sleep(20000);

        const mappings = {
            upgradeCap: `0x2::package::UpgradeCap`,
            version: `${packageId}::version::Version`,
            vAdminCap: `${packageId}::version::VAdminCap`,
        };
        
        const { upgradeCap, version, vAdminCap} = processObjectChanges(result.objectChanges, mappings);


        if (packageId ) {
            console.log("PACKAGE_ID=" + packageId);
            console.log("UPGRADE_CAP="+ upgradeCap);
            console.log("VERSION=" + version);
            console.log("V_ADMIN_CAP=" + vAdminCap);
        }
        
        return { packageId };

    } catch (error) {
        console.error(error);
        return { packageId: '' };
    }
};

getPackageId()
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });

export default getPackageId;
