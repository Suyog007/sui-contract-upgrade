export const processObjectChanges = (
    objectChanges: any[] | null | undefined,
    mappings: { [key: string]: string }
): { [key: string]: string } => {
    const result: { [key: string]: string } = {};

    if (!objectChanges) {
        return result; 
    }

    for (const item of objectChanges) {
        if (item.type === 'created') {
            for (const [key, value] of Object.entries(mappings)) {
                if (item.objectType === value) {
                    result[key] = item.objectId;
                }
            }
        }
    }

    return result;
};
