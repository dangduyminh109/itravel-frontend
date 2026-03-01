import ApiError from "./ApiError.type";

export default interface ApiResponse<T> {
    success: boolean;
    message: string;
    response: T;
    requestId?: string;
    errors?: ApiError[] | null;
    timestamp?: string;
}