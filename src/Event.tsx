
interface EventEditProps {
    horse: Horse
    event: HorseEvent
    onClose: () => void
}
interface EventEditState extends EventEditProps {}
class EventEdit extends React.Component<EventEditProps, EventEditState> {
    constructor(props: EventEditProps) {
        super(props)
        this.state = {...props}
    }
    render() {
        return <div className="w3-modal w3-show">
            <div className="w3-modal-content w3-card-4">
                <div className="w3-container w3-dark-grey">
                    <h2>Redigér begivenhed</h2>
                    <span onClick={this.state.onClose} className="w3-button w3-display-topright w3-red">&times;</span>
                </div>
                <div className="w3-container">
                    <br/>
                    {this.renderContent()}
                </div>
            </div>
        </div>
    }
    renderContent() {
        let e = this.state.event
        let common = <div>
            <label>Navn</label>
            <MutInput type="string" value={e.name} onChange={v => e.name = v}></MutInput>
            <br/>

            <label>Dato</label>
            <MutInput type="date" onChange={v => e.date = v} value={e.date}/>
            <br/>
        </div>
        switch (e.type) {
            case EventType.Competition:
                let c = e as Competition
                return <div className="w3-container">

                    {common}

                    <label>Resultat</label>
                    <MutInput type="string" value={c.result} onChange={v => c.result = v}></MutInput>
                    <br/>

                    <label>Pris</label>
                    <MutInput type="number" value={c.cost} onChange={v => c.cost = v}></MutInput>
                    <br/>

                </div>
            default:
                return 'Fejl type'
        }
    }
}