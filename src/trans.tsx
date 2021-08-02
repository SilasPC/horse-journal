

const eventTrans: {[key in EventType]: string} = {
    [EventType.Competition]: 'Stævne',
    [EventType.Farrier]: 'Smed',
    [EventType.Treatment]: 'Behandling',
    [EventType.Vaccination]: 'Vaccination',
}

function eventTypeName(t: EventType): string {
    return eventTrans[t]
}

function renderEventType(t: EventType) {
    let render = (icon: keyof typeof icons) => <div><p>{eventTrans[t]} {Icon(icon)}</p></div>
    switch (t) {
        case EventType.Competition:
            return render('helmet')
        case EventType.Treatment:
            return render('medic')
        case EventType.Farrier:
            return render('horseShoe')
        default:
            return <p>{EventType[t]}</p>
    }
}