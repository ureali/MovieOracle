export default async function fetchImdbIds(query:string):Promise<Array<string> | undefined> {
    if (!query.trim()) {
        return;
    }

    const data = new FormData();
    data.append("query", query)
    const response = await fetch(`/api/v1/recommend`,
        {
            method: "post",
            body: data
        });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Network response was not ok" }));
        throw new Error(errorData.message || "Failed to fetch movies");
    }
    return await response.json() as Promise<Array<string>>;
}
