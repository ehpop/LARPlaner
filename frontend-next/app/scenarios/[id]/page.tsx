export default function ScenarioId({params}: { params: { id: string; }; }) {
    return (
        <div>
            Scenario Page for scenario with id {params.id}
        </div>
    );
}
