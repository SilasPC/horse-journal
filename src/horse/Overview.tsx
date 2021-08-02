
import { Card, Panel, Table } from "../common"
import { Horse } from "../data/Horse"
import { HorseEvent, Competition, EventType, ONE_DAY } from "../data/HorseEvent"
import { EventEdit } from "../Event"
import { isDefined } from "../Overview"
import { renderEventType } from "../trans"
import { HorseEdit } from "./Edit"

interface HorseOverviewProps {
    horse: Horse
}
interface HorseOverviewState extends HorseOverviewProps {
    editModal?: HorseEvent
}
export class HorseOverview extends React.Component<HorseOverviewProps, HorseOverviewState> {
    constructor(props: HorseOverviewProps) {
        super(props)
        this.state = {...props}
    }

    openModal(ev: HorseEvent) {
        this.setState({
            editModal: ev
        })
    }
    closeModal() {
        this.state.horse.sortEvents()
        this.setState({
            editModal: undefined
        })
    }

    createEvent() {
        let e = new Competition('Unavngivet stævne', new Date(), 0, '')
        this.state.horse.events.push(e)
        this.state.horse.sortEvents()
        this.setState({
            editModal: e
        })
    }
    
    render() {
        return <div>
            <div className="w3-container w3-cell-row">
                <div className="w3-cell">
                    <HorseEdit horse={this.state.horse}/>
                </div>
                <div className="w3-cell">
                    {this.renderOverview()}
                </div>
            </div>
            <Card header="Kalender">{this.renderCalender()}</Card>
            {isDefined(this.state.editModal) ? <EventEdit horse={this.state.horse} event={this.state.editModal} onClose={() => this.closeModal()}/> : ''}
        </div>
    }

    renderOverview() {
        return <Card header='Oversigt'>
            {this.renderNotifs()}
            {this.renderTreatments()}
            {this.renderExpenses()}
        </Card>
    }

    renderExpenses() {
        return this.renderPanel(`Omkostninger ${this.state.horse.expenses()} kroner`)
    }

    renderTreatments() {
        let cur = this.state.horse.eventsOf(EventType.Treatment).filter(t => t.isCurrent())
        if (cur.length == 0) {
            return this.renderPanel('Ingen nuværende behandlinger')
        }
        return this.renderPanel(
            cur.map(x => `${x.name} indtil ${x.end.toLocaleDateString()}`).join(', '),
            true
        )
    }

    renderNotifs() {
        let events = this.state.horse.notifs()
        if (events.length == 0) return ''
        return <Panel col="w3-pale-red">
            <h4>Underetninger</h4>
            <ul>
                {events.map(e => <li key={e}><p>{e}<br/></p></li>)}
            </ul>
        </Panel>

    }

    renderPanel(text: string, emp = false) {
        let col = emp ? 'w3-pale-red' : 'w3-light-grey'
        return <Panel col={col}><p>{text}</p></Panel>
    }

    renderCalender() {
        let now = Date.now()
        let els = this.state.horse.events.map(e => <tr key={e.date.toString()}>
            <td>{renderEventType(e.type)}</td>
            <td>{e.name}</td>
            <td>{e.date.toLocaleDateString()}</td>
            <td>{Math.round((e.date.valueOf() - now) / ONE_DAY)}</td>
            <td>
                <button className="w3-button w3-red">Slet</button>
                <button className="w3-button w3-blue" onClick={() => this.openModal(e)}>Redigér</button>
            </td>
        </tr>)
        return <div>
            <Table headers={["Type", "Notat", "Dato", "Dage tilbage", "Handlinger"]}>
                {els}
            </Table>
            <button className="w3-button w3-block w3-green" onClick={() => this.createEvent()}>Tilføj begivenhed</button>
        </div>
    }

}
