import { ProjectFormData } from "@/interface/projectFormData";

export function validateProjectForm(formData: ProjectFormData): string[] {
  const errors: string[] = [];

  // 1. วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น
  if (formData.dateStart && formData.dateEnd && formData.dateEnd < formData.dateStart) {
    errors.push("dateEnd");
  }

  // 2. input ตัวเลขห้ามติดลบ
  if (formData.budgetUsed < 0) {
    errors.push("budgetUsed");
  }
  if (formData.activityHours && formData.activityHours[0]) {
    Object.entries(formData.activityHours[0]).forEach(([key, value]) => {
      if (typeof value === "number" && value < 0) {
        errors.push(`activityHours.${key}`);
      }
    });
  }

  // 3. ตารางกิจกรรม: วันต้องอยู่ในช่วงวันที่จัดกิจกรรม
  if (formData.schedule && Array.isArray(formData.schedule)) {
    formData.schedule.forEach((loc, locIdx) => {
      // ตรวจสอบวันในแต่ละสถานที่ต้องเรียงลำดับ (ไม่ย้อนกลับ)
      for (let i = 1; i < loc.eachDay.length; i++) {
        if (loc.eachDay[i].date < loc.eachDay[i - 1].date) {
          errors.push(`schedule.${locIdx}.eachDay.${i}.dateOrder`);
        }
      }
      loc.eachDay.forEach((day, dayIdx) => {
        if (
          (formData.dateStart && day.date < formData.dateStart) ||
          (formData.dateEnd && day.date > formData.dateEnd)
        ) {
          errors.push(`schedule.${locIdx}.eachDay.${dayIdx}.date`);
        }
        // 4. ตรวจสอบเวลาที่จัดไม่ให้ย้อนแย้งกัน
        day.timeline.forEach((tl, tlIdx) => {
          if (tl.timeStart && tl.timeEnd && tl.timeEnd < tl.timeStart) {
            errors.push(`schedule.${locIdx}.eachDay.${dayIdx}.timeline.${tlIdx}.time`);
          }
          // ตรวจสอบว่าเวลาต้องไม่ว่าง
          if (!tl.timeStart || !tl.timeEnd) {
            errors.push(`schedule.${locIdx}.eachDay.${dayIdx}.timeline.${tlIdx}.timeRequired`);
          }
          // ตรวจสอบช่วงเวลาในแต่ละวันต้องเรียงลำดับ (ไม่ขัดแย้งกัน)
          if (tlIdx > 0) {
            const prev = day.timeline[tlIdx - 1];
            if (tl.timeStart < prev.timeEnd) {
              errors.push(`schedule.${locIdx}.eachDay.${dayIdx}.timeline.${tlIdx}.timeConflict`);
            }
          }
        });
      });
    });
  }

  // 5. ตรวจสอบ input ที่จำเป็นต้องกรอก
  if (!formData.activityCode) errors.push("activityCode");
  if (!formData.nameTh) errors.push("nameTh");
  if (!formData.nameEn) errors.push("nameEn");
  if (!formData.dateStart) errors.push("dateStart");
  if (!formData.dateEnd) errors.push("dateEnd");
  if (!formData.objectives) errors.push("objectives");
  if (!formData.location || !formData.location.location) errors.push("location");
  if (formData.location?.outside) {
    if (!formData.location.outside.postcode) errors.push("location.outside.postcode");
    if (!formData.location.outside.address) errors.push("location.outside.address");
    if (!formData.location.outside.city) errors.push("location.outside.city");
    if (!formData.location.outside.province) errors.push("location.outside.province");
  }


  return errors;
}