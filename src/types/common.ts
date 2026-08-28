export type Nullable<GenericType> = GenericType | null;
export type Undefinable<GenericType> = GenericType | undefined;

export interface IVertexData {
    positions: number[];
    indices: number[];
}
