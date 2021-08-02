
type ObjMap<T> = {[key: string]: T}

interface FeedData {
    [feed: string]: {
        amount: number,
    } | void
}

interface Feed {
    unit: 'ml' | 'gram',
    description: string,
    maxAmount: number,
    minAmount: number,
}
