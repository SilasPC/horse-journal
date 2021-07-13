
const Card = (props: {header: string, children: React.ReactNode}) =>
    <div className="w3-card-4 w3-margin">
        <div className="w3-container w3-dark-grey">
            <h2>{props.header}</h2>
        </div>
        <div className="w3-container">
            {props.children}
        </div>
        <br/>
    </div>

const Table = (props: {headers: (string|React.ReactNode)[], children: React.ReactNode}) =>
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

const Panel = (props: {col: string, children: React.ReactNode}) =>
    <div className={`w3-panel w3-margin w3-leftbar ${props.col} w3-border`}>
        {props.children}
    </div>

const CellRow = (props: {children: React.ReactNode[]}) =>
    <div className="w3-container w3-cell-row">
        {props.children}
    </div>

const CellCol = (props: {children: React.ReactNode}) =>
    <div className="w3-cell">{props.children}</div>

const icons = {
    horseShoe: 'assets/horseShoe.png',
    medic: 'assets/medic.png',
    vaccine: 'assets/vaccine.png',
    helmet: 'assets/helmet.png'
}

const Icon = (k: keyof typeof icons) => <img height="20" src={icons[k]}/>