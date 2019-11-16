const BASE_PATH = 'http://router.project-osrm.org/route/v1';

const fetch_options = {
  method: 'GET',
  headers: new Headers({
    Accept: 'application/json'
  })
};

export async function request__get_trip_length (start, finish) {
  this.is_loading = true;
  try {
    const response = await fetch(
      `${BASE_PATH}?/driving/${start.lat},${start.lng};${finish.lat},${finish.lng}`,
      fetch_options
    );
    const results = await response.json();
    this.is_loading = false;
    this.distance = [...results.data];
  } catch (error) {
    this.is_loading = false;
    this.distance = 1900;
  }
}
