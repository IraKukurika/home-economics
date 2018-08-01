export interface AppEvent {
    category_id: number;
    type: string;
    amount: number;
    description: string;
    date: string;
    id?: number;
    categoryName?: string;
}
