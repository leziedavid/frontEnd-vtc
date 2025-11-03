// types/PaginationParams.ts
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export const paginationParam: PaginationParams = {
    page: 1,
    limit: 10,
};
