const BASE_PATH = 'https://api.triptocarbon.xyz/v1/footprint';

const fetch_options = {
  method: 'GET',
  headers: new Headers({
    Accept: 'application/json'
  })
};

export async function request__get_trip_to_carbon(km = 230, carType = 'anyCar') {
  this.is_loading = true;
  try {
    const response = await fetch(
      `${BASE_PATH}?activity=${km / 1.6}&activityType=miles&country=def&mode=${carType}`,
      fetch_options
    );
    const results = await response.json();
    this.carbon_footrpint = +results.data.carbonFootprint;
  } catch (error) {
    this.carbon_footprint = +'54.63';
  }
  console.log('carbon footprint', this.carbon_footprint);
  this.is_loading = false;
}