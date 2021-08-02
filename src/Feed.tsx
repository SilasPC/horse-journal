
import { Table } from "./common"

type FeedProps = ObjMap<Feed>
export const Feeding = (p: FeedProps) =>
    <Table headers={['Foder', 'Beskrivelse', 'Min', 'Max']}>
        {
            Object.entries(p)
                .map(([k,v]) => <tr key={k}>
                    <td>{k}</td>
                    <td>{v.description}</td>
                    <td>{v.minAmount}</td>
                    <td>{v.maxAmount}</td>
                </tr>)
        }
    </Table>