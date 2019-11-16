const BASE_PATH = 'https://ipchannels.integreen-life.bz.it/ninja/api/v2/flat';

const fetch_options = {
  method: 'GET',
  headers: new Headers({
    Accept: 'application/json'
  })
};

export async function request__get_carsharing_stations_details() {
  this.is_loading = true;
  const response = await fetch(`${BASE_PATH}/CarsharingStation/*`, fetch_options);
  const results = await response.json();
  this.all_carsharing_stations_details = [...results.data];
  console.log('all carsharing', this.all_carsharing_stations_details);
  this.is_loading = false;
}

export async function request__get_bikesharing_stations_details() {
  this.is_loading = true;
  const response = await fetch(`${BASE_PATH}/BikesharingStation/*`, fetch_options);
  const results = await response.json();
  this.all_bikesharing_stations_details = [...results.data];
  console.log('all bikesharing', this.all_bikesharing_stations_details);
  this.is_loading = false;
}

export async function request__near_carsharing(lat, lon) {
  const response = await fetch(
    `${BASE_PATH}/CarsharingStation?pagesize=3&latitude=${lat}&longitude=${lon}&radius=300&smgactive=true`,
    fetch_options
  );
  const results = await response.json();
  console.log('near car results', results);
  this.station_near_carsharing = [...results.data];
}

export async function request__near_bikesharing(lat, lon) {
  const response = await fetch(
    `${BASE_PATH}/BikesharingStation?pagesize=3&latitude=${lat}&longitude=${lon}&radius=300&smgactive=true`,
    fetch_options
  );
  const results = await response.json();
  console.log('near bike results', results);
  this.station_near_bikesharing = [...results.data];
}
