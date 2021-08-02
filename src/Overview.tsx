

interface OverviewProps {
    data: Data
}
interface OverviewState extends OverviewProps {
    filter: {
        eventType?: EventType
        horseName?: string
    }
}
class Overview extends React.Component<OverviewProps, OverviewState> {
    
    constructor(props: OverviewProps) {
        super(props)
        this.state = {
            ...props,
            filter: {}
        }
    }

    render() {
        return <CellRow>
            <CellCol>
                <Card header="Heste">
                    <Table headers={["Navn", "Sidste smed"]}>
                        {
                            this.state.data.horses.map(h => <tr key={h.id}>
                                <td>{h.name}</td>
                                <td>{h.latestOf(EventType.Farrier)?.date?.toLocaleDateString() ?? ''}</td>
                            </tr>)
                        }
                    </Table>
                </Card>
                {this.renderCalender()}
            </CellCol>
            <CellCol>
                <Card header="Underretninger">
                    {this.renderNotifs()}
                </Card>
            </CellCol>
        </CellRow>
    }

    renderNotifs() {
        let events = this.state.data.horses.flatMap(h => {
            let events = h.notifs()
            if (events.length == 0) return []
            return [[h,events] as [Horse,string[]]]
        })
        if (events.length == 0) {
            return <Panel col="w3-light-grey">
                <p>Ingen underretninger</p>
            </Panel>
        }
        return events.map(([h,e]) => <Panel key={h.id} col="w3-pale-red">
            <h4>{h.name}</h4>
            <ul>
                {e.map(e => <li key={e}><p>{e}<br/></p></li>)}
            </ul>
        </Panel>)
    }

    renderCalender() {

        let events = [] as [string,HorseEvent][]
        let f = this.state.filter;
        for (let h of this.state.data.horses) {

            if (isDefined(f.horseName) && !h.name.toLowerCase().includes(f.horseName.toLowerCase())) {continue}
            
            for (let e of h.events) {

                if (isDefined(f.eventType) && f.eventType != e.type) {continue}

                let v = e.date.valueOf()
                // i is first index where it is newer than the the element
                let i = events.findIndex(se => v > se[1].date.valueOf())
                events.splice(i+1, 0, [h.name, e])
            }
        }
        events.reverse()

        let now = Date.now()
        let els = events.map(([h,e]) => <tr key={h+e.date.toString()}>
            <td>{h}</td>
            <td>{eventTypeName(e.type)}</td>
            <td>{e.name}</td>
            <td>{e.date.toLocaleDateString()}</td>
            <td>{Math.round((e.date.valueOf() - now) / ONE_DAY)}</td>
        </tr>)
        let onFilterChange = (e: any, k: string) => {
            console.log(e?.target?.value || undefined)
            this.setState({
                filter: {
                    ... this.state.filter,
                    [k]: e?.target?.value || undefined
                }
            })
        }
        return <Card header="Kalender">
            <Table headers={[
                <input className="w3-select" placeholder="Hest" onChange={e => onFilterChange(e,'horseName')}/>,
                <select className="w3-select" onChange={e => onFilterChange(e,'eventType')}>
                    <option value="">Type</option>
                    {
                        EventTypes.map(t => <option key={t} value={t}>{EventType[t]}</option>)
                    }
                </select>,
                "Notat",
                "Dato",
                "Dage tilbage"
            ]}>
                {els}
            </Table>
        </Card>
    }

}

function isDefined<T>(val?: T): val is T {return val != undefined && val != null}