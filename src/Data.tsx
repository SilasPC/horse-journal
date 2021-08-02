
function empty(): Data {
    return {
        horses: []
    }
}

function sample(): Data {
    return {
        horses: [new Horse(
            'Marlon B OX',
            new Date('1/1/2010'),
            157,
            '208336OX1105432',
            Sex.Gelding,
            [
                new Competition(
                    'Rom CEI*1',
                    new Date('8/2/2021'),
                    10000,
                    ''
                ),
                new Treatment(
                    'Ormekur',
                    new Date('7/1/2021'),
                    'Panacur',
                    new Date('8/1/2021'),
                ),
                new Farrier(
                    '',
                    new Date('6/1/2021')
                )
            ]
        )]
    }
}

interface Data {
    horses: Horse[]
}

class Horse {

    static new() {
        return new Horse(
            'Unavngivet hest',
            new Date(),
            150,
            'Ikke angivet',
            Sex.Mare,
            [],
        )
    }

    constructor(
        public name: string,
        public birth: Date,
        public height: number,
        public id: string,
        public sex: Sex,
        public events: HorseEvent[]
    ) {
        this.sortEvents()
    }

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
        return notifs
    }

    expenses() {
        return this.events.reduce((sum, e) => sum + e.expenses(), 0)
    }
    
}

enum EventType {
    Competition,
    Farrier,
    Treatment
}

const EventTypes = [
    EventType.Competition,
    EventType.Farrier,
    EventType.Treatment,
]

type TypeMaping = {
    [EventType.Competition]: Competition,
    [EventType.Treatment]: Treatment,
    [EventType.Farrier]: Farrier
}

abstract class HorseEvent {
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

class Treatment extends HorseEvent {
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

class Competition extends HorseEvent {
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

class Farrier extends HorseEvent {
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

enum Sex {
    Gelding,
    Stallion,
    Mare,
}

const ONE_DAY = 24*60*60*1000