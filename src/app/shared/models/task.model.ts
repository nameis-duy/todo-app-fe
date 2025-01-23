export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    isCompleted: boolean;
    createdAtUtc: Date;
    modifiedAtUtc: Date;
    expiredAtUtc: Date;
}