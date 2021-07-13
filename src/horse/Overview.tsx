
interface HorseOverviewProps {
    horse: Horse
}
interface HorseOverviewState extends HorseOverviewProps {

}
class HorseOverview extends React.Component<HorseOverviewProps, HorseOverviewState> {
    constructor(props: HorseOverviewProps) {
        super(props)
        this.state = {...props}
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
        </div>
    }

    renderOverview() {
        return <Card header='Oversigt'>{this.renderTreatments()}</Card>
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
        </tr>)
        return <Table headers={["Type", "Notat", "Dato", "Dage tilbage"]}>
            {els}
        </Table>
    }

}
