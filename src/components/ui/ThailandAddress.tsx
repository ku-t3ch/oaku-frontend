import { Input } from "@mantine/core";
import clsx from "clsx";
import { ThailandAddressTypeahead } from "react-thailand-address-typeahead";
import Highlighter from "react-highlight-words";

interface ThailandAddressProps {
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

export default function ThailandAddress(props: ThailandAddressProps) {
  const inputClass =
    "py-2 px-2 border border-gray-300 w-full rounded-xl focus:border-[#006C67] focus:ring-1 focus:ring-[#006C67] transition-all bg-white text-gray-900 placeholder-gray-400";

  return (
    <ThailandAddressTypeahead
      value={{
        district: props.value.district,
        subdistrict: props.value.subdistrict,
        province: props.value.province,
        postalCode: props.value.postalCode,
      }}
      onValueChange={(val) => {
        props.onValueChange({
          subdistrict: val.subdistrict,
          district: val.district,
          province: val.province,
          postalCode: val.postalCode,
        });
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input.Wrapper label="ตำบล / แขวง">
            <ThailandAddressTypeahead.SubdistrictInput
              className={clsx(inputClass)}
              placeholder="เช่น ลาดพร้าว"
            />
          </Input.Wrapper>
          <Input.Wrapper label="อำเภอ / เขต">
            <ThailandAddressTypeahead.DistrictInput
              className={clsx(inputClass)}
              placeholder="เช่น จตุจักร"
            />
          </Input.Wrapper>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input.Wrapper label="จังหวัด">
            <ThailandAddressTypeahead.ProvinceInput
              className={clsx(inputClass)}
              placeholder="เช่น กรุงเทพมหานคร"
            />
          </Input.Wrapper>
          <Input.Wrapper label="รหัสไปรษณีย์">
            <ThailandAddressTypeahead.PostalCodeInput
              className={clsx(inputClass)}
              placeholder="เช่น 10900"
            />
          </Input.Wrapper>
        </div>
      </div>
      <ThailandAddressTypeahead.CustomSuggestion>
        {(suggestions, shouldDisplaySuggestion, onSuggestionSelected) => {
          if (!shouldDisplaySuggestion) {
            return null;
          }
          return (
            <div className=" absolute   border border-gray-200  rounded-xl mt-2 bg-white z-50">
              {suggestions.map((ds, i) => (
                <div
                  onMouseDown={() => onSuggestionSelected(ds)}
                  key={i}
                  className="cursor-pointer px-4 py-2 hover:bg-[#006C67]/10 transition-all"
                >
                  <Highlighter
                    highlightClassName="font-semibold text-[#006C67] bg-[#006C67]/10"
                    unhighlightClassName="text-gray-700"
                    searchClassName="font-semibold text-[#006C67]"

                    searchWords={[
                      props.value.subdistrict,
                      props.value.district,
                      props.value.province,
                      props.value.postalCode,
                    ]}
                    autoEscape={true}
                    textToHighlight={`${ds.subdistrict} | ${ds.district} | ${ds.province} | ${ds.postalCode}`}
                  />
                </div>
              ))}
            </div>
          );
        }}
      </ThailandAddressTypeahead.CustomSuggestion>
    </ThailandAddressTypeahead>
  );
}
