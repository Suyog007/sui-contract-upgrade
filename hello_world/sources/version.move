module hello_world::version {

    // === Errors ===

    const EWrongVersion: u64 = 1001;

    const VERSION_INIT: u64 = 1; 

    // === Structs ===
    
    public struct VERSION has drop {}

    public struct VAdminCap has key {
        id: UID
    }

    public struct Version has key, store {
        id: UID,
        version: u64,
    }

    // === Init Function ===

    fun init(_witness: VERSION, ctx: &mut TxContext) {
        let adminCap = VAdminCap { id: object::new(ctx)};

        transfer::transfer(adminCap, tx_context::sender(ctx));
        transfer::share_object(Version {
            id: object::new(ctx),
            version: VERSION_INIT,
        });
    }

    public fun checkVersion(version: &Version, modVersion: u64) {
        assert!(modVersion == version.version, EWrongVersion);
    }

    // === Admin Functions ===

    public entry fun migrate(_admin: &VAdminCap, ver: &mut Version, newVer: u64){
        assert!(newVer > ver.version, EWrongVersion);
        ver.version = newVer
    }

    #[test_only]
    public fun test_init(ctx: &mut TxContext) {
        init(VERSION{}, ctx);
    }
}
