import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair, } from '@mysten/sui.js/keypairs/ed25519';
import * as dotenv from 'dotenv';
dotenv.config();

const OWNER_MNEMONICS = process.env.OWNER_MNEMONIC_PHRASE || '';
const NETWORK = process.env.NETWORK as 'mainnet' | 'testnet' | 'devnet' | 'localnet';;

const getOwnerAccount = () => {
    const keypair = Ed25519Keypair.deriveKeypair(OWNER_MNEMONICS);
    const client = new SuiClient({
        url: getFullnodeUrl(NETWORK),
    });
    return { keypair, client };
}

export default getOwnerAccount;
