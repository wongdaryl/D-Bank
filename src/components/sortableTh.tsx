export interface SortConfig {
    key: string;
    direction: "asc" | "desc" | "";
}

interface SortableThProps {
    label: string;
    sortKey: string;
    requestSort: (key: string) => void;
    sortConfig: SortConfig;
}

export const SortableTh: React.FC<SortableThProps> = ({
    label,
    sortKey,
    requestSort,
    sortConfig,
}) => {
    const getClassNamesFor = (name: string) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    return (
        <th
            className={`px-4 py-2 cursor-pointer ${getClassNamesFor(sortKey)}`}
            onClick={() => requestSort(sortKey)}
            title={`Click to sort by ${label}`}
        >
            {label}{" "}
            {sortConfig.key === sortKey && sortConfig.direction === "asc"
                ? "▲"
                : sortConfig.key === sortKey && sortConfig.direction === "desc"
                ? "▼"
                : ""}
        </th>
    );
};
