export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    isCompleted: boolean;
    createdAt: Date;
    modifiedAt: Date;
    expiredAt: Date;
    imageUrl: string;
}