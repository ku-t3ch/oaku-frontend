import { ProjectFormData } from "@/interface/projectFormData";

export function validateProjectForm(formData: ProjectFormData): string[] {
  const errors: string[] = [];

  // 1. วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น
  if (formData.dateStart && formData.dateEnd && formData.dateEnd < formData.dateStart) {
    errors.push("วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น");
  }

  // 2. input ตัวเลขห้ามติดลบ
  if (formData.budgetUsed < 0) {
    errors.push("งบประมาณต้องไม่ติดลบ");
  }
  if (formData.activityHours && formData.activityHours[0]) {
    Object.entries(formData.activityHours[0]).forEach(([key, value]) => {
      if (typeof value === "number" && value < 0) {
        errors.push(`ชั่วโมงกิจกรรม (${key}) ต้องไม่ติดลบ`);
      }
    });
  }

  // 3. ตารางกิจกรรม: วันต้องอยู่ในช่วงวันที่จัดกิจกรรม
  if (formData.schedule && Array.isArray(formData.schedule) && formData.schedule[0]) {
    const schedule = formData.schedule[0];
    // ตรวจสอบวันต้องเรียงลำดับ (ไม่ย้อนกลับ)
    for (let i = 1; i < schedule.eachDay.length; i++) {
      if (schedule.eachDay[i].date < schedule.eachDay[i - 1].date) {
        errors.push(`วันที่ #${i + 1} ต้องเรียงลำดับก่อนหลังให้ถูกต้อง`);
      }
    }
    schedule.eachDay.forEach((day, dayIdx) => {
      if (
        (formData.dateStart && day.date < formData.dateStart) ||
        (formData.dateEnd && day.date > formData.dateEnd)
      ) {
        errors.push(`วันที่ #${dayIdx + 1} ต้องอยู่ในช่วงวันที่จัดกิจกรรม`);
      }
      // ตรวจสอบ timeline
      day.timeline.forEach((tl, tlIdx) => {
        if (tl.timeStart && tl.timeEnd && tl.timeEnd < tl.timeStart) {
          errors.push(`ช่วงเวลา #${tlIdx + 1} ของวันที่ #${dayIdx + 1} เวลาสิ้นสุดต้องมากกว่าหรือเท่ากับเวลาเริ่มต้น`);
        }
        if (!tl.timeStart || !tl.timeEnd) {
          errors.push(`กรุณากรอกเวลาเริ่มต้นและเวลาสิ้นสุดของช่วงเวลา #${tlIdx + 1} ในวันที่ #${dayIdx + 1}`);
        }
        if (tlIdx > 0) {
          const prev = day.timeline[tlIdx - 1];
          // สร้าง Date object โดยใช้วัน เดือน ปี และเวลา
          const prevEnd = new Date(`${day.date}T${prev.timeEnd}`);
          const currStart = new Date(`${day.date}T${tl.timeStart}`);
          if (currStart < prevEnd) {
            errors.push(`ช่วงเวลา #${tlIdx + 1} ของวันที่ #${dayIdx + 1} เวลาต้องไม่ทับซ้อนกัน`);
          }
        }
      });
    });
  }

  // 4. ตรวจสอบ input ที่จำเป็นต้องกรอก
  if (!formData.activityCode) errors.push("กรุณากรอกรหัสกิจกรรม");
  if (!formData.nameTh) errors.push("กรุณากรอกชื่อโครงการภาษาไทย");
  if (!formData.nameEn) errors.push("กรุณากรอกชื่อโครงการภาษาอังกฤษ");
  if (!formData.dateStart) errors.push("กรุณากรอกวันที่เริ่มต้น");
  if (!formData.dateEnd) errors.push("กรุณากรอกวันที่สิ้นสุด");
  if (!formData.objectives) errors.push("กรุณากรอกวัตถุประสงค์");
  if (!formData.location || !formData.location.location) errors.push("กรุณากรอกสถานที่จัดกิจกรรม");
  if (formData.location?.outside) {
    if (!formData.location.outside.postcode) errors.push("กรุณากรอกรหัสไปรษณีย์");
    if (!formData.location.outside.address) errors.push("กรุณากรอกที่อยู่");
    if (!formData.location.outside.city) errors.push("กรุณากรอกอำเภอ/เขต");
    if (!formData.location.outside.province) errors.push("กรุณากรอกจังหวัด");
  }

  return errors;
}