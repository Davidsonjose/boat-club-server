export enum CompanyId {
  CHEVY = 1,
  KIGRA = 2,
  LEKKI_COUNTY = 3,
  PINNOCK = 4,
  ORAL = 5,
  SHONIBARE = 6,
}

export enum CompanyEnum {
  CHEVY = 'chevyView',
  KIGRA = 'kigra',
  PINNOCK = 'pinnock',
  ORAL = 'oral',
  LEKKI_COUNTY = 'lekkiCounty',
  SHONIBARE = 'shonibare',
}

const companyId = 1;

const companyDetails = () => {
  if (companyId == CompanyId.CHEVY) {
    return {
      host: 'companyhost',
      user: 'companyuser',
      pass: 'companypass',
    };
  } else if (companyId == CompanyId.KIGRA) {
    return {
      host: 'companyhost',
      user: 'companyuser',
      pass: 'companypass',
    };
  }
  /// and so on
};

const companydetails = companyDetails();

export class CompantDetailsDto {
  host: string;
  user: string;
  pass: string;
}
