## SUI Contract Upgrade Flow

This guide walks through upgrading a contract on the SUI blockchain. The process involves deploying the contract, calling a transaction, and then upgrading the contract with a new string value. The contract files involved are located in the `hello_world/sources/` directory: `hello_world.move` and `version.move`.

## Prerequisites

Ensure `ts-node` and `npm` are installed. Set up a `.env` file with the following fields:

```env
NETWORK=testnet
OWNER_MNEMONIC_PHRASE=your_owner_mnemonic_phrase
OWNER_ADDRESS=your_owner_address
PACKAGE_ID=your_package_id
UPGRADE_CAP=your_upgrade_capability_id
VERSION=your_version_id
V_ADMIN_CAP=your_version_admin_capability_id
NEW_PACKAGE_ID=your_new_package_id
```

## Deploying the Initial Contract

1. Run npm install to install all necessary dependencies.
2. Run the setup script to deploy the contract and print required values:
    ```
    ts-node script/setup.ts
    ```
    This will output the following:
    PACKAGE_ID=0x.......
    UPGRADE_CAP=0x.......
    VERSION=0x.......
    V_ADMIN_CAP=0x.......

3. Copy these values into your .env file.
4. To mint an object with string Hello World run,
    ```
    ts-node script/hello_world_before_upgrade.ts
    ```


## Upgrading the Contract

To upgrade the contract and modify the string, follow these steps:

1. Run 
    ```
    ts-node script/migrateVersion.ts
    ```
    for migrating version from 1 to 2.
2. In `hello_world.move`, change the string to:

    ```move
    text: string::utf8(b"Hello World v2")
    ```

3. Update the contract version by modifying the `VERSION` field in the contract to `2`:

    ```move
    VERSION = 2;
    ```

4. In `Move.toml`, set the `[package]` `published-at` value to the old package ID:

    ```toml
    [package]
    published-at = "OLD_PACKAGE_ID"
    ```

5. Use the upgrade capability stored in the `.env` file.

6. In the SUI CLI, connect to the address that deployed the original contract, then run:

    ```bash
    sui client upgrade --upgrade-capability UPGRADE_CAP_ID
    ```

7. Update the `Move.toml` file to reference the new package ID:

    ```toml
    [Packages]
    published-at = "NEW_PACKAGE_ID"
    ```

8. Finally, mint a new object with the upgraded string:

    ```bash
    ts-node script/hello_world_after_upgrade.ts
    ```

This will create an object with the updated string `Hello World v2`.

