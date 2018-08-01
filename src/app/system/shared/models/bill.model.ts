export class BillModel {
    constructor(
        public value: number,
        public currency: string,
        public id?: number
    ) {}
}
