// const masterAddress = "Los Angeles, California, 90024"
// Focuses Search
const viewbox = "-118.456382,34.076497,-118.435424,34.060784";

export default async function addressToLongLat(input) {
    console.log(`Fetching foordinates from input ${input}`);
    try {
        const apiUrl = `https://nominatim.openstreetmap.org/search?q=${input}&format=geojson&viewbox=${viewbox}`;
        console.log(apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch data from the API. Status: ${response.status}`
            );
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const coordinates = data.features[0].geometry.coordinates;
            console.log(`Found Coordinates ${coordinates}`);
            return coordinates;
        } else {
            throw new Error("No coordinates found for the given input");
        }
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}

export async function addressToLatLong(input) {
    const longLat = await addressToLongLat(input);
    return [longLat[1], longLat[0]];
}
