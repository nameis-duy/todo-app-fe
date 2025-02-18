export interface TaskUpdateRequest {
    id: number;
    title: string;
    description: string;
    priority: number;
    status: number;
    expiredAt: Date;
    imageUrl: string;
}