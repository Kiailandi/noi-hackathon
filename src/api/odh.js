const BASE_PATH = 'https://tourism.opendatahub.bz.it/api';
export const TOKEN = `CmH43rqGeQuXL73jaQQUb1wA_fLEE4nyjz9lVKaEEj-PrbA2L-YC37WUFBHmDMuECAbI42nCCb0B5L9NC5yXaO9Tt-2kcR_FsWpQV5wX8ATt_vRE5tnjJ7bbhX77kQUn-3SnQLkc2qZ-urz29djZ3yESW5NtDNr4vJlQCq-SMlJUXda3UZhJTskvsjF1MmLKCUAG3tmfJ1fgpEL_0DNUvCTSnu-5nZIFkGy4It8hZCfABvLzgRRo4G8PAnoea7Srb8R2mL7YCakaMXRD6KvmUR688CeWcnE_tfzCEgMBZDX1o-c93LrvESpK5N6yaAx4RrNzPuWTdwbdSrofb6Q7k56mYVtCfLScoAC3vJdyKqmnG8TqslNWK3tfLnPWQyyYJuM352U-qIqQ5QrPkI9nH4CARq1YUvRgv_cYkNN6cwWCkYnFqYaU9bowQ6CqW9jEt1veF8GRw6xUtGQAQWAA6DTbz-o52jXXtXYLo_3EuAD0hqnj41sTN7UBPZZziSxQnWq99Eb8DhhuJlamty3AhPmgQRSTy890cmv1u8XdIcw`;

export async function request__near_restaurants(lat, lon) {
  const response = await fetch(
    `${BASE_PATH}/Gastronomy?pagesize=3&latitude=${lat}&longitude=${lon}&radius=300&smgactive=true`,
    {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
      })
    }
  );
  const results = await response.json();

  this.station_near_restaurants = [...results.Items];
}

export async function request__near_accomodations(lat, lon) {
  const response = await fetch(
    `${BASE_PATH}/Accommodation?pagesize=3&latitude=${lat}&longitude=${lon}&radius=300&smgactive=true`,
    {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
      })
    }
  );
  const results = await response.json();

  this.station_near_accomodations = [...results.Items];
}
