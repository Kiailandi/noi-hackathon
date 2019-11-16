import L from 'leaflet';
import leaflet_mrkcls from 'leaflet.markercluster';
import style__markercluster from 'leaflet.markercluster/dist/MarkerCluster.css';
import style__leaflet from 'leaflet/dist/leaflet.css';
import { html } from 'lit-element';
import { request__get_plug_details } from './api/integreen-life';
import { BaseClass } from './components/baseClass';
import { render__map_controls } from './components/map_controls';
import { map_tag } from './components/map_tag';
import image_logo from './icons/logo.png';
import { observed_properties } from './observed_properties';
import style__buttons from './scss/buttons.scss';
import style from './scss/main.scss';
import style__typography from './scss/typography.scss';
import utilities from './scss/utilities.scss';
import style__greta from './scss/greta.scss';
import {
  getLatLongFromStationDetail,
  getLatLongFromSharingStationDetail,
  getStyle,
  get_user_platform,
  stationStatusMapper,
  carsharing_stationStatusMapper,
  bikesharing_stationStatusMapper
} from './utils';
import { get_provider_list } from './utils/get_provider_list';
import icon_co2 from './icons/co2.png';

class EMobilityMap extends BaseClass {
  static get properties() {
    return observed_properties;
  }

  async initializeMap() {
    this.map = L.map(this.shadowRoot.getElementById('map'), { zoomControl: false }).setView(
      [
        (this.current_location.lat + this.station_location.lat) / 2,
        (this.current_location.lng + this.station_location.lng) / 2
      ],
      15
    );
    L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
      attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
    }).addTo(this.map);
  }

  async drawMap() {
    this.drawUserOnMap();

    await this.request__get_stations_details();
    await this.request__get_stations_plugs_details();

    await this.request__get_carsharing_station_details();
    await this.request__get_bikesharing_station_details();

    await this.request__get_trip_to_carbon();

    this.provider_list = get_provider_list(this.all_stations_details);

    /**
     * Render stations markers
     */
    const columns_layer_array = [];
    /**
     * Apply filters:
     */
    let filtered_stations_details = this.all_stations_details.filter(o => {
      /**
       * radius
       */
      const marker_position = getLatLongFromStationDetail(o);
      const distance = L.latLng([this.current_location.lat, this.current_location.lng]).distanceTo([
        marker_position.lat,
        marker_position.lng
      ]);

      if (!this.filters.radius) {
        return true;
      }
      return distance / 1000 < this.filters.radius;
    });

    const filtered_carsharing_stations_details = this.all_carsharing_stations_details.filter(o => {
      /**
       * radius
       */
      const marker_position = getLatLongFromSharingStationDetail(o);
      const distance = L.latLng([this.station_location.lat, this.station_location.lng]).distanceTo([
        marker_position.lat,
        marker_position.lng
      ]);

      if (!this.filters.radius) {
        return true;
      }
      return distance / 1000 < this.filters.radius;
    });

    const filtered_bikesharing_stations_details = this.all_bikesharing_stations_details.filter(o => {
      /**
       * radius
       */
      const marker_position = getLatLongFromSharingStationDetail(o);
      const distance = L.latLng([this.station_location.lat, this.station_location.lng]).distanceTo([
        marker_position.lat,
        marker_position.lng
      ]);

      if (!this.filters.radius) {
        return true;
      }
      return distance / 1000 < this.filters.radius;
    });

    filtered_stations_details = filtered_stations_details.filter(o => {
      /**
       * access_type
       */
      const condition_access_type = this.filters.access_type.length
        ? this.filters.access_type.includes(o.accessType)
        : true;
      /**
       *  plug_type
       */
      const station_plugs = this.all_plugs_details.filter(plug => plug.parentStation === o.id);
      const filtered__station_plugs = station_plugs.filter(plug => {
        let condition = false;
        plug.outlets.map(outlet => {
          if (!condition) {
            condition = this.filters.plug_type.includes(outlet.outletTypeCode);
          }
          return undefined;
        });
        return condition;
      });
      /**
       * provider
       */
      const condition_provider = this.filters.provider.length ? this.filters.provider.includes(o.provider) : true;

      const condition_plug_type = this.filters.plug_type.length ? filtered__station_plugs.length : true;
      if (this.filters.state.length) {
        /* state TODO: this can disrupt performances */
        // let plugs_status = [];
        // for (let i = 0; i < station_plugs.length; i++) {
        //   const element = station_plugs[i];
        //   const response = await request__get_plug_details(element.id);
        //   plugs_status.push(response);
        // }
      }

      /* Merge conditions */
      return condition_access_type && condition_provider && Boolean(condition_plug_type);
    });

    /*
    filtered_stations_details.map(o => {
      const marker_position = getLatLongFromStationDetail(o);
      const station_icon = L.icon({
        iconUrl: stationStatusMapper(o.state, o.origin),
        iconSize: o.state !== 'ACTIVE' && o.state !== 'AVAILABLE' ? [30, 30] : [36, 36]
      });
      const marker = L.marker([marker_position.lat, marker_position.lng], {
        icon: station_icon
      });

      const action = async () => {
        this.is_loading = true;
        const station_plugs = this.all_plugs_details.filter(plug => plug.parentStation === o.id);

        const plugs_status = [];
        for (let i = 0; i < station_plugs.length; i++) {
          const element = station_plugs[i];
          const response = request__get_plug_details(element.id);
          plugs_status.push(response);
        }

        await Promise.all(plugs_status);
        await this.request__near_restaurants(marker_position.lat, marker_position.lng);
        await this.request__near_accomodations(marker_position.lat, marker_position.lng);
        await this.request__near_carsharing(marker_position.lat, marker_position.lng);
        await this.request__near_bikesharing(marker_position.lat, marker_position.lng);

        this.current_station = { ...o, station_plugs, plugs_status };
        this.showFilters = false;
        this.is_loading = false;
      };

      marker.on('mousedown', action);

      columns_layer_array.push(marker);

      return undefined;
    });
    console.log('energy columns layer', columns_layer_array.length);
    */

    filtered_carsharing_stations_details.map(o => {
      const marker_position = getLatLongFromSharingStationDetail(o);
      console.log('o', o.sactive, o.savaiable);
      console.log('car marker_position', marker_position);
      /** Creating the icon */
      const station_icon = L.icon({
        iconUrl: carsharing_stationStatusMapper(o.sactive, o.savailable),
        iconSize: [36, 36]
      });
      const marker = L.marker([marker_position.lat, marker_position.lng], {
        icon: station_icon
      });

      const action = async () => {
        this.is_loading = true;

        this.current_station = { ...this.station_location };
        this.showFilters = false;
        this.is_loading = false;
      };

      marker.on('mousedown', action);

      columns_layer_array.push(marker);

      return undefined;
    });
    console.log('car columns layer', columns_layer_array.length);

    filtered_bikesharing_stations_details.map(o => {
      const marker_position = getLatLongFromSharingStationDetail(o);
      console.log('bike marker_position', marker_position);
      /** Creating the icon */
      const station_icon = L.icon({
        iconUrl: bikesharing_stationStatusMapper(o.sactive, o.savaiable),
        iconSize: [36, 36]
      });
      const marker = L.marker([marker_position.lat, marker_position.lng], {
        icon: station_icon
      });

      const action = async () => {
        this.is_loading = true;

        this.current_station = { ...this.station_location };
        this.showFilters = false;
        this.is_loading = false;
      };

      marker.on('mousedown', action);

      columns_layer_array.push(marker);

      return undefined;
    });
    console.log('bike columns layer', columns_layer_array.length);

    await this.request__near_carsharing(this.station_location.lat, this.station_locationlng);
    await this.request__near_bikesharing(this.station_location.lat, this.station_location.lng);

    this.visibleStations = columns_layer_array.length;
    const columns_layer = L.layerGroup(columns_layer_array, {});

    /** Prepare the cluster group for station markers */
    this.layer_columns = new leaflet_mrkcls.MarkerClusterGroup({
      showCoverageOnHover: false,
      chunkedLoading: true,
      iconCreateFunction(cluster) {
        return L.divIcon({
          html: `<div class="marker_cluster__marker">${cluster.getChildCount()}</div>`,
          iconSize: L.point(36, 36)
        });
      }
    });
    /** Add maker layer in the cluster group */
    this.layer_columns.addLayer(columns_layer);
    /** Add the cluster group to the map */
    this.map.addLayer(this.layer_columns);

    /** Handle zoom */
    const btnZoomIn = this.shadowRoot.getElementById('zoomMapIn');
    const btnZoomOut = this.shadowRoot.getElementById('zoomMapOut');
    const btnCenterMap = this.shadowRoot.getElementById('centerMap');
    btnZoomIn.onclick = () => {
      this.map.setZoom(this.map.getZoom() + 1);
    };
    btnZoomOut.onclick = () => {
      this.map.setZoom(this.map.getZoom() - 1);
    };
    btnCenterMap.onclick = () => {
      try {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
          if (result.state === 'granted') {
            this.is_loading = true;
            navigator.geolocation.getCurrentPosition(
              pos => {
                const { latitude, longitude } = pos.coords;
                this.current_location = { lat: latitude, lng: longitude };
                this.current_station = {};
                this.showFilters = false;
                this.map.flyTo([latitude, longitude], 15);
                this.map.removeLayer(this.layer_columns);
                this.map.removeLayer(this.layer_user);
                this.drawMap();
                this.is_loading = false;
              },
              () => {}
            );
          } else {
            this.is_loading = false;
          }
        });
      } catch (error) {
        this.is_loading = false;
      }
    };
  }

  async firstUpdated() {
    this.initializeMap();
    this.drawMap();
    await this.request_access_types();
    await this.request_plug_types();
  }

  handleToggleShowFilters() {
    /** Closing details box */
    const user_actions_container__details = this.shadowRoot.getElementById('user_actions_container__details');
    if (user_actions_container__details) {
      user_actions_container__details.classList.remove('open');
    }
    this.current_station = {};

    /** Closing the places results box */
    if (this.searched_places.length && !this.showFilters) {
      this.searched_places = [];
    }
    this.showFilters = !this.showFilters;
  }

  handleFullScreenMap() {
    const e_mobility_map = this.shadowRoot.getElementById('e_mobility_map');
    const map = this.shadowRoot.getElementById('map');
    e_mobility_map.classList.toggle('closed');
    map.classList.toggle('closed');

    if (this.isFullScreen) {
      try {
        document.body.exitFullscreen();
      } catch (error) {
        try {
          document.webkitExitFullscreen();
        } catch (e_webkit) {
          try {
            document.body.cancelFullScreen();
          } catch (e_moz) {
            /* continue regardless of error */
          }
        }
      }
    } else {
      try {
        document.body.requestFullscreen();
      } catch (error) {
        try {
          document.body.webkitRequestFullscreen();
        } catch (e_webkit) {
          try {
            document.body.mozRequestFullScreen();
          } catch (e_moz) {
            /* continue regardless of error */
          }
        }
      }
    }

    this.map.invalidateSize(true);
    this.isFullScreen = !this.isFullScreen;
  }

  render() {
    return html`
      <style>
        ${style__markercluster}
        ${getStyle(style__leaflet)}
        ${getStyle(style)}
        ${getStyle(utilities)}
        ${getStyle(style__typography)}
        ${getStyle(style__buttons)}
        ${getStyle(style__greta)}
      </style>
      <div id=${'e_mobility_map'} class="e_mobility_map closed platform_${get_user_platform()}">
        ${this.render__loading_overlay()} ${this.render__search_box_underlay()}
        <div style="z-index: 1003" class="user_actions_container__search_box">
          ${this.render__search_box()}
        </div>
        <div style="z-index: 1001" class="user_actions_container__mobile_filters">
          ${this.render__filter_values_mobile()}
        </div>

        <div
          style="${this.current_station ? 'z-index: 1002;' : 'display: none;'}"
          class="user_actions_container"
          id="user_actions_container__details"
        >
          ${this.render__details_box()}
        </div>
        <div
          style="${this.showFilters ? 'z-index: 1001;' : 'display: none;'}"
          class="user_actions_container open"
          id="user_actions_container__filters"
        >
          ${this.render__filter_box()}
        </div>

        ${map_tag}

        <div class="logo_container">
          <div class="img" style="background-image: url(${this.logo ? this.logo : image_logo})"></div>
        </div>

        ${render__map_controls(this.isFullScreen, this.handleFullScreenMap)}
        ${this.showRatingModal ? this.render__modal__star_rating() : null}
      </div>
      <div id="greta">
        Coming from <span class="city bold">${this.starting_city}</span>, using green mobility, you are saving a whopping: <span class="bold">${this.carbon_footprint}Kg of</span> <img src="${icon_co2}" />!
      </div>
    `;
  }
}

if (!window.customElements.get('e-mobility-map-widget')) {
  window.customElements.define('e-mobility-map-widget', EMobilityMap);
}
