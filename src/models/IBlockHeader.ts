export interface IBlockHeader{
    version: number,
    output_hash: string, 
    address: string,
    block_id: number,
    update_id: number,
    signature: string | null,
}