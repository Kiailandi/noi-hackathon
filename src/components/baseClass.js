import L from 'leaflet';
import { LitElement } from 'lit-element';
import { request__get_stations_details, request__get_stations_plugs_details } from '../api/integreen-life';
import { request__get_coordinates_from_search } from '../api/nominatim';
import { request__near_accomodations, request__near_restaurants } from '../api/odh';
import {
  request__get_carsharing_stations_details,
  request__get_bikesharing_stations_details,
  request__near_carsharing,
  request__near_bikesharing
} from '../api/odh-new';
import { request__get_trip_to_carbon } from '../api/trip-to-carbon';
import { request__get_trip_length } from '../api/distance';
import { TOKEN } from '../config';
import user__marker from '../icons/user.png';
import station_marker from '../icons/red_dot.png';
import { render__details_box } from './details_box';
import { render__filter_box } from './filter_box';
import { request_access_types, request_plug_types } from './filter_box/api';
import { render__filter_values_mobile } from './filter_values_mobile';
import { render__modal__star_rating } from './modal__star_rating';
import { render__loading_overlay } from './overlay_loading';
import { render__search_box } from './search_box';
import { render__search_box_underlay } from './search_box_underlay';

export class BaseClass extends LitElement {
  constructor() {
    super();
    this.all_stations_ids = [];
    this.all_stations_details = [];
    this.all_plugs_details = [];
    this.current_station = {};
    this.userMarker = null;
    this.is_loading = false;
    this.current_location = { lat: 46.4954034, lng: 11.3379899 };
    this.station_location = { lat: 46.4963108, lng: 11.3594898 };
    this.showFilters = false;
    this.filters = {
      radius: 0,
      access_type: [],
      plug_type: [],
      state: [],
      provider: []
    };
    this.visibleStations = 0;
    this.searched_places = [];
    this.ratingModalStep = 0;
    this.showRatingModal = false;
    this.token = TOKEN;
    this.isFullScreen = false;
    this.starting_city = 'Vicenza (Italy)'
    this.station_near_restaurants = [];
    this.station_near_accomodations = [];
    this.station_near_carsharing = [];
    this.station_near_bikesharing = [];
    this.provider_list = [];
    this.query_nominatim = '';
    this.details_mobile_state = false;
    this.access_types = [];
    this.plug_types = [];
    /* Parameters */
    const [language] = (window.navigator.userLanguage || window.navigator.language).split('-');
    this.language = language;
    /* Bindings */
    this.render__search_box = render__search_box.bind(this);
    this.render__details_box = render__details_box.bind(this);
    this.render__loading_overlay = render__loading_overlay.bind(this);
    this.render__modal__star_rating = render__modal__star_rating.bind(this);
    this.render__filter_box = render__filter_box.bind(this);
    this.render__filter_values_mobile = render__filter_values_mobile.bind(this);
    this.render__search_box_underlay = render__search_box_underlay.bind(this);
    this.request_access_types = request_access_types.bind(this);
    this.request_plug_types = request_plug_types.bind(this);
    /* Requests */
    this.request__get_stations_details = request__get_stations_details.bind(this);
    this.request__get_carsharing_station_details = request__get_carsharing_stations_details.bind(this);
    this.request__get_bikesharing_station_details = request__get_bikesharing_stations_details.bind(this);
    this.request__get_stations_plugs_details = request__get_stations_plugs_details.bind(this);
    this.request__get_coordinates_from_search = request__get_coordinates_from_search.bind(this);
    this.request__near_restaurants = request__near_restaurants.bind(this);
    this.request__near_accomodations = request__near_accomodations.bind(this);
    this.request__near_carsharing = request__near_carsharing.bind(this);
    this.request__near_bikesharing = request__near_bikesharing.bind(this);
    this.request__get_trip_to_carbon = request__get_trip_to_carbon.bind(this);
    this.request__get_trip_length = request__get_trip_length.bind(this);
  }

  drawUserOnMap() {
    /**
     * User Icon
     */
    const user_icon = L.icon({
      iconUrl: user__marker,
      iconSize: [25, 25]
    });
    const station_icon = L.icon({
      iconUrl: station_marker,
      iconSize: [25, 25]
    });
    const user = L.marker([this.current_location.lat, this.current_location.lng], {
      icon: user_icon
    });
    const station = L.marker([this.station_location.lat, this.station_location.lng], {
      icon: station_icon
    });
    /**
     * Circle around the user
     */
    const user_circle = L.circle([this.current_location.lat, this.current_location.lng], {
      radius: this.filters.radius * 1000,
      color: 'rgba(66, 133, 244, 0.6)',
      fillColor: 'rgba(66, 133, 244, 0.5)',
      weight: 1
    });
    user_circle.bindTooltip('Hotel', { permanent: true, offset: [0, 0] });
    const station_circle = L.circle([this.station_location.lat, this.station_location.lng], {
      radius: this.filters.radius * 1000,
      color: 'rgba(66, 133, 244, 0.6)',
      fillColor: 'rgba(66, 133, 244, 0.5)',
      weight: 1
    });
    station_circle.bindTooltip('Station', { permanent: true, offset: [0, 0] });
    /**
     * Add to map
     */
    this.layer_user = L.layerGroup([user, user_circle], {});
    this.layer_user.addTo(this.map);
    this.layer_station = L.layerGroup([station, station_circle], {});
    this.layer_station.addTo(this.map);
  }
}
