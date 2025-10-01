import { ProjectFormData } from "@/interface/projectFormData";

// Constants
const ACTIVITY_CODE_LENGTH = 12;
const ORG_ID_LENGTH = 12;

// Error message mappings
const ERROR_MESSAGES = {
  // Activity code errors
  activityCode: "กรุณากรอกรหัสกิจกรรม",
  activityCodeFormat: "รหัสกิจกรรมไม่ตรงรูปแบบรหัสองค์กร",
  activityCodeMismatch: "รหัสกิจกรรมไม่ตรงรูปแบบรหัสองค์กร",
  orgIdLength: "รหัสองค์กรต้องมี 12 ตัวอักษร",
  
  // Basic field errors
  nameTh: "กรุณากรอกชื่อโครงการภาษาไทย",
  nameEn: "กรุณากรอกชื่อโครงการภาษาอังกฤษ",
  dateStart: "กรุณากรอกวันที่เริ่มต้น",
  dateEnd: "กรุณากรอกวันที่สิ้นสุด",
  dateRange: "วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น",
  objectives: "กรุณากรอกวัตถุประสงค์",
  kasetsartStudentIdentities: "กรุณากรอก IDKU",
  budgetNegative: "งบประมาณต้องไม่ติดลบ",
  
  // Location errors
  location: "กรุณากรอกสถานที่จัดกิจกรรม",
  postcode: "กรุณากรอกรหัสไปรษณีย์",
  city: "กรุณากรอกอำเภอ/เขต",
  province: "กรุณากรอกจังหวัด",
} as const;

/**
 * ตรวจสอบความถูกต้องของรหัสกิจกรรม
 */
export const activityCodeValidate = (activityCode: string, orgId: string): boolean => {
  // ตรวจสอบรูปแบบ
  if (!/^\d{12}$/.test(activityCode) || orgId.length !== ORG_ID_LENGTH) {
    return false;
  }

  // ตรวจสอบว่าตัวเลขในตำแหน่งเดียวกันตรงกันหรือไม่
  for (let i = 0; i < ACTIVITY_CODE_LENGTH; i++) {
    if (/\d/.test(orgId[i]) && orgId[i] !== activityCode[i]) {
      return false;
    }
  }

  return true;
};

/**
 * ตรวจสอบฟิลด์พื้นฐาน
 */
const validateBasicFields = (formData: ProjectFormData): string[] => {
  const errors: string[] = [];

  if (!formData.activityCode) {
    errors.push(ERROR_MESSAGES.activityCode);
  } else if (!/^\d{12}$/.test(formData.activityCode)) {
    errors.push(ERROR_MESSAGES.activityCodeFormat);
  }

  if (!formData.nameTh) errors.push(ERROR_MESSAGES.nameTh);
  if (!formData.nameEn) errors.push(ERROR_MESSAGES.nameEn);
  if (!formData.dateStart) errors.push(ERROR_MESSAGES.dateStart);
  if (!formData.dateEnd) errors.push(ERROR_MESSAGES.dateEnd);
  if (!formData.objectives) errors.push(ERROR_MESSAGES.objectives);
  
  if (!formData.kasetsartStudentIdentities || formData.kasetsartStudentIdentities.length === 0) {
    errors.push(ERROR_MESSAGES.kasetsartStudentIdentities);
  }

  return errors;
};

/**
 * ตรวจสอบวันที่และช่วงเวลา
 */
const validateDates = (formData: ProjectFormData): string[] => {
  const errors: string[] = [];

  if (formData.dateStart && formData.dateEnd && formData.dateEnd < formData.dateStart) {
    errors.push(ERROR_MESSAGES.dateRange);
  }

  return errors;
};

/**
 * ตรวจสอบตัวเลขที่ต้องไม่เป็นค่าลบ
 */
const validateNumericFields = (formData: ProjectFormData): string[] => {
  const errors: string[] = [];

  if (formData.budgetUsed < 0) {
    errors.push(ERROR_MESSAGES.budgetNegative);
  }

  if (formData.activityHours?.[0]) {
    Object.entries(formData.activityHours[0]).forEach(([key, value]) => {
      if (typeof value === "number" && value < 0) {
        errors.push(`ชั่วโมงกิจกรรม (${key}) ต้องไม่ติดลบ`);
      }
    });
  }

  return errors;
};

/**
 * ตรวจสอบตารางกิจกรรม
 */
const validateSchedule = (formData: ProjectFormData): string[] => {
  const errors: string[] = [];

  if (!formData.schedule?.[0]) return errors;

  const schedule = formData.schedule[0];

  // ตรวจสอบลำดับวันที่
  for (let i = 1; i < schedule.eachDay.length; i++) {
    if (schedule.eachDay[i].date < schedule.eachDay[i - 1].date) {
      errors.push(`วันที่ #${i + 1} ต้องเรียงลำดับก่อนหลังให้ถูกต้อง`);
    }
  }

  // ตรวจสอบแต่ละวัน
  schedule.eachDay.forEach((day, dayIdx) => {
    // ตรวจสอบว่าวันที่อยู่ในช่วงที่กำหนด
    if ((formData.dateStart && day.date < formData.dateStart) ||
        (formData.dateEnd && day.date > formData.dateEnd)) {
      errors.push(`วันที่ #${dayIdx + 1} ต้องอยู่ในช่วงวันที่จัดกิจกรรม`);
    }

    // ตรวจสอบช่วงเวลา
    day.timeline.forEach((timeline, timelineIdx) => {
      const { timeStart, timeEnd } = timeline;
      const timelineNumber = timelineIdx + 1;
      const dayNumber = dayIdx + 1;

      // ตรวจสอบว่ามีเวลาเริ่มต้นและสิ้นสุด
      if (!timeStart || !timeEnd) {
        errors.push(`กรุณากรอกเวลาเริ่มต้นและเวลาสิ้นสุดของช่วงเวลา #${timelineNumber} ในวันที่ #${dayNumber}`);
        return;
      }

      // ตรวจสอบว่าเวลาสิ้นสุดมากกว่าเวลาเริ่มต้น
      if (timeEnd < timeStart) {
        errors.push(`ช่วงเวลา #${timelineNumber} ของวันที่ #${dayNumber} เวลาสิ้นสุดต้องมากกว่าหรือเท่ากับเวลาเริ่มต้น`);
      }

      // ตรวจสอบการทับซ้อนกับช่วงเวลาก่อนหน้า
      if (timelineIdx > 0) {
        const prevTimeline = day.timeline[timelineIdx - 1];
        const prevEnd = new Date(`${day.date}T${prevTimeline.timeEnd}`);
        const currStart = new Date(`${day.date}T${timeStart}`);
        
        if (currStart < prevEnd) {
          errors.push(`ช่วงเวลา #${timelineNumber} ของวันที่ #${dayNumber} เวลาต้องไม่ทับซ้อนกัน`);
        }
      }
    });
  });

  return errors;
};

/**
 * ตรวจสอบสถานที่
 */
const validateLocation = (formData: ProjectFormData): string[] => {
  const errors: string[] = [];

  if (!formData.location?.location) {
    errors.push(ERROR_MESSAGES.location);
    return errors;
  }

  // ตรวจสอบสถานที่ภายนอก
  if (formData.location.outside) {
    const { postcode,  city, province } = formData.location.outside;
    
    if (!postcode) errors.push(ERROR_MESSAGES.postcode);
    if (!city) errors.push(ERROR_MESSAGES.city);
    if (!province) errors.push(ERROR_MESSAGES.province);
  }

  return errors;
};

/**
 * ตรวจสอบรหัสองค์กรและรหัสกิจกรรม
 */
const validateActivityCode = (formData: ProjectFormData, publicOrgId?: string): string[] => {
  const errors: string[] = [];

  if (publicOrgId && publicOrgId.length !== ORG_ID_LENGTH) {
    errors.push(ERROR_MESSAGES.orgIdLength);
  }

  if (formData.activityCode && publicOrgId &&
      /^\d{12}$/.test(formData.activityCode) &&
      publicOrgId.length === ORG_ID_LENGTH &&
      !activityCodeValidate(formData.activityCode, publicOrgId)) {
    errors.push(ERROR_MESSAGES.activityCodeMismatch);
  }

  return errors;
};

/**
 * ตรวจสอบความถูกต้องของฟอร์มโครงการ
 */
export function validateProjectForm(formData: ProjectFormData, publicOrgId?: string): string[] {
  const validationResults = [
    validateBasicFields(formData),
    validateDates(formData),
    validateNumericFields(formData),
    validateSchedule(formData),
    validateLocation(formData),
    validateActivityCode(formData, publicOrgId),
  ];

  return validationResults.flat();
}

/**
 * แปลงข้อความ error ให้เป็นภาษาไทยที่เหมาะสม
 */
export function getErrorMessage(error: string): string {
  // ตรวจสอบข้อความที่มีรูปแบบพิเศษ
  const specialPatterns = [
    "กรุณากรอกเวลาเริ่มต้นและเวลาสิ้นสุดของช่วงเวลา",
    "เวลาต้องไม่ทับซ้อนกัน",
    "ต้องเรียงลำดับก่อนหลังให้ถูกต้อง",
    "ต้องอยู่ในช่วงวันที่จัดกิจกรรม",
    "เวลาสิ้นสุดต้องมากกว่าหรือเท่ากับเวลาเริ่มต้น",
    "ต้องไม่ติดลบ"
  ];

  // ถ้าข้อความตรงกับรูปแบบพิเศษ ให้ส่งกลับทันที
  if (specialPatterns.some(pattern => error.includes(pattern))) {
    return error;
  }

  // แปลงตาม mapping table
  const errorKey = error as keyof typeof ERROR_MESSAGES;
  return ERROR_MESSAGES[errorKey] || error;
}