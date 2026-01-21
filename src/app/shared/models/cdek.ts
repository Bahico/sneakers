export interface Cdek {
    code: string;
    name: string;
    uuid: string;
    address_comment: string;
    nearest_station: string;
    nearest_metro_station: string;
    work_time: string;
    phones: {number: string}[];
    email: string;
    note: string;
    type: string;
    owner_code: string;
    take_only: boolean;
    is_handout: boolean;
    is_reception: boolean;
    is_dressing_room: boolean;
    is_ltl: boolean;
    have_cashless: boolean;
    have_cash: boolean;
    have_fast_payment_system: boolean;
    allowed_cod: boolean;
    weight_min: number;
    weight_max: number;
    location: {
        country_code: string;
        region_code: number;
        region: string;
        city_code: number;
        city: string;
        fias_guid: string;
        postal_code: string;
        longitude: number;
        latitude: number;
        address: string;
        address_full: string;
        city_uuid: string;
    },
    distance: number;
    fulfillment: boolean;
}

export interface CdekCredentials {
  city_code?: number;
  country_code: string;
  radius: number;
  latitude: number;
  longitude: number;
}

export interface Suggestion {
  value: string;
  unrestricted_value: string;
  data: {
    postal_code: string;
    is_closed: boolean;
    type_code: 'ГОПС' | 'УДПП';
    address_str: string;
    address_kladr_id: string;
    address_qc: string;
    geo_lat: number;
    geo_lon: number;
    schedule_mon: Date;
    schedule_tue: Date;
    schedule_wed: Date;
    schedule_thu: Date;
    schedule_fri: Date;
    schedule_sat?: Date;
    schedule_sun?: Date;
  }
}
