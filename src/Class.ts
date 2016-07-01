export class Class {
    constructor(
        public readonly name: string,
        public readonly startingHP: number,
        public readonly strength: number,
        public readonly speed: number,
        public readonly defense: number) {
    }
}

export const Warrior: Class = new Class("Warrior", 100, 1.0, 8, 1.0);
export const Thief: Class = new Class("Thief", 70, 1.2, 11, 1.4);
export const Cleric: Class = new Class("Cleric", 80, 0.8, 7, 1.2);
