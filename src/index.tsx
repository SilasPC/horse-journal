
import { App } from "./App";
import { sample } from "./data/Data";

console.log('render...')
ReactDOM.render(<App data={sample()}/>, document.getElementById('root'))
