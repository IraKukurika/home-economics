export class AppEventModel {
    constructor(
        public category_id: number,
        public type: string,
        public amount: number,
        public description: string,
        public date: string,
        public id?: number,
        public categoryName?: string) { }
}
