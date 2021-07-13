
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
    render() {
        return <Card header='Redigér hest'>
            <form className="w3-container w3-padding">
                
                <label>Navn</label>
                <input className="w3-input" type="text" value={this.state.horse.name}/>
                <br/>
                
                <label>Fødselsdag</label>
                <input className="w3-input" type="date" value={"this.state.horse.birth.toUTCString()"}/>
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
                <input className="w3-input" type="number" value={this.state.horse.height}/>
                <br/>

                <label>Identifikationsnummer</label>
                <input className="w3-input" type="text" value={this.state.horse.id}/>
                <br/>
                
                <button className="w3-button w3-red w3-right">Slet</button>

            </form>
        </Card>
    }
}