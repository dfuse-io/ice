import { PoolRowForm } from "../types/"
export const  addPoolTrx = (contractAccount: string, accountName:string,poolRow: PoolRowForm ) {
    return {
        actions: [{
            account: contractAccount,
            name: 'addpool',
            authorization: [{
                actor: accountName,
                permission: 'active',
            }],
            data: {
                "author":accountName,
                "name": poolRow.name,
            },
        }],
    }
}