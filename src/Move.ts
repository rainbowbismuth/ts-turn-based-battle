export type MoveTarget = "SingleTarget" | "SelfTarget";

export class Move {
    constructor(
        public readonly name: string,
        public readonly tooltip: string,
        public readonly cost: number,
        public readonly target: MoveTarget) { }
}

export const Attack = new Move(
    "Attack", "Attack a target, costs 1 AP", 1, "SingleTarget");

export const Defend = new Move(
    "Defend", "Take half damage until your next turn, and gain 1 AP", 0, "SelfTarget");

export const Heal = new Move(
    "Heal", "Heal a target for 45 HP, costs 2 AP", 2, "SingleTarget");
