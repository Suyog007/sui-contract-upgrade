
/// Module: hello_world
module hello_world::hello_world {

    use std::string;
    use hello_world::version::{Version, checkVersion};

    public struct Hello has key, store {
        id: UID,
        text: string::String
    }

    const VERSION: u64 = 1;

    // Increase version while upgrading
    // const VERSION: u64 = 2;

    
    public entry fun mint_hello_world(version: &Version, ctx: &mut TxContext) {
        checkVersion(version, VERSION);
        // Mint an object that contains an ID and "Hello World" text
        let hello_object = Hello {
            id: object::new(ctx),
            text: string::utf8(b"Hello World")
            // change the text while upgrading
            // text: string::utf8(b"Hello World v2")
        };
        // Transfer the object to initializer address
        transfer::public_transfer(hello_object, tx_context::sender(ctx));
    }

}

