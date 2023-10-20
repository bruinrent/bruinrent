export default async function addressToLongLat(input) {
    console.log(`Fetching foordinates from input ${input}`)
    try {
      const apiUrl = `https://nominatim.openstreetmap.org/search?q=${input}&format=geojson`;
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data from the API. Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates;
        console.log(`Found Coordinates ${coordinates}`)
        return coordinates;
      } else {
        throw new Error('No coordinates found for the given input');
      }
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }