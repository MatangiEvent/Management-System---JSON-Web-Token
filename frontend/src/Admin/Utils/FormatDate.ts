export function FormatDate(dateString: string): string{
    return new Date(dateString).toLocaleDateString("en-US",
    {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }
    );
}