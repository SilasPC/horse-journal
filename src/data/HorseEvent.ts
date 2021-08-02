
import { Horse } from "./Horse"

export enum EventType {
    Competition,
    Farrier,
    Treatment,
    Vaccination,
}

export const EventTypes = [
    EventType.Competition,
    EventType.Farrier,
    EventType.Treatment,
    EventType.Vaccination,
]

export type TypeMaping = {
    [EventType.Competition]: Competition,
    [EventType.Treatment]: Treatment,
    [EventType.Farrier]: Farrier,
    [EventType.Vaccination]: Vaccination,
}

export const VAC_TYPES = ['EHV','INF'] as Vaccination['type'][]
export interface Vaccination {
    type: 'EHV' | 'INF'
    date: Date,
}

export abstract class HorseEvent {
    constructor(
        public name: string,
        public date: Date,
        public readonly type: EventType
    ) {}
    isOverDue() {
        return this.date.valueOf() + ONE_DAY < Date.now()
    }
    isAheadWithinDays(n: number) {
        let now = Date.now() + ONE_DAY
        let date = this.date.valueOf()
        return date > now && now + (n+1) * ONE_DAY > date
    }
    daysUntil() {
        return Math.floor((this.date.valueOf() - Date.now()) / ONE_DAY)
    }
    daysAgo() {
        return -this.daysUntil()
    }
    weeksAgo() {
        return Math.floor(this.daysAgo() / 7)
    }
    isVerySoon() {
        return this.isAheadWithinDays(4)
    }
    isSoon() {
        return this.isAheadWithinDays(14)
    }
    notif(): string | void {}
    expenses(): number {return 0}
}

export class Treatment extends HorseEvent {
    constructor(
        name: string,
        date: Date,
        public note: string,
        public end: Date
    ) {
        super(name, date, EventType.Treatment)
    }

    isCurrent() {
        return this.end.valueOf() + ONE_DAY > Date.now()
    }

}

export class Competition extends HorseEvent {
    constructor(
        note: string,
        date: Date,
        public cost: number,
        public result: string
    ) {
        super(note, date, EventType.Competition)
    }

    notif() {
        if (this.daysUntil() == 30)
            return `Stævne om en måned (${this.name})`
        if (this.isAheadWithinDays(12))
            return `Stævne om ${this.daysUntil()} dage`
        if (!this.result && this.isOverDue())
            return `Angiv stævne resultat for '${this.name}'`
    }

    expenses() {return this.cost}

}

export class Farrier extends HorseEvent {
    constructor(
        note: string,
        date: Date,
    ) {
        super(note, date, EventType.Farrier)
    }

    notif() {
        if (this.isVerySoon())
            return `Smed den ${this.date.toLocaleDateString()}`
    }

}


export const ONE_DAY = 24*60*60*1000
export const ONE_WEEK = 7 * ONE_DAY

export function checkVaccines(h: Horse, t: Vaccination['type']) {
    const THREE_MONTHS = ONE_DAY * 72
    /*
        BASIS: two vacs with 4-6w interval
        MAINTENANCE: < 6m
    */
    let vacs = h.eventsOf(EventType.Vaccination)
        .filter(v => v.type == t)
    // check for basis
    /** idx of booster */
    let boosterIdx = -1
    for (let i = vacs.length - 1; i > 0; i--) {
        let dif = vacs[i].date.valueOf() - vacs[i-1].date.valueOf()
        if (dif >= 4 * ONE_WEEK && dif <= 6 * ONE_WEEK) {
            boosterIdx = i
            break
        }
    }
    // check for maintenance
    let maintenanceOkay = boosterIdx >= 0
    let nextVac: null | Date = null
    if (boosterIdx >= 0) {
        let lastDate = vacs[boosterIdx].date
        for (let i = boosterIdx; i < vacs.length; i++) {
            let date = vacs[i].date
            let dif = date.valueOf() - lastDate.valueOf()
            lastDate = date
            if (dif > 2 * THREE_MONTHS) {
                maintenanceOkay = false
                break
            }
        }
        if (maintenanceOkay) {
            nextVac = new Date(lastDate.valueOf() + 2 * THREE_MONTHS)
        }
    }
    return {
        boosterOkay: boosterIdx >= 0,
        maintenanceOkay,
        nextMaintenance: nextVac,
    }
}