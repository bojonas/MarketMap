const tabs = ['Home', 'MapViewer', 'MapEditor'];

export default function Navigation() {
    return (
        <div className="flex-grow grid grid-flow-col gap-4 items-center justify-center bg-slate-600">
            {tabs.map(tab => 
                <Tab key={tab} tab={tab}/>
            )}
        </div>
    );
}

function Tab({tab}) {
    return (
        <div>
            <a href={`./${tab}`}>{tab}</a>
        </div>
    );
}