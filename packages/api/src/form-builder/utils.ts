import validator from 'validator';

export type vfn = (value: string) => boolean;

export function utils(
  type: StringValidateTypes | NumberValidateTypes,
  options: any
): vfn {
  return (value) => {
    return (validator as any)['is' + type]?.(value, options) || true;
  };
}
export type NumberValidateTypes = 'Integer' | 'Float' | 'range';

export type StringValidateTypes =
  | 'Base32'
  | 'Base58'
  | 'Base64'
  | 'BIC'
  | 'BtcAddress'
  | 'DataURI'
  | 'EthereumAddress'
  | 'FullWidth'
  | 'HexColor'
  | 'HSL'
  | 'Hexadecimal'
  | 'HalfWidth'
  | 'IBAN'
  | 'ISIN'
  | 'ISO4217'
  | 'ISRC'
  | 'JSON'
  | 'JWT'
  | 'LatLong'
  | 'Locale'
  | 'Lowercase'
  | 'MongoId'
  | 'MD5'
  | 'MagnetURI'
  | 'MimeType'
  | 'Port'
  | 'RFC3339'
  | 'SemVer'
  | 'Slug'
  | 'SurrogatePair'
  | 'Uppercase'
  | 'VariableWidth'
  | 'length'
  | 'Email'
  | 'range'
  | 'MobilePhone'
  | 'Float'
  | 'Integer'
  | 'Currency'
  | 'Date'
  | 'Decimal'
  | 'FQDN'
  | 'IP'
  | 'IPRange'
  | 'IdentityCard'
  | 'ISSN'
  | 'MACAddress'
  | 'Numeric'
  | 'PassportNumber'
  | 'RgbColor'
  | 'Url'
  | 'UUID';
