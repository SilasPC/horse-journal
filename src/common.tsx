
export const Card = (props: {header: string, children: React.ReactNode}) =>
    <div className="w3-card-4 w3-margin">
        <div className="w3-container w3-dark-grey">
            <h2>{props.header}</h2>
        </div>
        <div className="w3-container">
            {props.children}
        </div>
        <br/>
    </div>

export const Table = (props: {headers: (string|React.ReactNode)[], children: React.ReactNode}) =>
    <table className="w3-table w3-striped w3-bordered">
        <thead>
            <tr>
                {props.headers.map((h,i) => <th key={i}>{h}</th>)}
            </tr>
        </thead>
        <tbody>
            {props.children}
        </tbody>
    </table>

export const Panel = (props: {col: string, children: React.ReactNode}) =>
    <div className={`w3-panel w3-margin w3-leftbar ${props.col} w3-border`}>
        {props.children}
    </div>

export const CellRow = (props: {children: React.ReactNode[]}) =>
    <div className="w3-cell-row">
        {props.children}
    </div>

export const CellCol = (props: {children: React.ReactNode}) =>
    <div className="w3-cell">{props.children}</div>

export const Modal = (props: {header: string, onClose: () => void, children: React.ReactNode}) =>
    <div className="w3-modal w3-show">
        <div className="w3-modal-content w3-card-4">
            <div className="w3-container w3-dark-grey">
                <h2>{props.header}</h2>
                <span onClick={props.onClose} className="w3-button w3-display-topright w3-red">&times;</span>
            </div>
            <div className="w3-container">
                <br/>
                {props.children}
            </div>
        </div>
    </div>

export const icons = {
    horseShoe: 'assets/horseShoe.png',
    medic: 'assets/medic.png',
    vaccine: 'assets/vaccine.png',
    helmet: 'assets/helmet.png'
}

export const Icon = (k: keyof typeof icons) => <img height="20" src={icons[k]}/>

interface MutInputProps<T> {
    onChange: (v: T) => void
    noConfirm?: boolean,
    value: T
    type: T extends string ? 'string' : ( T extends number ? 'number' : 'date')
}
export class MutInput<T extends string|number|Date> extends React.Component<MutInputProps<T>, {mutating:boolean,value:T,prev:T}> {
    constructor(props: MutInputProps<T>) {
        super(props)
        this.state = {
            mutating: false,
            value: props.value,
            prev: props.value,
        }
    }

    onChange(e: any) {
        this.setState({
            value: e.target.value
        })
        if (this.props.noConfirm)
            this.props.onChange(
                (this.props.type == 'date' ? new Date(e.target.value) : e.target.value) as T
            )
    }
    undo() {
        return () => {
            this.setState({
                mutating: false,
                value: this.state.prev
            })
        }
    }
    edit() {
        return () => this.setState({
            mutating: true,
        })
    }
    save() {
        return () => {
            this.props.onChange(
                (this.props.type == 'date' ? new Date(this.state.value) : this.state.value) as T
            )
            this.setState({
                mutating: false,
                prev: this.state.value
            })
        }
    }
    
    render() {
        if (this.props.noConfirm) {
            return <input type={this.props.type} className="w3-input" value={this.curVal()} onChange={e=>this.onChange(e)}></input>
        }
        return <CellRow>
            <CellCol>
                <input type={this.props.type} className="w3-input" value={this.curVal()} onChange={e=>this.onChange(e)} readOnly={!this.state.mutating}></input>
            </CellCol>
            {
                this.state.mutating
                    ? <CellCol>
                        <button className="w3-button w3-green w3-round w3-small w3-right" style={{'display':'inline-block'}} onClick={this.save()}>Gem</button>
                        <button className="w3-button w3-red w3-round w3-small w3-right" style={{'display':'inline-block'}} onClick={this.undo()}>Annulér</button>
                    </CellCol>
                    : <CellCol>
                        <button className="w3-button w3-blue w3-round w3-small w3-right" style={{'display':'inline-block'}} onClick={this.edit()}>Redigér</button>
                    </CellCol>
            }
        </CellRow>
    }

    curVal(): number | string {
        return this.props.type == 'date' ? (this.state.value instanceof Date ? dateToInput(this.state.value) : this.state.value) : this.state.value as string|number
    }
    
}

export function dateToInput(d: Date) {
    return d.toISOString().substring(0,10)
}

interface TextAreaProps {
    value: string,
    onChange(s: string): void
}
export class TextArea extends React.Component<TextAreaProps, {value: string}> {
    constructor(props: TextAreaProps) {
        super(props)
        this.state = {
            value: props.value
        }
    }
    render() {
        return <textarea style={{width:'100%'}} value={this.state.value} onChange={e => {
            this.setState({
                value: e.target.value
            })
            this.props.onChange(e.target.value)
        }}></textarea>
    }
}
    