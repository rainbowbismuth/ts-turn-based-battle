/// <reference path="../typings/tsd.d.ts" />
import React = require("react");
import ReactDOM = require("react-dom");

import { Player } from "./Player";
import { Combatant } from "./Combatant";
import Cls = require("./Class");
import { Simulation } from "./Simulation";

// This is for webpack
declare function require(s: string): string;
require("../web/scss/game.scss");

interface Model {
  sim: Simulation;
  move: null;
}

const InitialSim = {
  sim: Simulation.make([
    Combatant.make(0, "User", "Alpha", Cls.Warrior),
    Combatant.make(1, "User", "Beta", Cls.Thief),
    Combatant.make(2, "User", "Gamma", Cls.Cleric),
    Combatant.make(3, "AI", "Delta", Cls.Warrior),
    Combatant.make(4, "AI", "Epsilon", Cls.Thief),
    Combatant.make(5, "AI", "Zeta", Cls.Cleric),
  ]),
  move: null
}

const modelAtom = { ref: InitialSim };

function ResetModelAtom() {
  modelAtom.ref = InitialSim;
}

const ViewTooltip = (props: { text: string }) =>
  <div className="tooltip">
     {props.text}
  </div>

const View = (props: { model: Model }) =>
  <div className="game">
    <div className="main">
      <ViewParty player="AI" model={props.model}/>
      <ViewParty player="User" model={props.model}/>
      <ViewCombatLog log={props.model.sim.combatLog}/>
    </div>
    <ViewCtBar model={props.model}/>
    <ViewResetButton/>
  </div>

function ViewParty(props: { player: Player, model: Model }) {
  const units = props.model.sim.party(props.player);
  const cls = (props.player === "AI" ? "party ai-party" : "party user-party");
  return (
    <div className={cls}>
      {units.map((cmbt, idx) =>
        <ViewCombatant combatant={cmbt} key={idx} model={props.model}/>) }
    </div>
  );
}

function ViewCombatant(props: { combatant: Combatant, model: Model }) {
  const cls = (props.combatant.alive ? "combatant combatant-alive" : "combatant combatant-dead");
  return (
    <div className={cls}>
      <ViewCombatantStatusBar combatant={props.combatant}/>
      <ViewCombatantMoves combatant={props.combatant} model={props.model}/>
    </div>
  );
}

function ViewCombatantMoves(props: { combatant: Combatant, model: Model }) {
  return (
    <p> Moves go here </p>
  );
}

const ViewCombatantStatusBar = (props: { combatant: Combatant }) =>
  <div className="combatant-status-bar">
    <ViewCombatantClass combatant={props.combatant}/>
    <div className="combatant-attributes">
      <ViewCombatantName combatant={props.combatant}/>
      <ViewCombatantHP combatant={props.combatant}/>
      <ViewCombatantAP combatant={props.combatant}/>
      <ViewCombatantCT combatant={props.combatant}/>
    </div>
  </div>

const ViewCombatantClass = (props: { combatant: Combatant }) =>
  <span className="combatant-class">
    {props.combatant.klass.name}
  </span>

const ViewCombatantName = (props: { combatant: Combatant }) =>
  <span className="combatant-name">
    {props.combatant.name}
  </span>

const ViewCombatantHP = (props: { combatant: Combatant }) =>
  <div className="combatant-hp tooltip-container">
    <span className="combatant-hp-label">
      HP
    </span>
    {props.combatant.hp}
    <ViewTooltip text="Health"/>
  </div>

const ViewCombatantAP = (props: { combatant: Combatant }) =>
  <div className="combatant-ap tooltip-container">
    <span className="combatant-ap-label">
      AP
    </span>
    <span className="combatant-ap-filled">
      {"•••••".slice(5 - props.combatant.ap) }
    </span>
    <span className="combatant-ap-empty">
      {"•••••".slice(props.combatant.ap) }
    </span>
    <ViewTooltip text={`This unit has ${props.combatant.ap} AP to spend on moves`}/>
  </div>

const ViewCombatantCT = (props: { combatant: Combatant }) =>
  <div className="combatant-ct tooltip-container">
    <span className="combatant-ct-label">
      CT
    </span>
    {props.combatant.ct}
    <ViewTooltip text="Charge time, unit takes a turn when at least 100"/>
  </div>

const ViewCombatLog = (props: { log: string[] }) =>
  <div className="combat-log">
    {props.log.map(
      (line, index) =>
        <ViewCombatLogLine idx={index} key={index} line={line}/>) }
  </div>

const ViewCombatLogLine = (props: { idx: number, line: string }) =>
  <div className="combat-log-line" style={{ opacity: 1.0 - props.idx * 0.08 }}>
    {props.line}
  </div>

const ViewCtBar = (props: { model: Model }) =>
  <div className="ct-bar">
    Turn Order
  </div>

const ViewResetButton = (props: null) =>
  <button onClick={ResetModelAtom}>
    Reset!
  </button>

ReactDOM.render(
  <View model={InitialSim}/>,
  document.getElementById("app"));

