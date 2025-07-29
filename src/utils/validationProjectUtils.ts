import { ProjectFormData } from "@/interface/projectFormData";

// ตรวจสอบรหัสกิจกรรม
export const activityCodeValidate = (
  activityCode: string,
  orgId: string
): boolean => {
  if (!/^\d{12}$/.test(activityCode) || orgId.length !== 12) return false;
  for (let i = 0; i < 12; i++) {
    if (/\d/.test(orgId[i]) && orgId[i] !== activityCode[i]) return false;
  }
  return true;
};

export function validateProjectForm(
  formData: ProjectFormData,
  publicOrgId?: string
): string[] {
  const errors: string[] = [];

  // วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น
  if (
    formData.dateStart &&
    formData.dateEnd &&
    formData.dateEnd < formData.dateStart
  ) {
    errors.push("วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น");
  }

  // ตัวเลขห้ามติดลบ
  if (formData.budgetUsed < 0) errors.push("งบประมาณต้องไม่ติดลบ");
  if (formData.activityHours && formData.activityHours[0]) {
    Object.entries(formData.activityHours[0]).forEach(([key, value]) => {
      if (typeof value === "number" && value < 0)
        errors.push(`ชั่วโมงกิจกรรม (${key}) ต้องไม่ติดลบ`);
    });
  }

  // ตารางกิจกรรม: วันต้องอยู่ในช่วงวันที่จัดกิจกรรม
  if (
    formData.schedule &&
    Array.isArray(formData.schedule) &&
    formData.schedule[0]
  ) {
    const schedule = formData.schedule[0];
    for (let i = 1; i < schedule.eachDay.length; i++) {
      if (schedule.eachDay[i].date < schedule.eachDay[i - 1].date)
        errors.push(`วันที่ #${i + 1} ต้องเรียงลำดับก่อนหลังให้ถูกต้อง`);
    }
    schedule.eachDay.forEach((day, dayIdx) => {
      if (
        (formData.dateStart && day.date < formData.dateStart) ||
        (formData.dateEnd && day.date > formData.dateEnd)
      ) {
        errors.push(`วันที่ #${dayIdx + 1} ต้องอยู่ในช่วงวันที่จัดกิจกรรม`);
      }
      day.timeline.forEach((tl, tlIdx) => {
        if (tl.timeStart && tl.timeEnd && tl.timeEnd < tl.timeStart) {
          errors.push(
            `ช่วงเวลา #${tlIdx + 1} ของวันที่ #${dayIdx + 1} เวลาสิ้นสุดต้องมากกว่าหรือเท่ากับเวลาเริ่มต้น`
          );
        }
        if (!tl.timeStart || !tl.timeEnd) {
          errors.push(
            `กรุณากรอกเวลาเริ่มต้นและเวลาสิ้นสุดของช่วงเวลา #${tlIdx + 1} ในวันที่ #${dayIdx + 1}`
          );
        }
        if (tlIdx > 0) {
          const prev = day.timeline[tlIdx - 1];
          const prevEnd = new Date(`${day.date}T${prev.timeEnd}`);
          const currStart = new Date(`${day.date}T${tl.timeStart}`);
          if (currStart < prevEnd) {
            errors.push(
              `ช่วงเวลา #${tlIdx + 1} ของวันที่ #${dayIdx + 1} เวลาต้องไม่ทับซ้อนกัน`
            );
          }
        }
      });
    });
  }

  // ตรวจสอบ input ที่จำเป็นต้องกรอก
  if (!formData.activityCode) {
    errors.push("กรุณากรอกรหัสกิจกรรม");
  } else if (!/^\d{12}$/.test(formData.activityCode)) {
    errors.push("รหัสกิจกรรมต้องเป็นเลขล้วน 12 หลัก");
  }

  if (publicOrgId && publicOrgId.length !== 12) {
    errors.push("รหัสองค์กรต้องมี 12 ตัวอักษร");
  }

  if (
    formData.activityCode &&
    publicOrgId &&
    /^\d{12}$/.test(formData.activityCode) &&
    publicOrgId.length === 12 &&
    !activityCodeValidate(formData.activityCode, publicOrgId)
  ) {
    errors.push("รหัสกิจกรรมไม่ตรงกับองค์กรเดิม");
  }
  if (!formData.nameTh) errors.push("กรุณากรอกชื่อโครงการภาษาไทย");
  if (!formData.nameEn) errors.push("กรุณากรอกชื่อโครงการภาษาอังกฤษ");
  if (!formData.dateStart) errors.push("กรุณากรอกวันที่เริ่มต้น");
  if (!formData.dateEnd) errors.push("กรุณากรอกวันที่สิ้นสุด");
  if (!formData.objectives) errors.push("กรุณากรอกวัตถุประสงค์");
  if (!formData.location || !formData.location.location)
    errors.push("กรุณากรอกสถานที่จัดกิจกรรม");
  if (formData.location?.outside) {
    if (!formData.location.outside.postcode)
      errors.push("กรุณากรอกรหัสไปรษณีย์");
    if (!formData.location.outside.address) errors.push("กรุณากรอกที่อยู่");
    if (!formData.location.outside.city) errors.push("กรุณากรอกอำเภอ/เขต");
    if (!formData.location.outside.province) errors.push("กรุณากรอกจังหวัด");
  }

  return errors;
}

// แปลง error code หรือข้อความ error ให้เป็นข้อความภาษาไทยที่เหมาะสม
export function getErrorMessage(error: string): string {
  if (error.startsWith("กรุณากรอกเวลาเริ่มต้นและเวลาสิ้นสุดของช่วงเวลา")) return error;
  if (error.startsWith("ช่วงเวลา") && error.includes("เวลาต้องไม่ทับซ้อนกัน")) return error;
  if (error.startsWith("วันที่ ") && error.includes("ต้องเรียงลำดับก่อนหลังให้ถูกต้อง")) return error;
  if (error.startsWith("วันที่ ") && error.includes("ต้องอยู่ในช่วงวันที่จัดกิจกรรม")) return error;
  if (error.startsWith("ช่วงเวลา") && error.includes("เวลาสิ้นสุดต้องมากกว่าหรือเท่ากับเวลาเริ่มต้น")) return error;
  if (error.startsWith("ชั่วโมงกิจกรรม") && error.includes("ต้องไม่ติดลบ")) return error;

  switch (error) {
    case "กรุณากรอกรหัสกิจกรรม":
    case "activityCode":
      return "กรุณากรอกรหัสกิจกรรม";
    case "รหัสกิจกรรมต้องเป็นเลขล้วน 12 หลัก":
      return "รหัสกิจกรรมไม่ตรงรูปแบบรหัสองค์กร";
    case "รหัสกิจกรรมไม่ตรงกับองค์กรเดิม":
      return "รหัสกิจกรรมไม่ตรงรูปแบบรหัสองค์กร";
    case "รหัสองค์กรต้องมี 12 ตัวอักษร":
      return "รหัสองค์กรต้องมี 12 ตัวอักษร";
    case "กรุณากรอกชื่อโครงการภาษาไทย":
    case "nameTh":
      return "กรุณากรอกชื่อโครงการภาษาไทย";
    case "กรุณากรอกชื่อโครงการภาษาอังกฤษ":
    case "nameEn":
      return "กรุณากรอกชื่อโครงการภาษาอังกฤษ";
    case "กรุณากรอกวันที่เริ่มต้น":
    case "dateStart":
      return "กรุณากรอกวันที่เริ่มต้น";
    case "กรุณากรอกวันที่สิ้นสุด":
    case "dateEnd":
      return "กรุณากรอกวันที่สิ้นสุด";
    case "วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น":
      return "วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น";
    case "กรุณากรอกวัตถุประสงค์":
    case "objectives":
      return "กรุณากรอกวัตถุประสงค์";
    case "งบประมาณต้องไม่ติดลบ":
    case "budgetUsed":
      return "งบประมาณต้องไม่ติดลบ";
    case "กรุณากรอกสถานที่จัดกิจกรรม":
    case "location":
      return "กรุณากรอกสถานที่จัดกิจกรรม";
    case "กรุณากรอกรหัสไปรษณีย์":
    case "location.outside.postcode":
      return "กรุณากรอกรหัสไปรษณีย์";
    case "กรุณากรอกที่อยู่":
    case "location.outside.address":
      return "กรุณากรอกที่อยู่";
    case "กรุณากรอกอำเภอ/เขต":
    case "location.outside.city":
      return "กรุณากรอกอำเภอ/เขต";
    case "กรุณากรอกจังหวัด":
    case "location.outside.province":
      return "กรุณากรอกจังหวัด";
    default:
      return error;
  }
}