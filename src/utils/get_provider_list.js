import uniq from 'lodash/uniq';
import map from 'lodash/map';

export const get_provider_list = all_stations_details => {
  return uniq(map(all_stations_details, 'provider'));
};
