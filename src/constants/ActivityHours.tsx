export const ACTIVITY_HOURS_CATEGORIES = [
  {
    title: "กิจกรรมมหาวิทยาลัย",
    key: "university_activities",
    placeholder: "กรอกจำนวนชั่วโมงกิจกรรมมหาวิทยาลัย",
  },
  {
    title: "กิจกรรมเพื่อสังคม",
    key: "social_activities",
    placeholder: "กรอกจำนวนชั่วโมงกิจกรรมเพื่อสังคม",
  },
  {
    title: "กิจกรรมเสริมสร้างสมรรถนะ",
    key: "competency_development_activities",
    fields: [
      {
        name: "virtue",
        title: "คุณธรรมจริยธรรม",
        placeholder: "กรอกจำนวนชั่วโมงด้านคุณธรรมจริยธรรม",
      },
      {
        name: "thinking_and_learning",
        title: "การคิดและการเรียนรู้",
        placeholder: "กรอกจำนวนชั่วโมงด้านการคิดและการเรียนรู้",
      },
      {
        name: "interpersonal_relationships_and_communication",
        title: "ความสัมพันธ์ระหว่างบุคคล",
        placeholder:
          "กรอกจำนวนชั่วโมงด้านความสัมพ์ระหว่างระหว่างบุคคลและการสื่อสาร",
      },
      {
        name: "health",
        title: "สุขภาพและการออกกำลังกาย",
        placeholder: "กรอกจำนวนชั่วโมงด้านสุขภาพ",
      },
    ],
  },
];
