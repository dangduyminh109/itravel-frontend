export interface Province {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  WardList: Ward[];
}

export interface Ward {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  province_code: number;
}
