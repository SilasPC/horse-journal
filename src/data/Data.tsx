
import { Horse, Sex } from './Horse'
import { Competition, Farrier, Treatment } from './HorseEvent'

export function empty(): Data {
    return {
        horses: [],
        feeds: {}
    }
}

export function sample(): Data {
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
                    '',
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
            ],
            {}
        )],
        feeds: {
            'Lino-Crunch': {
                unit: 'gram',
                description: 'Olieholdigt',
                maxAmount: 10,
                minAmount: 8,
            }
        }
    }
}

export interface Data {
    feeds: {[feed:string]: Feed | void}
    horses: Horse[]
}
