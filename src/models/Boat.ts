export class Boat {
    length: number;
    isDamaged: boolean[];

    constructor(length: number) {
        this.length = length;
        this.isDamaged  = [];
        for (let i = 0; i < length ; i++) {
            this.isDamaged.push(false);
        }
    }
}