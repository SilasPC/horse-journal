import { checkVaccines, EventType, HorseEvent, ONE_DAY, TypeMaping, VAC_TYPES } from "./HorseEvent"

export enum Sex {
    Gelding,
    Stallion,
    Mare,
}

export class Horse {

    static new() {
        return new Horse(
            'Unavngivet hest',
            new Date(),
            150,
            'Ikke angivet',
            Sex.Mare,
            [],
            {}
        )
    }

    constructor(
        public name: string,
        public birth: Date,
        public height: number,
        public id: string,
        public sex: Sex,
        public events: HorseEvent[],
        public feed: {[feed: string]: Feed}
    ) {}

    sortEvents() {
        this.events.sort((a,b) => b.date.valueOf() - a.date.valueOf())
    }

    latestOf<T extends EventType>(type: T) {
        return this.events.filter(e => e.type == type)[0] as TypeMaping[T] | void
    }
    eventsOf<T extends EventType>(type: T) {
        return this.events.filter(e => e.type == type) as TypeMaping[T][]
    }

    notifs() {
        let notifs = this.events.flatMap(e => e.notif() || [])
        let farrier = this.latestOf(EventType.Farrier)
        if (farrier && farrier.weeksAgo() >= 4)
            notifs.push(`${farrier.weeksAgo()} uger gamle sko`)
        for (let vacType of VAC_TYPES) {
            let vac = checkVaccines(this, vacType)
            if (!vac.boosterOkay) {
                notifs.push(`${vacType} basis vaccine mangler`)
            } else if (!vac.maintenanceOkay) {
                notifs.push(`${vacType} vaccine overskredet`)
            } else {
                let daysUntilVac = Math.floor((vac.nextMaintenance!.valueOf() - Date.now()) / ONE_DAY)
                if (daysUntilVac < 31)
                    notifs.push(`${vacType} vaccine om ${daysUntilVac} dage`)
            }
        }
        return notifs
    }

    expenses() {
        return this.events.reduce((sum, e) => sum + e.expenses(), 0)
    }
    
}

