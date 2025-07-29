export interface ThailandAddressProps {
  value: {
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
  };
  onValueChange: (val: {
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
  }) => void;
  addressValue: string;
  onAddressChange: (address: string) => void;
}