export interface TaskCreateRequest {
    title: string;
    description: string;
    priority: number;
    expiredAt: Date;
}