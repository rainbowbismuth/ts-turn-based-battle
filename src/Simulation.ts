import { Player } from "./Player";
import { Combatant } from "./Combatant";

export class Simulation {
    constructor(
        public readonly combatants: Combatant[],
        public readonly active: Combatant | null,
        public readonly combatLog: string[]) { }

    static make(combatants: Combatant[]): Simulation {
        return new Simulation(combatants, null, []);
    }
    
    party(player: Player): Combatant[] {
        return this.combatants.filter((x) => x.player === player);
    }

    private clone(): Simulation {
        return Object.assign({}, this);
    }

    private setCombatants(combatants: Combatant[]): Simulation {
        let cloned = this.clone();
        cloned._combatants = combatants;
        return cloned;
    }

    private setActive(combatant: Combatant | null): Simulation {
        let cloned = this.clone();
        cloned._active = combatant;
        return cloned;
    }

    private setCombatLog(log: string[]): Simulation {
        let cloned = this.clone();
        cloned._combatLog = log;
        return cloned;
    }

    private appendMessage(msg: string): Simulation {
        let copy = this.combatLog.slice(0);
        copy.push(msg);
        return this.setCombatLog(copy);
    }

    private modifyCombatant(index: number, f: (cmbt: Combatant) => Combatant): Simulation {
        if (this.combatants[index] === undefined) {
            return this;
        }
        let cloned = this.combatants.slice(0);
        cloned[index] = f(cloned[index]);
        return this.setCombatants(cloned)
    }

    combatant(index: number): Combatant | undefined {
        return this.combatants[index];
    }

    lost(player: Player): boolean {
        return this.party(player).every((cmbt) => cmbt.dead)
    }

    get gameOver(): boolean {
        return this.lost("AI") || this.lost("User");
    }

    private findActiveCombatant(): Combatant | undefined {
        return this.combatants.find((cmbt) => cmbt.canIHaveActiveTurn);
    }

    private clockTick(): Simulation {
        return this.setCombatants(this.combatants.map((cmbt) => cmbt.clockTick()));
    }

    clockTickUntilTurn(): Simulation {
        if (this.active || this.gameOver) {
            return this;
        }
        let sim: Simulation = this;
        let active = sim.findActiveCombatant();
        while (active === undefined) {
            sim = sim.clockTick();
            active = sim.findActiveCombatant();
        }
        return this.setActive(active);
    }

    get whosTurn(): Player | null {
        return this.active && this.active.player;
    }

    private dropActiveTurn(): Simulation {
        if (this.active === null) {
            return this;
        }
        return this.modifyCombatant(this.active.id, (cmbt) => cmbt.payTurnCT())
            .setActive(null)
            .clockTickUntilTurn();
    }

    turnOrderList(top: number): Combatant[] {
        const out: Combatant[] = [];
        let sim: Simulation = this;
        while (top > 0) {
            if (!sim.active) {
                return out;
            }
            top -= 1;
            out.push(sim.active);
            sim = sim.clockTickUntilTurn();
        }
        return out;
    }

    existsAndAlive(index: number): Combatant | undefined {
        const cmbt = this.combatant(index);
        if (cmbt && cmbt.alive) {
            return cmbt;
        }
    }
}
