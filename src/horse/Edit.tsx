

interface HorseEditProps {
    horse: Horse
}
interface HorseEditState extends HorseEditProps {

}
class HorseEdit extends React.Component<HorseEditProps, HorseEditState> {
    constructor(props: HorseEditProps) {
        super(props)
        this.state = {...props}
    }
    delete() {
        if (window.confirm(`Vil du slette '${this.state.horse.name}'?`)) {
            // do something
        }
    }
    render() {
        return <Card header='Redigér hest'>

            <br/>
            
            <label>Navn</label>
            <MutInput type="string" onChange={v => this.state.horse.name = v} value={this.state.horse.name}/>
            <br/>
            
            <label>Fødselsdag</label>
            <MutInput type="date" onChange={v => this.state.horse.birth = v} value={this.state.horse.birth}/>
            <br/>
            
            <label>Køn</label>
            <select className="w3-select" name="option" value={this.state.horse.sex}>
                <option value={Sex.Mare}>Hoppe</option>
                <option value={Sex.Gelding}>Vallak</option>
                <option value={Sex.Stallion}>Hingst</option>
            </select>
            <br/>
            <br/>
            
            <label>Højde</label>
            <MutInput type="number" onChange={v => this.state.horse.height = v} value={this.state.horse.height}/>
            <br/>

            <label>Identifikationsnummer</label>
            <MutInput type="string" onChange={v => this.state.horse.id = v} value={this.state.horse.id}/>
            <br/>
            
            <button className="w3-button w3-red w3-right" onClick={()=>this.delete()}>Slet</button>

        </Card>
    }
}