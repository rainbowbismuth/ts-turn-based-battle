import { Player } from "./Player";
import { Class } from "./Class";

export type State = "Default" | "Defending";

export class Combatant {
    constructor(
        public readonly id: number,
        public readonly player: Player,
        public readonly name: string,
        public readonly klass: Class,
        public readonly hp: number,
        public readonly ap: number,
        public readonly ct: number,
        public readonly state: State) { }

    static make(id: number, player: Player, name: string, klass: Class): Combatant {
        return new Combatant(id, player, name, klass, klass.startingHP, 0, 0, "Default");
    }

    get strength(): number {
        return this.klass.strength;
    }

    get speed(): number {
        return this.klass.speed;
    }

    get defense(): number {
        const bonus = (this.state === "Defending" ? 0.5 : 1.0);
        return this.klass.defense * bonus;
    }

    get canIHaveActiveTurn(): boolean {
        return this.alive && this.ct >= 100;
    }

    private clone(): Combatant { return Object.assign({}, this); }

    private setAP(ap: number): Combatant {
        const cloned = this.clone();
        cloned._ap = ap;
        return cloned;
    }

    private setCT(ct: number): Combatant {
        const cloned = this.clone();
        cloned._ct = ct;
        return cloned;
    }

    private setState(state: State): Combatant {
        const cloned = this.clone();
        cloned._state = state;
        return cloned;
    }

    setHP(hp: number): Combatant {
        const cloned = this.clone();
        cloned._hp = hp;
        return cloned;
    }

    increaseAP(): Combatant {
        return this.setAP(Math.max(5, this.ap + 1));
    }

    payAP(amount: number): Combatant | null {
        if (this.ap < amount) {
            return null;
        }
        return this.setAP(this.ap - amount);
    }

    clockTick(): Combatant {
        return this.setCT(this.ct + this.speed);
    }

    payTurnCT(): Combatant {
        return this.setCT(this.ct - 100);
    }

    toDefaultState(): Combatant {
        return this.setState("Default");
    }

    toDefendState(): Combatant {
        return this.setState("Defending");
    }

    get alive(): boolean {
        return this.hp > 0;
    }

    get dead(): boolean {
        return !this.alive;
    }
}
