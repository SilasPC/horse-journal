
import { Data, empty } from './data/Data'
import { Horse } from './data/Horse'
import { Feeding } from './Feed'
import { HorseOverview } from './horse/Overview'
import { Overview } from './Overview'

interface AppProps {
    data: Data
}
interface AppState extends AppProps {
    view: 'overview' | 'feed' | Horse
}
export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props)
        this.state = {
            data: empty(),
            view: 'overview'
        }
        setTimeout(() => this.setState({
            data: props.data,
            view: 'overview'
        }), 10)
    }

    select(view: AppState['view']) {
        return () => {
            this.setState({view})
        }
    }

    createHorse() {
        let h = Horse.new()
        this.state.data.horses.push(h)
        this.setState({view: h})
    }
    
    render() {
        let horses = this.state.data.horses.map(h =>
            <a
                key={h.id}
                className="w3-bar-item w3-button"
                onClick={this.select(h)}
            >{h.name}</a>)
        return <div>
            <div className="w3-bar w3-green">
                <a onClick={this.select('overview')} className="w3-bar-item w3-button">Oversigt</a>
                <a onClick={this.select('feed')} className="w3-bar-item w3-button">Fodring</a>
                <div className="w3-dropdown-hover">
                    <button className="w3-button">Heste</button>
                    <div className="w3-dropdown-content w3-bar-block w3-card-4">
                        {horses}
                        <a className="w3-bar-item w3-button" onClick={() => this.createHorse()}>Tilføj...</a>
                    </div>
                </div>
            </div>
            {this.renderView()}
        </div>
    }

    renderView() {
        switch (Object.getPrototypeOf(this.state.view).constructor) {
            case Horse:
                let h = this.state.view as Horse
                return <HorseOverview key={h.id} horse={this.state.view as Horse}/>
            case String:
                switch (this.state.view) {
                    case 'feed':
                        return <Feeding/>
                    case 'overview':
                        // fallthrough
                }
        }
        return <Overview key={Math.random()} data={this.state.data}/>
    }

}
